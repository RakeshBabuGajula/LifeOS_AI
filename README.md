# 🚀 LifeOS AI
<img width="1536" height="1024" alt="LifoOs Thumbnail" src="https://github.com/user-attachments/assets/bc908599-09f6-4df6-b050-d9cf50960fe7" />

**LifeOS AI** is a full-stack AI-powered platform that helps users make smarter career decisions by analyzing their skills, identifying gaps, and providing personalized roadmaps along with productivity and burnout insights.

---

## 🌟 Overview

LifeOS AI combines career intelligence, skill analysis, and wellness tracking into a single system.  
It is designed to act like a personal AI assistant for professional growth.

---

## ✨ Key Features

### 🧭 Career GPS
- Generates personalized career paths based on user skills and goals
- Suggests next steps and a learning roadmap

### 🧠 Skill Gap Predictor
- Identifies missing skills for target roles
- Provides a job readiness score and project recommendations

### ❤️ Burnout Monitor
- Tracks stress, mood, and work patterns
- Predicts burnout risk and suggests actionable improvements

### 📄 Resume AI (LLM Powered)
- Parses resumes and extracts key information
- Generates structured career insights using Gemini API

### 📊 AI Insights Dashboard
- Unified view of career, skills, and productivity data
- Personalized daily recommendations

---

## 🛠️ Tech Stack

### Frontend
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui

### Backend
- FastAPI (Python)
- MongoDB Atlas
- JWT Authentication

### AI Integration
- Google Gemini API (LLM)
- Resume parsing (PDF processing)

---

## 🧠 How It Works

1. User inputs skills or uploads a resume
2. Backend processes data and extracts meaningful information
3. AI modules analyze:
   - Career direction
   - Skill gaps
   - Productivity patterns
4. System generates structured insights and recommendations
5. Results are stored and displayed via a dashboard

---

## 📁 Project Structure

```text
LifeOS-AI/
│
├── api/
│   ├── app/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── db/
│   │   └── models/
│   └── main.py
│
├── web/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   └── lib/
│
└── README.md
```

---

## ⚙️ Setup Instructions

### 1. Clone Repository

```bash
git clone https://github.com/your-username/lifeos-ai.git
cd lifeos-ai
```

### 2. Backend Setup

```bash
cd api
pip install -r requirements.txt
```

Create a `.env` file:

```env
MONGODB_URI=your_mongodb_uri
GEMINI_API_KEY=your_gemini_key
GEMINI_MODEL=gemini-1.5-flash
JWT_SECRET=your_secret
```

Run the backend:

```bash
uvicorn main:app --reload
```

### 3. Frontend Setup

```bash
cd web
npm install
npm run dev
```

---

## 🔐 Environment Variables

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `GEMINI_API_KEY` | Google Gemini API key |
| `GEMINI_MODEL` | LLM model name |
| `JWT_SECRET` | Authentication secret |

---

## 📌 Future Improvements

- Resume embedding + semantic search
- Real-time job market integration
- ML-based burnout prediction model
- Multi-user analytics dashboard

---

## 🤝 Contribution

Contributions are welcome.
