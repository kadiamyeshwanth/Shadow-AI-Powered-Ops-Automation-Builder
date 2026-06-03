from fastapi import APIRouter, HTTPException
from models.workflow import ParseRequest, ParseResponse, WorkflowDocument
from services.ai_parser import parse_workflow
from services.db import save_workflow, list_workflows, get_workflow, delete_workflow
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/workflow", tags=["workflow"])


@router.post("/parse", response_model=ParseResponse)
async def parse_and_save(req: ParseRequest):
    """
    Accept raw natural language workflow description,
    parse via Gemini, persist to MongoDB, return structured data.
    """
    if not req.raw_input or len(req.raw_input.strip()) < 20:
        raise HTTPException(status_code=400, detail="Input too short. Please describe your workflow in more detail.")

    try:
        parsed = await parse_workflow(req.raw_input)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        logger.exception("Unexpected error during parsing")
        raise HTTPException(status_code=500, detail="Internal server error during AI parsing.")

    doc = WorkflowDocument(raw_input=req.raw_input, parsed=parsed)

    try:
        workflow_id = await save_workflow(doc)
    except Exception as e:
        logger.warning(f"DB save failed (returning result without persistence): {e}")
        workflow_id = doc.id

    return ParseResponse(workflow_id=workflow_id, parsed=parsed)


@router.get("/list")
async def get_all_workflows(limit: int = 20):
    """Return list of all saved workflow documents."""
    try:
        workflows = await list_workflows(limit=limit)
        return {"workflows": workflows, "count": len(workflows)}
    except Exception as e:
        logger.exception("Failed to list workflows")
        raise HTTPException(status_code=500, detail="Failed to fetch workflows.")


@router.get("/{workflow_id}")
async def get_single_workflow(workflow_id: str):
    """Fetch a single workflow by ID."""
    doc = await get_workflow(workflow_id)
    if not doc:
        raise HTTPException(status_code=404, detail=f"Workflow '{workflow_id}' not found.")
    return doc


@router.delete("/{workflow_id}")
async def remove_workflow(workflow_id: str):
    """Delete a workflow by ID."""
    deleted = await delete_workflow(workflow_id)
    if not deleted:
        raise HTTPException(status_code=404, detail=f"Workflow '{workflow_id}' not found.")
    return {"message": f"Workflow '{workflow_id}' deleted successfully."}
