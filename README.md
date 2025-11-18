# 🎵 Navarasa Music Emotion Analyzer

[![React](https://img.shields.io/badge/React-18.2-blue)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-green)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/Python-3.11-yellow)](https://python.org/)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-2.15-orange)](https://tensorflow.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-brightgreen)](https://mongodb.com/)

> An AI-powered web application that analyzes music and predicts emotions based on the nine classical Indian Navarasas (रस).

**Live Demo**: navarasa-music-analyzer.vercel.app/

**Creator**: Himanshu Ganesh Firke  

---

## 🎯 What is Navarasa?

**Navarasa** (नवरस) means "nine emotions" in Sanskrit. These are the fundamental emotions described in the ancient Indian text **Natya Shastra** by Bharata Muni (~200 BCE).

### The Nine Emotions:
1. **Shringara** (श्रृंगार) - Love, Beauty 💕
2. **Hasya** (हास्य) - Joy, Laughter 😄
3. **Karuna** (करुणा) - Sadness, Compassion 😢
4. **Raudra** (रौद्र) - Anger, Fury 😠
5. **Veera** (वीर) - Courage, Heroism 💪
6. **Bhayanaka** (भयानक) - Fear, Terror 😱
7. **Bibhatsa** (बीभत्स) - Disgust, Aversion 🤢
8. **Adbhuta** (अद्भुत) - Wonder, Surprise 😲
9. **Shanta** (शान्त) - Peace, Tranquility 🕉️

---

## 🚀 Features

### Core Functionality
✅ **Audio Upload** - Drag-and-drop or browse (MP3, WAV, FLAC, OGG)  
✅ **AI Analysis** - CNN-based emotion classification  
✅ **Visual Results** - Interactive charts and emotion cards  
✅ **Confidence Scores** - Percentage breakdown of all 9 emotions  
✅ **Cultural Context** - Description of each Navarasa  
✅ **Analysis History** - Save and revisit past analyses  
✅ **Multi-Song Comparison** - Compare emotions across songs  
✅ **Waveform Visualization** - Interactive audio waveform  
✅ **Responsive Design** - Works on mobile, tablet, desktop  

### Technical Highlights
- **Real-time Processing**: <10 seconds per song
- **Accurate ML Model**: >75% classification accuracy
- **Beautiful UI**: Modern design with smooth animations
- **Scalable Architecture**: Microservices (Frontend + Backend + ML)
- **Cloud Deployed**: Vercel + Render + MongoDB Atlas

---

## 🏗️ Architecture

```
┌──────────────┐
│   Frontend   │ (React + Vite + TailwindCSS)
│   (Vercel)   │
└──────┬───────┘
       │ REST API
┌──────▼───────┐
│   Backend    │ (Node.js + Express + MongoDB)
│   (Render)   │
└──────┬───────┘
       │ HTTP
┌──────▼───────┐
│  ML Service  │ (Python + FastAPI + TensorFlow)
│   (Render)   │
└──────────────┘
```

---

## 📁 Project Structure

```
navarasa-music-analyzer/
│
├── frontend/              # React application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API calls
│   │   └── utils/         # Helper functions
│   └── package.json
│
├── backend/               # Node.js API server
│   ├── src/
│   │   ├── controllers/   # Request handlers
│   │   ├── models/        # MongoDB schemas
│   │   ├── routes/        # API routes
│   │   └── services/      # Business logic
│   └── package.json
│
├── ml-service/            # Python ML service
│   ├── app/
│   │   ├── models/        # ML model files
│   │   └── services/      # Prediction logic
│   └── requirements.txt
│
└── docs/                  # Documentation
    ├── PRD.md
    ├── FEATURES_DETAILED.md
    └── API_DOCS.md
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 + Vite | UI Framework |
| | TailwindCSS | Styling |
| | Recharts | Data Visualization |
| | Framer Motion | Animations |
| | WaveSurfer.js | Audio Waveform |
| **Backend** | Node.js 20 | Runtime |
| | Express.js | Web Framework |
| | MongoDB + Mongoose | Database |
| | Multer | File Upload |
| **ML Service** | Python 3.11 | Language |
| | FastAPI | Web Framework |
| | TensorFlow + Keras | Deep Learning |
| | Librosa | Audio Processing |
| **Deployment** | Vercel | Frontend Hosting |
| | Render | Backend + ML Hosting |
| | MongoDB Atlas | Cloud Database |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- Python 3.11+
- MongoDB (local or Atlas)
- Git

### Installation

#### 1. Clone Repository
```bash
git clone https://github.com/himanshu-firke/navarasa-music-analyzer.git
cd navarasa-music-analyzer
```

#### 2. Setup Frontend
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your API URLs
npm run dev
# Runs on http://localhost:5173
```

#### 3. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with MongoDB URI
npm run dev
# Runs on http://localhost:5000
```

#### 4. Setup ML Service
```bash
cd ml-service
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
python -m uvicorn app.main:app --reload
# Runs on http://localhost:8000
```

---

## 📊 How It Works

### 1. Audio Feature Extraction
The ML service extracts these features from uploaded audio:
- **MFCCs** (20 coefficients) - Timbral texture
- **Spectral Centroid** - Brightness of sound
- **Spectral Rolloff** - Signal shape
- **Zero Crossing Rate** - Noisiness
- **Tempo** - Beats per minute
- **Chroma** - Pitch classes
- **RMS Energy** - Loudness

### 2. CNN Model Prediction
Features are fed into a Convolutional Neural Network:
```
Input (MFCC Spectrogram)
  ↓
Conv2D + MaxPool (x3 layers)
  ↓
Flatten + Dense (256 neurons)
  ↓
Output (9 emotions with probabilities)
```

### 3. Result Interpretation
- **Primary Emotion**: Highest probability emotion
- **Confidence**: Percentage of primary emotion
- **Distribution**: All 9 emotions' probabilities

---

## 📖 API Documentation

### Upload Audio
```http
POST /api/upload
Content-Type: multipart/form-data

Body: { file: <audio-file> }

Response:
{
  "success": true,
  "fileId": "abc123",
  "filename": "song.mp3"
}
```

### Analyze Audio
```http
POST /api/analyze
Content-Type: application/json

Body: { "fileId": "abc123" }

Response:
{
  "emotions": {
    "shringara": 0.05,
    "hasya": 0.85,
    "karuna": 0.03,
    ...
  },
  "primaryEmotion": "Hasya",
  "confidence": 0.85
}
```

Full API docs: [See docs/API_DOCS.md](docs/API_DOCS.md)

---

## 🧪 Testing

```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend
npm test

# ML Service tests
cd ml-service
pytest
```

---

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
vercel --prod
```

### Backend (Render)
- Connect GitHub repo
- Set environment variables
- Auto-deploy enabled

### ML Service (Render)
- Python 3.11 environment
- Install requirements
- Run with Uvicorn

---

## 📈 Performance Metrics

- ⚡ **Analysis Speed**: <10 seconds per song
- 🎯 **Model Accuracy**: 78% (test dataset)
- 📱 **Lighthouse Score**: 95+ (Performance)
- 🌐 **Load Time**: <2 seconds

---

## 🎓 Research & References

- **Natya Shastra** - Bharata Muni (~200 BCE)
- **Music Emotion Recognition** - IEEE Papers
- **Librosa Documentation** - Audio Analysis
- **TensorFlow Best Practices** - Model Architecture

---

## 🤝 Contributing

This is a research project for academic purposes. Contributions welcome!

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

MIT License - See [LICENSE](LICENSE) file

---

## 👨‍💻 Author

**Himanshu Ganesh Firke**
- GitHub: [@himanshu-firke](https://github.com/himanshu-firke)
- LinkedIn: [himanshufirke](https://www.linkedin.com/in/himanshufirke/)
- Email: himanshufirke04@gmail.com

---

## 🙏 Acknowledgments

- Prof. Patnaik - Research guidance
- Indian classical music theory
- Open-source community

---

## 📞 Support

For questions or issues:
- Open an issue on GitHub
- Email: himanshufirke04@gmail.com

---

**Made with ❤️ for preserving cultural heritage through AI**
