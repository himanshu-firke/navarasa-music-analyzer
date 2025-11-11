import numpy as np
from app.services.audio_processor import extract_features, create_feature_vector

# Try to import trained CNN model first (highest priority)
USE_CNN = False
USE_YAMNET = False

try:
    from app.services.cnn_classifier import predict_with_cnn
    import os
    if os.path.exists('models/navarasa_cnn.h5'):
        USE_CNN = True
        print("✅ Trained CNN model found - using custom trained model (HIGHEST ACCURACY)")
    else:
        print("⚠️ Trained CNN model not found at models/navarasa_cnn.h5")
except Exception as e:
    print(f"⚠️ CNN classifier not available ({e})")
    USE_CNN = False

# Try YAMNet as secondary option
if not USE_CNN:
    try:
        from app.services.yamnet_classifier import predict_with_yamnet_and_audio_features
        USE_YAMNET = True
        print("✅ YAMNet classifier available - using enhanced ML model")
    except Exception as e:
        print(f"⚠️ YAMNet not available ({e}), using rule-based classifier")
        USE_YAMNET = False

# Emotion labels
EMOTION_LABELS = [
    'shringara', 'hasya', 'karuna', 'raudra', 
    'veera', 'bhayanaka', 'bibhatsa', 'adbhuta', 'shanta'
]

def predict_emotion(audio_path):
    """
    Predict emotion from audio file using best available model:
    1. Trained CNN model (if available) - HIGHEST ACCURACY
    2. YAMNet + Enhanced Audio Features - HIGH ACCURACY  
    3. Rule-based classifier - BASELINE
    
    Args:
        audio_path: Path to audio file
        
    Returns:
        Dictionary with emotions, primaryEmotion, confidence, and features
    """
    try:
        print(f"🎵 Starting prediction for: {audio_path}")
        
        # Priority 1: Use trained CNN model if available
        if USE_CNN:
            print("🚀 Using trained CNN model (custom trained)...")
            result = predict_with_cnn(audio_path)
            print(f"✅ Prediction complete: {result['primaryEmotion']} ({result['confidence']:.1%})")
            return result
        
        # Priority 2: Use YAMNet-enhanced classifier if available
        if USE_YAMNET:
            print("🚀 Using YAMNet-enhanced classifier...")
            result = predict_with_yamnet_and_audio_features(audio_path)
            print(f"✅ Prediction complete: {result['primaryEmotion']} ({result['confidence']:.1%})")
            return result
        
        # Fallback to rule-based
        print("📊 Extracting audio features...")
        features = extract_features(audio_path)
        print(f"✅ Features extracted - Tempo: {features['tempo']:.1f}, Energy: {features['rms_mean']:.3f}")
        
        # Rule-based classification based on audio features
        print("🧠 Classifying emotions...")
        emotions = classify_emotion_rule_based(features)
        
        # Get primary emotion (highest probability)
        primary_emotion = max(emotions, key=emotions.get)
        confidence = emotions[primary_emotion]
        
        print(f"✅ Primary emotion: {primary_emotion} ({confidence:.1%})")
        
        # Prepare response
        result = {
            'emotions': emotions,
            'primaryEmotion': primary_emotion,
            'confidence': confidence,
            'features': {
                'tempo': features['tempo'],
                'energy': features['rms_mean'],
                'brightness': features['spectral_centroid_mean'],
            }
        }
        
        return result
        
    except Exception as e:
        print(f"❌ Prediction error: {str(e)}")
        import traceback
        traceback.print_exc()
        raise Exception(f"Prediction failed: {str(e)}")

def classify_emotion_rule_based(features):
    """
    Rule-based emotion classification based on audio features
    This is a simplified approach for MVP demonstration
    
    In production, this would be replaced with a trained CNN model
    """
    # Initialize emotion scores with base values
    scores = {emotion: 0.01 for emotion in EMOTION_LABELS}
    
    tempo = features['tempo']
    energy = features['rms_mean']
    brightness = features['spectral_centroid_mean']
    zcr = features['zcr_mean']
    spectral_rolloff = features['spectral_rolloff_mean']
    
    # Use MFCCs for timbral characteristics
    mfccs_mean = np.array(features['mfccs_mean'])
    mfcc_variance = np.var(mfccs_mean)  # High variance = diverse timbre
    
    print(f"  📊 Audio Features:")
    print(f"     Tempo: {tempo:.1f} BPM")
    print(f"     Energy: {energy:.4f}")
    print(f"     Brightness: {brightness:.1f} Hz")
    print(f"     Spectral Rolloff: {spectral_rolloff:.1f} Hz")
    print(f"     ZCR: {zcr:.4f}")
    print(f"     MFCC Variance: {mfcc_variance:.2f}")
    
    # Score each emotion based on features (0-1 scale)
    print(f"  🧮 Calculating emotion scores...")
    
    # Karuna (Sadness) - Low tempo, low energy, dark sound, consistent
    sadness_score = 0
    if tempo < 90:
        sadness_score += 0.4 * (1 - tempo/90)
    if energy < 0.08:
        sadness_score += 0.4 * (1 - energy/0.08)
    if brightness < 1800:
        sadness_score += 0.3 * (1 - brightness/1800)
    if mfcc_variance < 50:  # Consistent timbre
        sadness_score += 0.2
    scores['karuna'] += sadness_score
    
    # Hasya (Joy) - High tempo, high energy, bright, dynamic
    joy_score = 0
    if tempo > 120:
        joy_score += 0.5 * ((tempo - 120)/80)
    if energy > 0.10:
        joy_score += 0.5 * ((energy - 0.10)/0.15)
    if brightness > 2500:
        joy_score += 0.3 * ((brightness - 2500)/2000)
    if mfcc_variance > 70:  # Varied timbre
        joy_score += 0.2
    scores['hasya'] += joy_score
    
    # Shanta (Peace) - Medium-low tempo, calm, balanced
    if 60 < tempo < 100:
        scores['shanta'] += 0.4 * (1 - abs(tempo - 80)/20)
    if 0.04 < energy < 0.09:
        scores['shanta'] += 0.3
    if brightness < 2000:
        scores['shanta'] += 0.15
    
    # Raudra (Anger) - High energy, aggressive, harsh, intense
    anger_score = 0
    if energy > 0.14:
        anger_score += 0.6 * ((energy - 0.14)/0.1)
    if zcr > 0.09:
        anger_score += 0.4 * ((zcr - 0.09)/0.08)
    if brightness > 3000 and tempo > 130:
        anger_score += 0.3
    scores['raudra'] += anger_score
    
    # Veera (Courage) - Strong beats, moderate-high tempo, powerful
    courage_score = 0
    if 115 < tempo < 145:
        courage_score += 0.5 * (1 - abs(tempo - 130)/15)
    if 0.11 < energy < 0.16:
        courage_score += 0.4
    if 2200 < brightness < 3200:
        courage_score += 0.3
    scores['veera'] += courage_score
    
    # Shringara (Love) - Smooth, moderate tempo, warm
    if 90 < tempo < 120:
        scores['shringara'] += 0.3
    if 0.06 < energy < 0.11:
        scores['shringara'] += 0.25
    if 1500 < brightness < 2500:
        scores['shringara'] += 0.3
    
    # Bhayanaka (Fear) - Irregular, suspenseful, tense
    if zcr > 0.10:
        scores['bhayanaka'] += 0.4 * (zcr/0.15)
    if brightness > 2800:
        scores['bhayanaka'] += 0.2
    if energy < 0.07 or energy > 0.13:
        scores['bhayanaka'] += 0.15
    
    # Adbhuta (Wonder) - Ethereal, dynamic, surprising
    if brightness > 3000:
        scores['adbhuta'] += 0.4 * (brightness/4500)
    if tempo > 100 and tempo < 130:
        scores['adbhuta'] += 0.2
    if 0.08 < energy < 0.12:
        scores['adbhuta'] += 0.2
    
    # Bibhatsa (Disgust) - Harsh, dissonant, uncomfortable
    if zcr > 0.12:
        scores['bibhatsa'] += 0.35 * (zcr/0.18)
    if brightness > 3500:
        scores['bibhatsa'] += 0.3
    if energy > 0.13:
        scores['bibhatsa'] += 0.2
    
    # Log ALL emotion scores before normalization (for debugging)
    print(f"  📈 Raw scores (before normalization):")
    for emotion in sorted(scores.items(), key=lambda x: x[1], reverse=True):
        print(f"       {emotion[0]}: {emotion[1]:.4f}")
    
    # Normalize scores to sum to 1.0
    total = sum(scores.values())
    if total > 0:
        scores = {k: v/total for k, v in scores.items()}
    
    # Round to 4 decimal places
    scores = {k: round(v, 4) for k, v in scores.items()}
    
    # Log the top 3 emotions after normalization
    top_3 = sorted(scores.items(), key=lambda x: x[1], reverse=True)[:3]
    print(f"  🎯 FINAL: {top_3[0][0]}({top_3[0][1]:.1%}), {top_3[1][0]}({top_3[1][1]:.1%}), {top_3[2][0]}({top_3[2][1]:.1%})")
    
    return scores

# For future: Load trained CNN model
def load_model():
    """
    Load pre-trained CNN model
    (To be implemented when model is trained)
    """
    # import tensorflow as tf
    # model = tf.keras.models.load_model('models/navarasa_model.h5')
    # return model
    pass

def predict_with_model(model, features):
    """
    Predict using trained ML model
    (To be implemented)
    """
    # feature_vector = create_feature_vector(features)
    # predictions = model.predict(np.expand_dims(feature_vector, axis=0))
    # return dict(zip(EMOTION_LABELS, predictions[0]))
    pass
