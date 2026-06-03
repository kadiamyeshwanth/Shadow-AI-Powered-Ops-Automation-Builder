# 🤖 Shadow — AI-Powered Ops Automation Engine

> Turn messy human workflows into production-ready AI agents using natural language.

[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)](https://reactjs.org/)
[![LangChain](https://img.shields.io/badge/LangChain-0.2-1C3C3C?style=flat)](https://langchain.com/)
[![Gemini](https://img.shields.io/badge/Gemini%20Pro-API-4285F4?style=flat&logo=google)](https://deepmind.google/technologies/gemini/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Motor-47A248?style=flat&logo=mongodb)](https://mongodb.com/)

---

## Architecture

```
[Natural Language Input]
        ↓
[FastAPI Backend] ──→ [LangChain + Gemini Pro] ──→ [JSON Schema Validation]
        ↓                                                    ↓
[MongoDB (Motor)]  ←──────────────────────── [Pydantic Models]
        ↓
[React Frontend (Vite + Tailwind)]
        ↓
[@xyflow/react Canvas] ← [Dagre Auto-Layout] ← [transformToFlow()]
        ↓
[Redux Simulation Engine] → [Human-in-the-Loop Approval]
        ↓
[ROI Analytics Dashboard]
```

---

## Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Google Gemini API key

### 1. Backend Setup

```bash
cd backend

# Copy and fill environment variables
cp .env.example .env
# Edit .env with your GEMINI_API_KEY and MONGODB_URI

# Create virtual environment
python -m venv venv
venv\Scripts\activate       # Windows
# source venv/bin/activate  # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Run the server
python main.py
# Server runs at http://localhost:8000
# Docs at http://localhost:8000/docs
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies (already done if following setup)
npm install

# Start dev server
npm run dev
# App runs at http://localhost:5173
```

---

## Environment Variables

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | Your Google Gemini API key from [Google AI Studio](https://aistudio.google.com/) |
| `MONGODB_URI` | MongoDB connection string (Atlas or local) |
| `DB_NAME` | Database name (default: `shadow_db`) |
| `FRONTEND_ORIGIN` | Frontend URL for CORS (default: `http://localhost:5173`) |

---

## Features

| Feature | Tech |
|---|---|
| Natural language → workflow JSON | LangChain + Gemini Pro |
| Visual node-based pipeline | `@xyflow/react` + Dagre layout |
| Global state management | Redux Toolkit |
| Human-in-the-loop guardrails | Redux simulation state machine |
| ROI analytics | Backend AI calculation + frontend viz |
| Persistence | MongoDB via Motor (async) |
| Type-safe API | Pydantic v2 schemas |
| Dark mode UI | Custom CSS design system |

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/workflow/parse` | Parse natural language, save, return workflow |
| `GET` | `/api/workflow/list` | List all saved workflows |
| `GET` | `/api/workflow/{id}` | Get single workflow |
| `DELETE` | `/api/workflow/{id}` | Delete workflow |
| `GET` | `/health` | Health check |

---

## Project Structure

```
Shadow-AI-Powered-Ops-Automation-Builder/
├── backend/
│   ├── main.py              # FastAPI app entry point
│   ├── config.py            # Pydantic settings
│   ├── requirements.txt
│   ├── .env.example
│   ├── models/
│   │   └── workflow.py      # Pydantic models
│   ├── services/
│   │   ├── ai_parser.py     # LangChain + Gemini
│   │   └── db.py            # Motor MongoDB
│   └── routes/
│       └── workflow.py      # FastAPI routes
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   ├── main.jsx
    │   ├── index.css         # Design system
    │   ├── api/
    │   │   └── workflowApi.js
    │   ├── store/
    │   │   ├── store.js
    │   │   └── workflowSlice.js
    │   ├── utils/
    │   │   └── flowUtils.js  # Dagre layout + helpers
    │   ├── components/
    │   │   ├── Canvas/
    │   │   │   ├── WorkflowCanvas.jsx
    │   │   │   ├── CustomNode.jsx
    │   │   │   ├── SimulationControls.jsx
    │   │   │   └── useSimulation.js
    │   │   ├── InputPanel/
    │   │   │   ├── WorkflowInput.jsx
    │   │   │   └── ROIMetrics.jsx
    │   │   └── Sidebar/
    │   │       └── SavedAgents.jsx
    │   └── pages/
    │       ├── Landing.jsx
    │       └── Dashboard.jsx
    ├── index.html
    └── vite.config.js
```

---

## Deployment

### Frontend → Vercel
```bash
cd frontend && npm run build
# Deploy dist/ to Vercel
```

### Backend → Render
- Create a new Web Service on Render
- Root directory: `backend`
- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- Add environment variables in Render dashboard

---

Built with ❤️ using Gemini Pro · LangChain · FastAPI · React Flow · Redux Toolkit · MongoDB
