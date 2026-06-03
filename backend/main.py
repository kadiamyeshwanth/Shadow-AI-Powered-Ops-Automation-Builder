from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from routes.workflow import router as workflow_router
from services.db import close_client
from config import get_settings
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Shadow backend starting up...")
    yield
    logger.info("Shadow backend shutting down...")
    await close_client()


def create_app() -> FastAPI:
    settings = get_settings()

    app = FastAPI(
        title="Shadow AI Ops Engine",
        description="Convert messy human workflows into production-ready AI agents.",
        version="1.0.0",
        lifespan=lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=[settings.frontend_origin, "http://localhost:5173", "http://localhost:3000"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(workflow_router)

    @app.get("/health")
    async def health():
        return {"status": "ok", "service": "shadow-backend"}

    return app


app = create_app()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
