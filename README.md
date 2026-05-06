# Agentic AI Research System

An AI-powered multi-agent research platform that automates research workflows using specialized AI agents for planning, researching, analysis, validation, and final reporting.

Built with a modern fullstack architecture using **FastAPI**, **Next.js**, and **LLM-powered agent pipelines**.

---

# Features

- Multi-agent AI workflow architecture
- Automated topic research and information gathering
- AI-powered analysis and synthesis
- Critic/validation agent for improving output quality
- Modern SaaS-style frontend UI
- Real-time research workflow visualization
- REST API backend using FastAPI
- Modular and scalable architecture
- Clean separation of frontend and backend

---

# Tech Stack

## Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- Framer Motion

## Backend
- FastAPI
- Python
- LangChain / AI Agent Architecture
- Async API endpoints

## AI / LLM
- OpenAI API
- Multi-agent orchestration
- Prompt engineering workflows

---

# Project Architecture

```text
User Query
    ↓
Planner Agent
    ↓
Research Agent
    ↓
Analyzer Agent
    ↓
Critic Agent
    ↓
Final Response
```

---

# Folder Structure

```bash
agentic-research-system/
│
├── backend/
│   ├── app/
│   │   ├── agents/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── models/
│   │   └── main.py
│   │
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── public/
│   ├── styles/
│   ├── package.json
│   └── .env.local
│
└── README.md
```

---

# How It Works

## 1. Planner Agent
Breaks down the user query into structured research objectives and creates an execution strategy.

## 2. Research Agent
Collects relevant information, findings, and contextual data related to the query.

## 3. Analyzer Agent
Processes gathered information and generates summarized insights, opportunities, risks, and conclusions.

## 4. Critic Agent
Validates the generated output, identifies weak reasoning or missing information, and improves final quality.

## 5. Final Response
Returns a structured AI-generated research report through the frontend interface.

---

# Frontend Setup

## Navigate to frontend

```bash
cd frontend
```

## Install dependencies

```bash
npm install
```

## Create environment file

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Run frontend

```bash
npm run dev
```

Frontend runs on:

```bash
http://localhost:3000
```

---

# Backend Setup

## Navigate to backend

```bash
cd backend
```

## Create virtual environment

### Windows

```bash
python -m venv venv
venv\Scripts\activate
```

### Mac/Linux

```bash
python3 -m venv venv
source venv/bin/activate
```

## Install dependencies

```bash
pip install -r requirements.txt
```

## Create environment file

```env
OPENAI_API_KEY=your_api_key_here
```

## Run backend

```bash
uvicorn app.main:app --reload
```

Backend runs on:

```bash
http://localhost:8000
```

---

# API Endpoint

## Research Endpoint

```http
POST /research
```

### Request Body

```json
{
  "query": "Future of AI agents in software engineering"
}
```

### Response

```json
{
  "planner": "...",
  "research": "...",
  "analysis": "...",
  "critic": "...",
  "final_output": "..."
}
```

---

# UI Highlights

- Modern AI SaaS-inspired interface
- Gradient-based premium styling
- Animated workflow cards
- Research progress visualization
- Opportunity and risk indicators
- Responsive design

---

# Use Cases

- Market research
- Startup validation
- AI-assisted competitive analysis
- Technology trend analysis
- Research automation
- Educational research assistance

---

# Future Improvements

- Web search integration
- Streaming responses
- PDF export
- User authentication
- Saved research history
- Multi-model support
- Vector database memory
- Real-time agent collaboration

---

# Deployment

## Frontend
Recommended platforms:
- Vercel
- Netlify

## Backend
Recommended platforms:
- Render
- Railway
- Fly.io

---

# Environment Variables

## Frontend

```env
NEXT_PUBLIC_API_URL=
```

## Backend

```env
OPENAI_API_KEY=
```

---

# Screenshots

Add screenshots of:
- Landing page
- Agent workflow
- Research results
- Analysis dashboard

---

# Resume-Friendly Description

Built a fullstack multi-agent AI research platform using FastAPI and Next.js that automates planning, research, analysis, and validation workflows using LLM-powered agents.

---

# License

MIT License

---

# Author

Anish Dusad