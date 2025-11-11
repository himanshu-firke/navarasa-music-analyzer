"""
Download Spotify 30-second preview files
Requires: Spotify API credentials (free)

1. Go to: https://developer.spotify.com/dashboard
2. Create an app
3. Get Client ID and Client Secret
4. Set environment variables:
   set SPOTIFY_CLIENT_ID=your_client_id
   set SPOTIFY_CLIENT_SECRET=your_client_secret
5. Run: python download_previews.py
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
    
    try:
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
    except Exception as e:
        print(f"Error: {e}")
    
    return False

def main():
    if not CLIENT_ID or not CLIENT_SECRET:
        print("ERROR: Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET environment variables")
        print("Get credentials from: https://developer.spotify.com/dashboard")
        return
    
    # Get access token
    print("Getting Spotify API access token...")
    token = get_access_token()
    print("Authenticated!")
    
    # Process each emotion
    emotions = ['karuna', 'hasya', 'shanta', 'raudra', 'veera', 
                'shringara', 'bhayanaka', 'adbhuta', 'bibhatsa']
    
    for emotion in emotions:
        csv_file = f"{emotion}_songs.csv"
        if not os.path.exists(csv_file):
            continue
        
        print(f"\nDownloading {emotion} songs...")
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
                print(f"   Downloaded: {track_name}")
            else:
                print(f"   No preview: {track_name}")
            
            time.sleep(0.1)  # Rate limiting
        
        print(f"OK {emotion}: {success_count}/{len(df)} songs downloaded")
    
    print("\nDownload complete!")

if __name__ == "__main__":
    main()
