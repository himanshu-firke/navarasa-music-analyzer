"""
CNN-based Music Emotion Classifier
Uses trained CNN model for accurate emotion prediction
"""

import numpy as np
import librosa
import tensorflow as tf
from tensorflow import keras
import pickle
import os

# Model paths
MODEL_PATH = 'models/navarasa_cnn.h5'
ENCODER_PATH = 'models/navarasa_cnn_encoder.pkl'

# Audio parameters (must match training)
SAMPLE_RATE = 22050
DURATION = 30
N_MELS = 128

# Cached model and encoder
_model = None
_label_encoder = None

def load_trained_model():
    """Load trained CNN model and label encoder"""
    global _model, _label_encoder
    
    if _model is None:
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(f"Trained model not found at {MODEL_PATH}")
        
        print(f"📥 Loading trained CNN model from {MODEL_PATH}...")
        _model = keras.models.load_model(MODEL_PATH)
        print("✅ CNN model loaded successfully!")
        
        # Load label encoder
        with open(ENCODER_PATH, 'rb') as f:
            _label_encoder = pickle.load(f)
        print("✅ Label encoder loaded!")
    
    return _model, _label_encoder

def extract_features_for_prediction(audio_path):
    """
    Extract features from audio file (same as training)
    """
    try:
        # Load audio
        y, sr = librosa.load(audio_path, sr=SAMPLE_RATE, duration=DURATION, mono=True)
        
        # Extract mel spectrogram
        mel_spec = librosa.feature.melspectrogram(y=y, sr=sr, n_mels=N_MELS, fmax=8000)
        mel_spec_db = librosa.power_to_db(mel_spec, ref=np.max)
        
        # Normalize
        mel_spec_db = (mel_spec_db - mel_spec_db.mean()) / mel_spec_db.std()
        
        # Ensure fixed length
        target_length = int(SAMPLE_RATE / 512 * DURATION)
        if mel_spec_db.shape[1] < target_length:
            pad_width = target_length - mel_spec_db.shape[1]
            mel_spec_db = np.pad(mel_spec_db, ((0, 0), (0, pad_width)), mode='constant')
        else:
            mel_spec_db = mel_spec_db[:, :target_length]
        
        return mel_spec_db
        
    except Exception as e:
        print(f"❌ Feature extraction error: {e}")
        raise

def predict_with_cnn(audio_path):
    """
    Predict emotion using trained CNN model
    """
    print(f"🎵 Using trained CNN model for prediction")
    
    # Load model
    model, label_encoder = load_trained_model()
    
    # Extract features
    print("📊 Extracting mel spectrogram features...")
    features = extract_features_for_prediction(audio_path)
    
    # Add batch dimension
    features = np.expand_dims(features, axis=0)
    
    # Predict
    print("🧠 Running CNN inference...")
    predictions = model.predict(features, verbose=0)[0]
    
    # Get emotion labels
    emotion_names = label_encoder.classes_
    
    # Create emotion scores dictionary
    scores = {}
    for i, emotion in enumerate(emotion_names):
        scores[emotion] = float(predictions[i])
    
    # Get primary emotion
    primary_emotion = emotion_names[np.argmax(predictions)]
    confidence = float(np.max(predictions))
    
    # Log results
    print(f"  📈 CNN Predictions:")
    for emotion, score in sorted(scores.items(), key=lambda x: x[1], reverse=True)[:5]:
        print(f"       {emotion}: {score:.4f}")
    
    print(f"  🎯 PRIMARY: {primary_emotion} ({confidence:.1%})")
    
    # Get basic audio features for response
    y, sr = librosa.load(audio_path, sr=22050, duration=30, mono=True)
    tempo, _ = librosa.beat.beat_track(y=y, sr=sr)
    rms = librosa.feature.rms(y=y)
    spectral_centroid = librosa.feature.spectral_centroid(y=y, sr=sr)
    
    result = {
        'emotions': scores,
        'primaryEmotion': primary_emotion,
        'confidence': confidence,
        'features': {
            'tempo': float(tempo),
            'energy': float(np.mean(rms)),
            'brightness': float(np.mean(spectral_centroid)),
        }
    }
    
    return result
