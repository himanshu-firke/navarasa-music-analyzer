"""
Prepare training dataset from Spotify CSV file
Maps audio features to Navarasa emotions and downloads previews

Usage:
    python prepare_spotify_dataset.py --csv ../archive/spotify_songs.csv --output dataset
"""

import pandas as pd
import os
import argparse
from pathlib import Path

def map_to_navarasa(row):
    """
    Map Spotify audio features to Navarasa emotions
    
    Key features:
    - valence: 0 (negative) to 1 (positive)
    - energy: 0 (calm) to 1 (energetic)
    - tempo: BPM
    - acousticness: 0 (not acoustic) to 1 (acoustic)
    """
    valence = row['valence']
    energy = row['energy']
    tempo = row['tempo']
    acousticness = row['acousticness']
    danceability = row['danceability']
    
    # Initialize scores for each emotion
    scores = {}
    
    # KARUNA (Sadness) - Low valence, low energy, slow tempo
    scores['karuna'] = (
        (1 - valence) * 0.5 +  # Low positivity = sad
        (1 - energy) * 0.3 +    # Low energy = sad
        (1 if tempo < 90 else 0) * 0.2  # Slow tempo
    )
    
    # HASYA (Joy) - High valence, high energy, high danceability
    scores['hasya'] = (
        valence * 0.4 +         # High positivity = happy
        energy * 0.3 +          # High energy = happy
        danceability * 0.3      # Danceable = happy
    )
    
    # SHANTA (Peace) - Medium valence, low energy, acoustic
    scores['shanta'] = (
        (1 if 0.3 < valence < 0.7 else 0) * 0.3 +  # Neutral valence
        (1 - energy) * 0.4 +    # Low energy = peaceful
        acousticness * 0.3      # Acoustic = peaceful
    )
    
    # RAUDRA (Anger) - Low valence, very high energy, fast tempo
    scores['raudra'] = (
        (1 - valence) * 0.3 +   # Negative emotion
        (energy if energy > 0.7 else 0) * 0.5 +  # Very high energy
        (1 if tempo > 140 else 0) * 0.2  # Fast tempo
    )
    
    # VEERA (Courage) - High valence, high energy, moderate tempo
    scores['veera'] = (
        valence * 0.3 +         # Positive
        energy * 0.4 +          # High energy
        (1 if 110 < tempo < 140 else 0) * 0.3  # Moderate-fast tempo
    )
    
    # SHRINGARA (Romance) - Medium-high valence, low-medium energy, acoustic
    scores['shringara'] = (
        (1 if 0.4 < valence < 0.8 else 0) * 0.4 +  # Warm, positive
        (1 if 0.3 < energy < 0.7 else 0) * 0.3 +    # Moderate energy
        acousticness * 0.3      # Acoustic/smooth
    )
    
    # BHAYANAKA (Fear) - Low valence, variable energy (extremes)
    scores['bhayanaka'] = (
        (1 - valence) * 0.5 +   # Negative emotion
        (1 if energy < 0.3 or energy > 0.8 else 0) * 0.5  # Extreme energy
    )
    
    # ADBHUTA (Wonder) - High valence, medium-high energy, electronic/instrumental
    scores['adbhuta'] = (
        valence * 0.4 +         # Positive
        (1 if 0.5 < energy < 0.8 else 0) * 0.3 +  # Medium-high energy
        (1 - acousticness) * 0.3  # Electronic/non-acoustic
    )
    
    # BIBHATSA (Disgust) - Very low valence, harsh/extreme
    scores['bibhatsa'] = (
        (1 if valence < 0.2 else 0) * 0.6 +  # Very negative
        (1 if energy > 0.8 else 0) * 0.4     # Very intense
    )
    
    # Return emotion with highest score
    best_emotion = max(scores, key=scores.get)
    confidence = scores[best_emotion]
    
    return best_emotion, confidence

def filter_and_organize(csv_path, output_dir, songs_per_emotion=100):
    """
    Filter songs from CSV and organize by emotion
    """
    print(f"📊 Reading CSV: {csv_path}")
    df = pd.read_csv(csv_path)
    
    print(f"✅ Loaded {len(df)} songs")
    print(f"\n📈 Audio feature ranges:")
    print(f"   Valence: {df['valence'].min():.2f} - {df['valence'].max():.2f}")
    print(f"   Energy: {df['energy'].min():.2f} - {df['energy'].max():.2f}")
    print(f"   Tempo: {df['tempo'].min():.0f} - {df['tempo'].max():.0f} BPM")
    
    # Map each song to an emotion
    print(f"\n🎯 Mapping songs to Navarasa emotions...")
    df['emotion'], df['confidence'] = zip(*df.apply(map_to_navarasa, axis=1))
    
    # Filter by confidence (keep only high-confidence mappings)
    df_filtered = df[df['confidence'] > 0.5]
    print(f"✅ {len(df_filtered)} songs with confidence > 0.5")
    
    # Count songs per emotion
    print(f"\n📊 Songs per emotion:")
    emotion_counts = df_filtered['emotion'].value_counts()
    for emotion, count in emotion_counts.items():
        print(f"   {emotion}: {count}")
    
    # Select top N songs per emotion (highest confidence)
    selected_songs = {}
    for emotion in ['karuna', 'hasya', 'shanta', 'raudra', 'veera', 
                    'shringara', 'bhayanaka', 'adbhuta', 'bibhatsa']:
        
        emotion_df = df_filtered[df_filtered['emotion'] == emotion]
        
        if len(emotion_df) > 0:
            # Sort by confidence and take top N
            top_songs = emotion_df.nlargest(songs_per_emotion, 'confidence')
            selected_songs[emotion] = top_songs
            
            print(f"\n✅ Selected {len(top_songs)} songs for {emotion}")
            print(f"   Avg confidence: {top_songs['confidence'].mean():.2f}")
            print(f"   Avg valence: {top_songs['valence'].mean():.2f}")
            print(f"   Avg energy: {top_songs['energy'].mean():.2f}")
    
    # Save song lists to CSV files
    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)
    
    for emotion, songs_df in selected_songs.items():
        csv_file = output_path / f"{emotion}_songs.csv"
        songs_df.to_csv(csv_file, index=False)
        print(f"💾 Saved {len(songs_df)} songs to {csv_file}")
    
    # Create summary
    summary_file = output_path / "dataset_summary.txt"
    with open(summary_file, 'w') as f:
        f.write("Navarasa Dataset Summary\n")
        f.write("=" * 50 + "\n\n")
        for emotion, songs_df in selected_songs.items():
            f.write(f"{emotion.upper()}: {len(songs_df)} songs\n")
            f.write(f"  Avg Valence: {songs_df['valence'].mean():.2f}\n")
            f.write(f"  Avg Energy: {songs_df['energy'].mean():.2f}\n")
            f.write(f"  Avg Tempo: {songs_df['tempo'].mean():.0f} BPM\n")
            f.write(f"  Avg Confidence: {songs_df['confidence'].mean():.2f}\n\n")
    
    print(f"\n✅ Dataset preparation complete!")
    print(f"📁 Output directory: {output_path}")
    print(f"📊 Summary saved to: {summary_file}")
    
    return selected_songs

def create_download_script(output_dir):
    """
    Create a script to download Spotify previews using Spotify API
    """
    script_path = Path(output_dir) / "download_previews.py"
    
    script_content = '''"""
Download Spotify 30-second preview files
Requires: spotify API credentials (free)

1. Go to: https://developer.spotify.com/dashboard
2. Create an app
3. Get Client ID and Client Secret
4. Set environment variables:
   - SPOTIFY_CLIENT_ID
   - SPOTIFY_CLIENT_SECRET
"""

import pandas as pd
import requests
import os
from pathlib import Path
import time
from base64 import b64encode

# Get Spotify credentials from environment
CLIENT_ID = os.getenv('SPOTIFY_CLIENT_ID')
CLIENT_SECRET = os.getenv('SPOTIFY_CLIENT_SECRET')

def get_access_token():
    """Get Spotify API access token"""
    auth_string = f"{CLIENT_ID}:{CLIENT_SECRET}"
    auth_bytes = auth_string.encode("utf-8")
    auth_base64 = b64encode(auth_bytes).decode("utf-8")
    
    url = "https://accounts.spotify.com/api/token"
    headers = {
        "Authorization": f"Basic {auth_base64}",
        "Content-Type": "application/x-www-form-urlencoded"
    }
    data = {"grant_type": "client_credentials"}
    
    response = requests.post(url, headers=headers, data=data)
    return response.json()["access_token"]

def download_preview(track_id, output_file, token):
    """Download 30-second preview for a track"""
    # Get track info
    url = f"https://api.spotify.com/v1/tracks/{track_id}"
    headers = {"Authorization": f"Bearer {token}"}
    
    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        return False
    
    track_data = response.json()
    preview_url = track_data.get('preview_url')
    
    if not preview_url:
        return False
    
    # Download preview
    audio_response = requests.get(preview_url)
    if audio_response.status_code == 200:
        with open(output_file, 'wb') as f:
            f.write(audio_response.content)
        return True
    
    return False

def main():
    if not CLIENT_ID or not CLIENT_SECRET:
        print("❌ Error: Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET environment variables")
        print("   Get credentials from: https://developer.spotify.com/dashboard")
        return
    
    # Get access token
    print("🔑 Getting Spotify API access token...")
    token = get_access_token()
    print("✅ Authenticated!")
    
    # Process each emotion
    emotions = ['karuna', 'hasya', 'shanta', 'raudra', 'veera', 
                'shringara', 'bhayanaka', 'adbhuta', 'bibhatsa']
    
    for emotion in emotions:
        csv_file = f"{emotion}_songs.csv"
        if not os.path.exists(csv_file):
            continue
        
        print(f"\\n📥 Downloading {emotion} songs...")
        df = pd.read_csv(csv_file)
        
        # Create output directory
        output_dir = Path(f"../dataset/{emotion}")
        output_dir.mkdir(parents=True, exist_ok=True)
        
        success_count = 0
        for idx, row in df.iterrows():
            track_id = row['track_id']
            track_name = row['track_name'].replace('/', '_')[:50]  # Sanitize filename
            output_file = output_dir / f"{track_id}.mp3"
            
            if output_file.exists():
                success_count += 1
                continue
            
            if download_preview(track_id, output_file, token):
                success_count += 1
                print(f"   ✅ Downloaded: {track_name}")
            else:
                print(f"   ⚠️ No preview: {track_name}")
            
            time.sleep(0.1)  # Rate limiting
        
        print(f"✅ {emotion}: {success_count}/{len(df)} songs downloaded")
    
    print("\\n🎉 Download complete!")

if __name__ == "__main__":
    main()
'''
    
    with open(script_path, 'w') as f:
        f.write(script_content)
    
    print(f"\n📝 Created download script: {script_path}")
    print(f"\n⚠️ IMPORTANT: To download actual audio files:")
    print(f"   1. Get Spotify API credentials (free): https://developer.spotify.com/dashboard")
    print(f"   2. Set environment variables:")
    print(f"      - SPOTIFY_CLIENT_ID=your_client_id")
    print(f"      - SPOTIFY_CLIENT_SECRET=your_client_secret")
    print(f"   3. cd {output_dir}")
    print(f"   4. python download_previews.py")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Prepare Spotify dataset for Navarasa training')
    parser.add_argument('--csv', type=str, required=True, help='Path to spotify_songs.csv')
    parser.add_argument('--output', type=str, default='spotify_dataset', help='Output directory')
    parser.add_argument('--songs', type=int, default=100, help='Songs per emotion')
    
    args = parser.parse_args()
    
    # Filter and organize songs
    selected_songs = filter_and_organize(args.csv, args.output, args.songs)
    
    # Create download script
    create_download_script(args.output)
    
    print(f"\n✅ Next steps:")
    print(f"   1. Review the filtered songs in {args.output}/*.csv")
    print(f"   2. Get Spotify API credentials")
    print(f"   3. Run download script to get audio files")
    print(f"   4. Train model: python train_model.py --dataset dataset")
