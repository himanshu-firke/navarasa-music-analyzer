from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
import tempfile
from dotenv import load_dotenv
from app.services.prediction_service import predict_emotion
from app.services.audio_processor import extract_features

load_dotenv()

app = FastAPI(
    title="Navarasa Music Emotion Analyzer - ML Service",
    description="Machine Learning API for music emotion recognition",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "message": "Navarasa ML Service is running",
        "version": "1.0.0",
        "endpoints": ["/predict", "/extract-features", "/health"]
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "Navarasa ML Service"
    }

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    """
    Predict the emotion of an uploaded audio file
    
    Returns:
        - emotions: Dictionary of all 9 emotion probabilities
        - primaryEmotion: The dominant emotion
        - confidence: Confidence score of primary emotion
        - features: Audio features extracted
    """
    temp_path = None
    try:
        print(f"\n🎵 Received file: {file.filename}, type: {file.content_type}")
        
        # Validate file
        if not file.content_type or not file.content_type.startswith('audio/'):
            print(f"⚠️ Invalid content type: {file.content_type}")
            raise HTTPException(status_code=400, detail="File must be an audio file")
        
        # Read file content
        content = await file.read()
        print(f"📦 File size: {len(content)} bytes")
        
        # Save temporarily using system temp directory (Windows/Linux/Mac compatible)
        temp_dir = tempfile.gettempdir()
        temp_path = os.path.join(temp_dir, f"navarasa_{file.filename}")
        print(f"💾 Saving to: {temp_path}")
        
        with open(temp_path, "wb") as f:
            f.write(content)
        
        print(f"✅ File saved successfully")
        
        try:
            # Predict emotion
            print("🚀 Starting emotion prediction...")
            result = predict_emotion(temp_path)
            print("✅ Prediction completed successfully!")
            return result
        except Exception as pred_error:
            print(f"❌ Prediction error: {pred_error}")
            import traceback
            traceback.print_exc()
            raise
        finally:
            # Clean up temp file
            if temp_path and os.path.exists(temp_path):
                os.remove(temp_path)
                print(f"🗑️ Cleaned up temp file")
                
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Server error: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.post("/extract-features")
async def extract_audio_features(file: UploadFile = File(...)):
    """
    Extract audio features from uploaded file without prediction
    """
    try:
        content = await file.read()
        
        # Save temporarily using system temp directory (Windows/Linux/Mac compatible)
        temp_dir = tempfile.gettempdir()
        temp_path = os.path.join(temp_dir, f"navarasa_{file.filename}")
        
        with open(temp_path, "wb") as f:
            f.write(content)
        
        try:
            features = extract_features(temp_path)
            return {"features": features}
        finally:
            if os.path.exists(temp_path):
                os.remove(temp_path)
                
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Feature extraction failed: {str(e)}")

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=True)
