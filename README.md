# LearningPath AI – Workforce Upskilling & Career Evolution Platform

> **An evolving AI learning ecosystem fusing real-time industry intelligence, persistent employee memory, and generative AI to continuously adapt workforce learning plans.**

![License](https://img.shields.io/badge/License-MIT-violet.svg)
![Python](https://img.shields.io/badge/Python-3.13%2B-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115%2B-009688.svg)
![React](https://img.shields.io/badge/React-18-61DAFB.svg)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF.svg)

---

## 1. Executive Product Vision

Organizations face rapid shifts in technology, generative AI tooling, and workforce requirements. Traditional corporate Learning Management Systems (LMS) offer static course catalogs and generic recommendations that quickly become obsolete.

**LearningPath AI** introduces an adaptive learning ecosystem powered by three synergistic pillars:
1. **Firecrawl Web Intelligence**: Real-time extraction from industry job postings, tech blogs, certification authorities, and salary indexes. Discovers what skills the market actually demands.
2. **Memento Persistent Memory**: Bitemporal memory tracking employee learning history, completed courses, abandoned efforts, and competency demonstrations. Ensures the AI never recommends what an employee already knows, advancing them to higher-level concepts.
3. **Generative AI Reasoning Engine**: Synthesizes verified market demand and persistent employee memory into personalized, evolving weekly roadmaps with hands-on capstone projects and assessment checkpoints.

---

## 2. Key Features & Novel Differentiators

### Core Platform Features
- **Feature 1: Dynamic Skill Gap Intelligence**: Analyzes employee proficiency across *Beginner, Intermediate, Advanced, and Expert* levels against real-world target job requirements. Calculates overall readiness scores and learning priority order.
- **Feature 2: Live Industry Intelligence (Firecrawl)**: Extracts trending technologies, required certifications, and verified learning resources. Includes a live web crawler search bar and refresh trigger.
- **Feature 3: Persistent AI Learning Memory (Memento)**: Bitemporal knowledge graph recording valid time vs transaction time for completed courses, abandoned efforts, and preferences.
- **Feature 4: Adaptive Learning Roadmap Generator**: Generates weekly structured roadmaps with practical capstones, course links, assessment checkpoints, and interactive progress management (*Mark Completed, Pause, Resume*).
- **Feature 5: Future Skill Radar**: Classifies skills into *Rapidly Growing, Currently Demanded, Emerging, and Declining*, clearly separating observed market demand from AI forecasts.
- **Feature 6: AI Career Evolution Simulator**: Models transitions from current roles to target positions (AI Engineer, Data Scientist, Full Stack Developer, Cloud Engineer, Cybersecurity Architect) with compatibility scores and projected upside.
- **Feature 7: Intelligent Learning Notifications**: Event-driven notification center alerting employees to market surges, obsolescence risks, and milestone completions.
- **Feature 8: AI Learning Mentor**: Context-aware chatbot referencing Memento memories and Firecrawl market signals for personalized career guidance.

### Novel Differentiators
- **Differentiator A: Skill Obsolescence Alert**: Detects technologies experiencing market contraction (e.g. MapReduce, legacy frameworks, ad-hoc prompt crafting) with empirical drop rates and recommended modern replacements.
- **Differentiator B: Learning ROI Estimator**: Projects total learning hours, weekly commitments, estimated resource costs, readiness percentage gains, and salary upside.
- **Differentiator C: Roadmap Evolution Tracker**: Provides a side-by-side comparison of previous vs evolved roadmaps with clear explanations of why Firecrawl market changes and Memento accomplishments triggered curriculum updates.

---

## 3. Technology Architecture

```
LearningPath-AI/
├── backend/
│   ├── app/
│   │   ├── main.py                  # FastAPI app entry point & demo seeder
│   │   ├── config.py                # Environment configuration
│   │   ├── api/                     # REST API routers
│   │   │   ├── auth.py              # JWT authentication & registration
│   │   │   ├── employees.py         # Profile & onboarding wizard
│   │   │   ├── skills.py            # Skill gaps, radar & obsolescence
│   │   │   ├── roadmap.py           # Adaptive roadmap & evolution diff
│   │   │   ├── industry.py          # Firecrawl intelligence & search
│   │   │   ├── memory.py            # Memento persistent memory
│   │   │   ├── chatbot.py           # AI Learning Mentor
│   │   │   ├── analytics.py         # Telemetry & Recharts progress
│   │   │   ├── hr.py                # HR workforce suite & initiative dispatch
│   │   │   └── career.py            # Career transition simulator
│   │   ├── services/                # Business logic & GenAI adapters
│   │   │   ├── firecrawl_service.py # Firecrawl API & verified corpus
│   │   │   ├── memento_service.py   # Bitemporal memory graph adapter
│   │   │   ├── llm_service.py       # OpenAI / Gemini / Domain Reasoning Engine
│   │   │   ├── skill_gap_service.py # Gap analyzer & priority sorting
│   │   │   ├── roadmap_service.py   # Adaptive roadmap generator
│   │   │   └── career_service.py    # Career simulator matrix
│   │   ├── models/                  # Pydantic schemas & DB models
│   │   ├── database/                # MongoDB with automatic DocumentDB fallback
│   │   └── utils/                   # Security (Bcrypt, JWT) & sanitizers
│   ├── tests/                       # Pytest unit & integration suite
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/              # Sidebar, Navbar, NotificationPanel, DiffModal
│   │   ├── pages/                   # 14 complete interactive pages
│   │   ├── context/                 # AuthContext & NotificationContext
│   │   ├── services/                # Unified API client
│   │   ├── App.jsx                  # Main application routing
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .env.example
└── README.md
```

---

## 4. Getting Started & Installation

### Prerequisites
- **Python**: 3.10+ (tested on Python 3.13)
- **Node.js**: v18+ (tested on v24.14.1 / npm 11.11.0)
- **MongoDB & Motor** (optional): If local MongoDB daemon and `motor` are available, connects automatically. If not, the built-in persistent local DocumentDB store activates seamlessly with zero extra dependencies required.
- **Cross-Platform Frontend**: Multi-platform Rollup binaries (`@rollup/rollup-linux-x64-gnu`, `@rollup/rollup-darwin-arm64`, `@rollup/rollup-win32-x64-msvc`) are mapped in `package.json` for 100% portable builds.

---

### Step 1: Backend Setup

1. Open a terminal in the backend directory:
   ```bash
   cd LearningPath-AI/backend
   ```
2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Configure environment variables:
   ```bash
   copy .env.example .env
   ```
   *(Optional)* Add your `FIRECRAWL_API_KEY`, `MEMENTO_API_KEY`, or `OPENAI_API_KEY` in `.env`. If left empty, the built-in verified industry intelligence and deterministic domain reasoning engine run out of the box!
4. Launch the FastAPI backend server:
   ```bash
   python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```
   The backend API will be available at: `http://localhost:8000`  
   Interactive Swagger documentation: `http://localhost:8000/docs`

---

### Step 2: Frontend Setup

1. Open a second terminal in the frontend directory:
   ```bash
   cd LearningPath-AI/frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   ```bash
   copy .env.example .env
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The application UI will be available at: `http://localhost:9000` (or `http://localhost:9001` if 9000 is occupied)

---

## 5. Demonstration Accounts

The platform includes pre-seeded enterprise accounts with pre-loaded Memento memories and active roadmaps:

| Role | Name | Email | Password | Target Career |
|---|---|---|---|---|
| **Employee** | Alex Chen | `alex.chen@enterprise.com` | `password123` | AI Engineer |
| **HR Manager** | Sarah Jenkins | `sarah.hr@enterprise.com` | `password123` | VP of Talent Intelligence |
| **Learning Admin** | David Kim | `david.admin@enterprise.com` | `password123` | Head of Enterprise Education |

> **Tip:** You can also use the **One-Click Demo Switcher** directly in the Sign-In screen or in the left sidebar to swap between roles instantly.

---

## 6. Running Tests

To run the complete automated unit and integration test suite:

```bash
cd LearningPath-AI/backend
pytest tests -v
```

All 15 automated test suites pass with 100% success:
- Health check and database connection (MongoDB with zero-dependency LocalDocumentDB fallback)
- Employee registration and JWT authentication
- Invalid credentials rejection
- Employee profile and skill gap analysis
- Firecrawl industry intelligence and search
- Memento persistent memory storage and retrieval
- Adaptive roadmap milestone generation and progress updates
- Roadmap evolution diff comparison
- Career transition simulator
- AI Mentor chatbot context retrieval
- Role-based access control (guarding HR endpoints)
- **Workforce Digital Twin lifecycle** (`/api/digital-twin/profile`, `/skills`, `/history`, `/readiness`)
- **Digital Twin AI update engine** (`/api/digital-twin/update`)
- **What-If Career Simulation Lab** (`/api/digital-twin/simulate`)
- **Organizational Workforce Digital Twin & Department Heatmap** (`/api/hr/workforce-digital-twin`)

---

## 7. REST API Documentation Overview

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register new user with designated role |
| `POST` | `/api/auth/login` | Authenticate and obtain JWT bearer token |
| `GET` | `/api/auth/me` | Fetch active user credentials and role |
| `GET` | `/api/employees/profile` | Retrieve employee profile and competencies |
| `PUT` | `/api/employees/profile` | Update employee profile information |
| `POST` | `/api/employees/onboarding` | Submit onboarding wizard & auto-generate roadmap |
| `POST` | `/api/skills/analyze` | Perform dynamic skill gap calculation |
| `GET` | `/api/skills/obsolescence` | Retrieve skill obsolescence alerts |
| `GET` | `/api/skills/radar` | Retrieve future skill radar trends |
| `POST` | `/api/roadmap/generate` | Generate or evolve adaptive learning roadmap |
| `GET` | `/api/roadmap/current` | Retrieve active roadmap with milestones |
| `PUT` | `/api/roadmap/progress` | Update milestone completion status |
| `GET` | `/api/roadmap/evolution` | Compare previous vs updated roadmap diff |
| `GET` | `/api/industry/trends` | Fetch trending skills and required certifications |
| `POST` | `/api/industry/refresh` | Trigger Firecrawl web intelligence refresh |
| `POST` | `/api/industry/search` | Search live web intelligence for custom skills |
| `GET` | `/api/memory/history` | Retrieve bitemporal Memento memory items |
| `POST` | `/api/memory/store` | Store a new learning or preference memory |
| `DELETE` | `/api/memory/{id}` | Remove a memory entry from persistent store |
| `POST` | `/api/chat` | AI Learning Mentor chatbot interaction |
| `GET` | `/api/career/simulate` | AI Career Evolution Simulator projections |
| `GET` | `/api/analytics/dashboard` | Dashboard KPI metrics and recent insights |
| `GET` | `/api/analytics/progress` | Recharts longitudinal progress data |
| `GET` | `/api/hr/dashboard` | HR department-level skill shortage matrix |
| `GET` | `/api/hr/employees` | HR view of employee upskilling telemetry |
| `POST` | `/api/hr/recommend` | Dispatch targeted upskilling initiative |
| `GET` | `/api/digital-twin/profile` | Retrieve employee's Workforce Digital Twin |
| `GET` | `/api/digital-twin/skills` | Categorized skill intelligence across 8 domains |
| `GET` | `/api/digital-twin/history` | Memento learning memory & twin version evolution |
| `GET` | `/api/digital-twin/readiness` | Explainable career readiness intelligence & formula |
| `POST` | `/api/digital-twin/update` | AI update engine for activities & goal changes |
| `POST` | `/api/digital-twin/simulate` | What-If Career Simulation Lab projections |
| `GET` | `/api/hr/workforce-digital-twin` | Aggregated Organizational Workforce Digital Twin |
| `GET` | `/api/hr/department-heatmap` | Department x Skill Category competency heatmap |
| `GET` | `/api/hr/workforce-skill-gaps` | Organization-wide critical skill gap matrix |
| `GET` | `/api/health` | Service health status and database engine mode |

---

## 8. License

Distributed under the MIT License. Built for enterprise workforce transformation.
