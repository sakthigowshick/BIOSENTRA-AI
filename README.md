# BioSentra AI - AI-Powered Preventive Healthcare Screening Platform

BioSentra AI is a comprehensive, production-ready, full-stack web application designed for early chronic disease detection and preventive healthcare screening. It evaluates patient biomarkers and lifestyle metrics against trained machine learning classifiers to predict risk probabilities for five chronic conditions:

*   **Diabetes**
*   **Anaemia**
*   **Cardiovascular Disease**
*   **Chronic Kidney Disease**
*   **Hypertension**

Once predictions are run, a customized clinical-grade Recommendation Engine generates tailormade advice spanning **diet**, **exercise**, **lifestyle modulators**, and **medical follow-ups**. Patients can review historical trends via interactive dashboards, print reports, and download formal PDF health summaries.

---

## 🏗️ Project Architecture & Folder Structure

```text
biosentra-ai/
│
├── backend/                  # FastAPI Application
│   ├── routes/               # API Router modules (auth, predict, reports)
│   ├── services/             # Core business logic (recommendation engine, PDF compiler)
│   ├── utils/                # Security context (JWT, bcrypt password hashing)
│   ├── database.py           # SQLAlchemy setup (dynamically SQLite/PostgreSQL)
│   ├── models.py             # DB schema tables (users, assessments, predictions, recs)
│   ├── schemas.py            # Pydantic request/response validations
│   ├── main.py               # FastAPI application entrypoint
│   ├── requirements.txt      # Backend Python dependencies
│   └── Dockerfile            # Backend Docker builder
│
├── frontend/                 # React Vite Client (SPA)
│   ├── src/
│   │   ├── components/       # Shared presentation components
│   │   ├── context/          # Auth Context provider (Axios configuration)
│   │   ├── pages/            # Page panels (Landing, Dashboard, Forms, Reports)
│   │   ├── App.jsx           # SPA router setup and guards
│   │   ├── index.css         # Tailwind inputs and baseline CSS
│   │   └── main.jsx          # React app mounter
│   ├── index.html            # HTML document shell (Inter Font loader)
│   ├── tailwind.config.js    # Tailwind configuration rules
│   ├── postcss.config.js     # PostCSS configuration rules
│   ├── nginx.conf            # Nginx proxy mapping client fallbacks
│   └── Dockerfile            # Frontend multi-stage builder
│
├── datasets/                 # Local CSV training data
├── models/                   # Serialized ML pipelines (.pkl files)
├── scripts/                  # Automated pipeline scripts
│   ├── generate_datasets.py  # Generates realistic synthetic clinical records
│   └── train_models.py       # Trains, optimizes, and registers pipelines
│
├── docker-compose.yml        # Multi-container orchestration (DB, API, Client)
└── README.md                 # Project guide
```

---

## ⚡ Quick Start: Local Native Execution

### Prerequisite check
Ensure you have **Python 3.10+** and **Node.js 18+** installed locally.

### 1. Scaffolding & Setup
From the project root `biosentra-ai/`, activate the Python virtual environment and run the dataset generation:
```bash
# Create and activate virtual environment
python -m venv venv
.\venv\Scripts\activate # On Windows PowerShell

# Install python requirements
pip install -r backend/requirements.txt
pip install httpx email-validator # additional test dependencies

# Generate synthetic datasets
python scripts/generate_datasets.py
```

### 2. Model Training & Registration
Train and evaluate multiple models (Logistic Regression, Random Forest, Gradient Boosting) to register the highest F1/Recall scoring model pipeline:
```bash
python scripts/train_models.py
```
This registers 5 pickle files (`anemia.pkl`, `diabetes.pkl`, `heart.pkl`, `hypertension.pkl`, `kidney.pkl`) inside the `models/` directory, packaging the standard scaler, simple imputer, and classifier into a single executable object.

### 3. Run FastAPI Backend
Launch the API server using Uvicorn. This will automatically spin up the database schemas and initialize `biosentra.db` (SQLite):
```bash
# From project root
uvicorn backend.main:app --reload --port 8000
```
API docs are immediately accessible at: `http://localhost:8000/docs`.

### 4. Run React Client
Open a separate terminal window and compile the frontend:
```bash
cd frontend
npm install
npm run dev
```
Open your browser and navigate to: `http://localhost:5173`.

---

## 🐳 Quick Start: Docker Compose Production Deployment

To run the entire ecosystem (including a dedicated PostgreSQL database container, reverse proxies, and Nginx setups) in a single command, execute the following from the root directory:

```bash
# Build and run containers
docker-compose up --build
```

Nginx maps the frontend client to port `80`. 
*   **Web Portal:** `http://localhost/`
*   **Backend API Documentation:** `http://localhost/docs` (requests are automatically proxied via Nginx `/api` rules)

---

## 🧪 Verification Plan: Running Tests

We implement integrated test clients checking authorization states, prediction structures, and health indicators.

Run pytest in your terminal:
```bash
python -m pytest backend/tests/
```

---

## 📜 Medical Screening Disclaimer

*BioSentra AI is a statistical classifier designed for screening, educational, and lifestyle mitigation recommendation purposes. It does not replace professional clinical lab checks, formal physician diagnosis, or medication therapies. Always consult a general practitioner or cardiologist to interpret your reports and receive proper clinical advice.*
