import librosa
import numpy as np

def extract_features(audio_path):
    """
    Extract audio features for emotion prediction
    
    Args:
        audio_path: Path to audio file
        
    Returns:
        Dictionary of extracted features
    """
    try:
        # Load audio file - OPTIMIZED: Only analyze first 30 seconds at lower sample rate
        y, sr = librosa.load(audio_path, sr=22050, duration=30, mono=True)
        
        # Extract MFCCs (Mel-Frequency Cepstral Coefficients)
        mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=20)
        mfccs_mean = np.mean(mfccs, axis=1)
        mfccs_std = np.std(mfccs, axis=1)
        
        # Extract Spectral Centroid
        spectral_centroid = librosa.feature.spectral_centroid(y=y, sr=sr)
        spectral_centroid_mean = np.mean(spectral_centroid)
        spectral_centroid_std = np.std(spectral_centroid)
        
        # Extract Spectral Rolloff
        spectral_rolloff = librosa.feature.spectral_rolloff(y=y, sr=sr)
        spectral_rolloff_mean = np.mean(spectral_rolloff)
        spectral_rolloff_std = np.std(spectral_rolloff)
        
        # Extract Zero Crossing Rate
        zcr = librosa.feature.zero_crossing_rate(y)
        zcr_mean = np.mean(zcr)
        zcr_std = np.std(zcr)
        
        # Extract Tempo
        tempo, _ = librosa.beat.beat_track(y=y, sr=sr)
        
        # Extract Chroma features
        chroma = librosa.feature.chroma_stft(y=y, sr=sr)
        chroma_mean = np.mean(chroma, axis=1)
        chroma_std = np.std(chroma, axis=1)
        
        # Extract RMS Energy
        rms = librosa.feature.rms(y=y)
        rms_mean = np.mean(rms)
        rms_std = np.std(rms)
        
        # Compile all features
        features = {
            'mfccs_mean': mfccs_mean.tolist(),
            'mfccs_std': mfccs_std.tolist(),
            'spectral_centroid_mean': float(spectral_centroid_mean),
            'spectral_centroid_std': float(spectral_centroid_std),
            'spectral_rolloff_mean': float(spectral_rolloff_mean),
            'spectral_rolloff_std': float(spectral_rolloff_std),
            'zcr_mean': float(zcr_mean),
            'zcr_std': float(zcr_std),
            'tempo': float(tempo),
            'chroma_mean': chroma_mean.tolist(),
            'chroma_std': chroma_std.tolist(),
            'rms_mean': float(rms_mean),
            'rms_std': float(rms_std),
        }
        
        return features
        
    except Exception as e:
        raise Exception(f"Feature extraction failed: {str(e)}")

def create_feature_vector(features):
    """
    Create a flat feature vector from extracted features for ML model
    """
    feature_vector = []
    
    feature_vector.extend(features['mfccs_mean'])
    feature_vector.extend(features['mfccs_std'])
    feature_vector.append(features['spectral_centroid_mean'])
    feature_vector.append(features['spectral_centroid_std'])
    feature_vector.append(features['spectral_rolloff_mean'])
    feature_vector.append(features['spectral_rolloff_std'])
    feature_vector.append(features['zcr_mean'])
    feature_vector.append(features['zcr_std'])
    feature_vector.append(features['tempo'])
    feature_vector.extend(features['chroma_mean'])
    feature_vector.extend(features['chroma_std'])
    feature_vector.append(features['rms_mean'])
    feature_vector.append(features['rms_std'])
    
    return np.array(feature_vector)
