from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.database import engine, Base
from backend.routes import auth, predict, reports

# Create DB Tables on startup if they don't exist
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="BioSentra AI API",
    description="Intelligent disease screening and preventive health recommendations platform.",
    version="1.0.0"
)

# CORS configuration
origins = [
    "http://localhost:5173",    # React Vite local dev server
    "http://127.0.0.1:5173",
    "http://localhost:8080",    # Docker Compose or production ports
    "http://localhost",
    "*"                         # Allows all in testing/development environments
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers under standard /api prefix
app.include_router(auth.router, prefix="/api")
app.include_router(predict.router, prefix="/api")
app.include_router(reports.router, prefix="/api")

@app.get("/api/health", tags=["Health"])
def health_check():
    """
    Service health check endpoint.
    """
    return {
        "status": "healthy",
        "service": "BioSentra AI API Backend",
        "database": "connected"
    }
