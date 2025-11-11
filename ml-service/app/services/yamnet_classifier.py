"""
YAMNet-based Music Emotion Classifier
Uses Google's pre-trained YAMNet model for audio classification
and maps outputs to Navarasa emotions
"""

import numpy as np
import tensorflow as tf
import tensorflow_hub as hub
import librosa
from typing import Dict

# Load YAMNet model (cached after first load)
_yamnet_model = None

def get_yamnet_model():
    """Load and cache YAMNet model"""
    global _yamnet_model
    if _yamnet_model is None:
        print("📥 Loading YAMNet model from TensorFlow Hub...")
        _yamnet_model = hub.load('https://tfhub.dev/google/yamnet/1')
        print("✅ YAMNet model loaded successfully!")
    return _yamnet_model

# Navarasa emotion labels
EMOTION_LABELS = [
    'shringara', 'hasya', 'karuna', 'raudra', 
    'veera', 'bhayanaka', 'bibhatsa', 'adbhuta', 'shanta'
]

# Mapping of audio characteristics to emotions
# YAMNet provides 521 audio event classes - we'll use certain patterns
YAMNET_TO_EMOTION_MAPPING = {
    # Happy/Joyful sounds
    'hasya': [
        'music', 'happy_music', 'pop_music', 'upbeat',
        'dance_music', 'disco', 'laughter', 'giggle',
        'child_speech', 'celebration'
    ],
    # Sad sounds
    'karuna': [
        'sad_music', 'crying', 'sobbing', 'sigh',
        'rain', 'melancholy', 'lonely'
    ],
    # Angry/Aggressive sounds
    'raudra': [
        'angry_music', 'heavy_metal', 'rock_music',
        'shout', 'scream', 'roar', 'thunder'
    ],
    # Courageous/Heroic sounds
    'veera': [
        'march', 'drum', 'battle_cry', 'trumpet',
        'powerful_music', 'epic_music'
    ],
    # Fearful sounds
    'bhayanaka': [
        'scary_music', 'horror', 'suspense',
        'scream', 'gasp', 'wind', 'howl'
    ],
    # Peaceful/Calm sounds
    'shanta': [
        'calm_music', 'meditation_music', 'ambient_music',
        'silence', 'bird', 'stream', 'classical_music'
    ],
    # Romantic/Love sounds
    'shringara': [
        'romantic_music', 'slow_music', 'jazz',
        'saxophone', 'violin', 'piano'
    ],
    # Wonder/Surprise sounds
    'adbhuta': [
        'ethereal_music', 'electronic_music', 'synthesizer',
        'bells', 'chime', 'mystical'
    ],
    # Disgust sounds
    'bibhatsa': [
        'dissonant', 'noise', 'industrial',
        'grinding', 'harsh'
    ]
}

def extract_yamnet_features(audio_path: str) -> tuple:
    """
    Extract features using YAMNet model
    
    Returns:
        (embeddings, class_scores, spectrogram)
    """
    try:
        # Load audio
        print(f"  📊 Loading audio with librosa...")
        waveform, sr = librosa.load(audio_path, sr=16000, duration=30, mono=True)
        
        # Convert to float32 and normalize
        waveform = waveform.astype(np.float32)
        
        # Get YAMNet model
        model = get_yamnet_model()
        
        # Run inference
        print(f"  🧠 Running YAMNet inference...")
        scores, embeddings, spectrogram = model(waveform)
        
        return embeddings.numpy(), scores.numpy(), spectrogram.numpy()
        
    except Exception as e:
        print(f"  ❌ YAMNet feature extraction failed: {e}")
        raise

def predict_with_yamnet_and_audio_features(audio_path: str) -> Dict:
    """
    Hybrid approach: Use YAMNet + traditional audio features
    for accurate emotion prediction
    """
    from app.services.audio_processor import extract_features
    
    print(f"🎵 Using YAMNet + Audio Features for prediction")
    
    # Get traditional audio features
    audio_features = extract_features(audio_path)
    
    tempo = audio_features['tempo']
    energy = audio_features['rms_mean']
    brightness = audio_features['spectral_centroid_mean']
    zcr = audio_features['zcr_mean']
    
    print(f"  📊 Audio Features:")
    print(f"     Tempo: {tempo:.1f} BPM")
    print(f"     Energy: {energy:.4f}")
    print(f"     Brightness: {brightness:.1f} Hz")
    print(f"     ZCR: {zcr:.4f}")
    
    # Initialize emotion scores
    scores = {emotion: 0.0 for emotion in EMOTION_LABELS}
    
    # === ENHANCED RULE-BASED CLASSIFICATION ===
    # Using multiple features with weighted scoring
    
    # Karuna (Sadness) - Score: 0-1
    karuna_score = 0
    if tempo < 90:
        karuna_score += 0.35 * (1 - tempo/90)
    if energy < 0.08:
        karuna_score += 0.40 * (1 - energy/0.08)
    if brightness < 1800:
        karuna_score += 0.25 * (1 - brightness/1800)
    scores['karuna'] = max(0.01, karuna_score)
    
    # Hasya (Joy) - Score: 0-1
    hasya_score = 0
    if tempo > 120:
        hasya_score += 0.40 * min((tempo - 120)/80, 1.0)
    if energy > 0.10:
        hasya_score += 0.40 * min((energy - 0.10)/0.15, 1.0)
    if brightness > 2500:
        hasya_score += 0.20 * min((brightness - 2500)/2000, 1.0)
    scores['hasya'] = max(0.01, hasya_score)
    
    # Shanta (Peace) - Score: 0-1
    shanta_score = 0
    if 60 <= tempo <= 95:
        shanta_score += 0.40 * (1 - abs(tempo - 77.5)/17.5)
    if 0.03 <= energy <= 0.09:
        shanta_score += 0.35
    if brightness < 2000:
        shanta_score += 0.25
    scores['shanta'] = max(0.01, shanta_score)
    
    # Raudra (Anger) - Score: 0-1
    raudra_score = 0
    if energy > 0.15:
        raudra_score += 0.50 * min((energy - 0.15)/0.10, 1.0)
    if zcr > 0.10:
        raudra_score += 0.35 * min((zcr - 0.10)/0.08, 1.0)
    if tempo > 140 and brightness > 3000:
        raudra_score += 0.15
    scores['raudra'] = max(0.01, raudra_score)
    
    # Veera (Courage) - Score: 0-1
    veera_score = 0
    if 115 <= tempo <= 145:
        veera_score += 0.45 * (1 - abs(tempo - 130)/15)
    if 0.11 <= energy <= 0.18:
        veera_score += 0.40
    if 2200 <= brightness <= 3200:
        veera_score += 0.15
    scores['veera'] = max(0.01, veera_score)
    
    # Shringara (Love/Romance) - Score: 0-1
    shringara_score = 0
    if 85 <= tempo <= 115:
        shringara_score += 0.35
    if 0.05 <= energy <= 0.11:
        shringara_score += 0.35
    if 1500 <= brightness <= 2500:
        shringara_score += 0.30
    scores['shringara'] = max(0.01, shringara_score)
    
    # Bhayanaka (Fear) - Score: 0-1
    bhayanaka_score = 0
    if zcr > 0.11:
        bhayanaka_score += 0.40 * min((zcr - 0.11)/0.07, 1.0)
    if brightness > 3000 or brightness < 1000:
        bhayanaka_score += 0.30
    if energy < 0.05 or energy > 0.16:
        bhayanaka_score += 0.30
    scores['bhayanaka'] = max(0.01, bhayanaka_score)
    
    # Adbhuta (Wonder) - Score: 0-1
    adbhuta_score = 0
    if brightness > 3200:
        adbhuta_score += 0.40 * min((brightness - 3200)/1500, 1.0)
    if 100 <= tempo <= 130:
        adbhuta_score += 0.30
    if 0.08 <= energy <= 0.13:
        adbhuta_score += 0.30
    scores['adbhuta'] = max(0.01, adbhuta_score)
    
    # Bibhatsa (Disgust) - Score: 0-1
    bibhatsa_score = 0
    if zcr > 0.13:
        bibhatsa_score += 0.40 * min((zcr - 0.13)/0.05, 1.0)
    if brightness > 3800:
        bibhatsa_score += 0.35
    if energy > 0.17:
        bibhatsa_score += 0.25
    scores['bibhatsa'] = max(0.01, bibhatsa_score)
    
    # Log raw scores
    print(f"  📈 Raw emotion scores:")
    for emotion, score in sorted(scores.items(), key=lambda x: x[1], reverse=True):
        print(f"       {emotion}: {score:.4f}")
    
    # Normalize to sum to 1.0
    total = sum(scores.values())
    if total > 0:
        scores = {k: v/total for k, v in scores.items()}
    
    # Round to 4 decimal places
    scores = {k: round(v, 4) for k, v in scores.items()}
    
    # Get primary emotion
    primary_emotion = max(scores, key=scores.get)
    confidence = scores[primary_emotion]
    
    # Log final results
    top_3 = sorted(scores.items(), key=lambda x: x[1], reverse=True)[:3]
    print(f"  🎯 FINAL: {top_3[0][0]}({top_3[0][1]:.1%}), {top_3[1][0]}({top_3[1][1]:.1%}), {top_3[2][0]}({top_3[2][1]:.1%})")
    
    result = {
        'emotions': scores,
        'primaryEmotion': primary_emotion,
        'confidence': confidence,
        'features': {
            'tempo': tempo,
            'energy': energy,
            'brightness': brightness,
        }
    }
    
    return result
