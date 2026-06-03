from pydantic import BaseModel, Field
from typing import Optional, List
from enum import Enum
import uuid
from datetime import datetime


class NodeType(str, Enum):
    trigger = "trigger"
    condition = "condition"
    action = "action"


class ActionType(str, Enum):
    fetch_data = "fetch_data"
    logical_filter = "logical_filter"
    generate_text = "generate_text"
    send_notification = "send_notification"
    update_record = "update_record"
    schedule = "schedule"
    transform_data = "transform_data"


class WorkflowNode(BaseModel):
    id: str
    type: NodeType
    label: str
    description: Optional[str] = None
    action_type: ActionType
    requires_human_approval: bool = False
    tool_hint: Optional[str] = None


class WorkflowEdge(BaseModel):
    source: str
    target: str


class ROIMetrics(BaseModel):
    estimated_manual_minutes: int
    hours_saved_per_week: float
    annual_hours_saved: float
    estimated_annual_cost_savings: float
    complexity_score: int = Field(ge=1, le=10)
    automation_confidence: float = Field(ge=0.0, le=1.0)


class ParsedWorkflow(BaseModel):
    workflow_name: str
    description: str
    nodes: List[WorkflowNode]
    edges: List[WorkflowEdge]
    roi: ROIMetrics
    tags: List[str] = []


class WorkflowDocument(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    raw_input: str
    parsed: ParsedWorkflow
    created_at: datetime = Field(default_factory=datetime.utcnow)
    status: str = "draft"  # draft | active | archived


class ParseRequest(BaseModel):
    raw_input: str


class ParseResponse(BaseModel):
    workflow_id: str
    parsed: ParsedWorkflow
    message: str = "Workflow parsed and saved successfully"
