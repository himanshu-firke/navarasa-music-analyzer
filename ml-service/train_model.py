"""
Train a CNN model for Navarasa Music Emotion Classification

Dataset structure:
dataset/
├── karuna/     (sad songs)
├── hasya/      (happy songs)
├── shanta/     (peaceful songs)
├── raudra/     (angry songs)
├── veera/      (courageous songs)
├── shringara/  (romantic songs)
├── bhayanaka/  (fearful songs)
├── adbhuta/    (wonder songs)
└── bibhatsa/   (disgust songs)

Each folder should contain MP3/WAV files
"""

import os
import numpy as np
import librosa
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
import pickle

# Emotion labels
EMOTIONS = ['shringara', 'hasya', 'karuna', 'raudra', 'veera', 
            'bhayanaka', 'bibhatsa', 'adbhuta', 'shanta']

# Hyperparameters
SAMPLE_RATE = 22050
DURATION = 30  # seconds
N_MFCC = 40
N_MELS = 128

def extract_features_for_training(file_path, duration=30):
    """
    Extract audio features for training
    Returns mel spectrogram
    """
    try:
        # Load audio
        y, sr = librosa.load(file_path, sr=SAMPLE_RATE, duration=duration, mono=True)
        
        # Extract mel spectrogram
        mel_spec = librosa.feature.melspectrogram(y=y, sr=sr, n_mels=N_MELS, fmax=8000)
        mel_spec_db = librosa.power_to_db(mel_spec, ref=np.max)
        
        # Normalize
        mel_spec_db = (mel_spec_db - mel_spec_db.mean()) / mel_spec_db.std()
        
        # Ensure fixed length (crop or pad)
        target_length = int(SAMPLE_RATE / 512 * duration)  # Approx frames
        if mel_spec_db.shape[1] < target_length:
            # Pad
            pad_width = target_length - mel_spec_db.shape[1]
            mel_spec_db = np.pad(mel_spec_db, ((0, 0), (0, pad_width)), mode='constant')
        else:
            # Crop
            mel_spec_db = mel_spec_db[:, :target_length]
        
        return mel_spec_db
        
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return None

def load_dataset(dataset_path):
    """
    Load dataset from folder structure
    """
    X = []  # Features
    y = []  # Labels
    
    print("📂 Loading dataset...")
    
    for emotion in EMOTIONS:
        emotion_path = os.path.join(dataset_path, emotion)
        
        if not os.path.exists(emotion_path):
            print(f"⚠️ Warning: {emotion_path} not found, skipping...")
            continue
        
        files = [f for f in os.listdir(emotion_path) 
                if f.endswith(('.mp3', '.wav', '.flac', '.ogg'))]
        
        print(f"  {emotion}: Processing {len(files)} files...")
        
        for i, file in enumerate(files):
            file_path = os.path.join(emotion_path, file)
            features = extract_features_for_training(file_path)
            
            if features is not None:
                X.append(features)
                y.append(emotion)
            
            if (i + 1) % 10 == 0:
                print(f"    Processed {i + 1}/{len(files)} files")
    
    print(f"✅ Loaded {len(X)} samples total")
    
    return np.array(X), np.array(y)

def build_cnn_model(input_shape, num_classes):
    """
    Build CNN model for audio classification
    """
    model = keras.Sequential([
        # Input layer
        layers.Input(shape=input_shape),
        
        # Reshape for CNN (add channel dimension)
        layers.Reshape((*input_shape, 1)),
        
        # Conv Block 1
        layers.Conv2D(32, (3, 3), activation='relu', padding='same'),
        layers.BatchNormalization(),
        layers.MaxPooling2D((2, 2)),
        layers.Dropout(0.25),
        
        # Conv Block 2
        layers.Conv2D(64, (3, 3), activation='relu', padding='same'),
        layers.BatchNormalization(),
        layers.MaxPooling2D((2, 2)),
        layers.Dropout(0.25),
        
        # Conv Block 3
        layers.Conv2D(128, (3, 3), activation='relu', padding='same'),
        layers.BatchNormalization(),
        layers.MaxPooling2D((2, 2)),
        layers.Dropout(0.25),
        
        # Conv Block 4
        layers.Conv2D(256, (3, 3), activation='relu', padding='same'),
        layers.BatchNormalization(),
        layers.MaxPooling2D((2, 2)),
        layers.Dropout(0.25),
        
        # Global pooling
        layers.GlobalAveragePooling2D(),
        
        # Dense layers
        layers.Dense(512, activation='relu'),
        layers.Dropout(0.5),
        layers.Dense(256, activation='relu'),
        layers.Dropout(0.5),
        
        # Output layer
        layers.Dense(num_classes, activation='softmax')
    ])
    
    return model

def train(dataset_path, model_save_path='models/navarasa_cnn.h5'):
    """
    Main training function
    """
    print("🚀 Starting training pipeline...")
    
    # Load dataset
    X, y = load_dataset(dataset_path)
    
    if len(X) == 0:
        print("❌ No data loaded. Check your dataset path.")
        return
    
    # Encode labels
    label_encoder = LabelEncoder()
    y_encoded = label_encoder.fit_transform(y)
    
    # One-hot encode
    y_onehot = keras.utils.to_categorical(y_encoded, num_classes=len(EMOTIONS))
    
    # Split dataset
    X_train, X_test, y_train, y_test = train_test_split(
        X, y_onehot, test_size=0.2, random_state=42, stratify=y_encoded
    )
    
    print(f"📊 Dataset split:")
    print(f"   Training samples: {len(X_train)}")
    print(f"   Testing samples: {len(X_test)}")
    
    # Build model
    print("🏗️ Building CNN model...")
    model = build_cnn_model(input_shape=X_train[0].shape, num_classes=len(EMOTIONS))
    
    # Compile model
    model.compile(
        optimizer=keras.optimizers.Adam(learning_rate=0.0001),
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )
    
    print(model.summary())
    
    # Callbacks
    callbacks = [
        keras.callbacks.EarlyStopping(
            monitor='val_loss',
            patience=10,
            restore_best_weights=True
        ),
        keras.callbacks.ReduceLROnPlateau(
            monitor='val_loss',
            factor=0.5,
            patience=5,
            min_lr=1e-7
        ),
        keras.callbacks.ModelCheckpoint(
            model_save_path,
            monitor='val_accuracy',
            save_best_only=True,
            verbose=1
        )
    ]
    
    # Train model
    print("🎓 Training model...")
    history = model.fit(
        X_train, y_train,
        validation_data=(X_test, y_test),
        epochs=50,
        batch_size=32,
        callbacks=callbacks,
        verbose=1
    )
    
    # Evaluate
    print("📈 Evaluating model...")
    test_loss, test_accuracy = model.evaluate(X_test, y_test, verbose=0)
    print(f"✅ Test Accuracy: {test_accuracy * 100:.2f}%")
    
    # Save label encoder
    encoder_path = model_save_path.replace('.h5', '_encoder.pkl')
    with open(encoder_path, 'wb') as f:
        pickle.dump(label_encoder, f)
    
    print(f"💾 Model saved to: {model_save_path}")
    print(f"💾 Encoder saved to: {encoder_path}")
    
    return model, history

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description='Train Navarasa Emotion Classifier')
    parser.add_argument('--dataset', type=str, required=True, 
                       help='Path to dataset folder')
    parser.add_argument('--output', type=str, default='models/navarasa_cnn.h5',
                       help='Path to save trained model')
    
    args = parser.parse_args()
    
    # Create models directory
    os.makedirs(os.path.dirname(args.output), exist_ok=True)
    
    # Train
    train(args.dataset, args.output)
