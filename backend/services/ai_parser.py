from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from models.workflow import ParsedWorkflow
from config import get_settings
import logging
import json
import re

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are Shadow, an enterprise AI Automation Architect with deep expertise in business process analysis.

The user will describe a manual, repetitive business process in natural language — it may be messy, conversational, or incomplete.

Your job is to:
1. Identify the initial TRIGGER (what starts the process — time-based, event-based, or manual)
2. Identify all CONDITION checks (if/else logic, filters, thresholds)
3. Identify all ACTIONS (things that happen — fetching data, sending messages, updating records)
4. Estimate how many minutes this takes a human each time
5. Calculate ROI metrics

Return ONLY a valid JSON object matching this exact schema. No markdown fences, no explanation — raw JSON only:

{{
  "workflow_name": "Short descriptive name (3-6 words)",
  "description": "One sentence describing what this workflow automates",
  "nodes": [
    {{
      "id": "node_1",
      "type": "trigger",
      "label": "Short label (4-7 words)",
      "description": "What this step does",
      "action_type": "schedule | fetch_data | logical_filter | generate_text | send_notification | update_record | transform_data",
      "requires_human_approval": false,
      "tool_hint": "e.g. Gmail API, Cron, Spreadsheet API"
    }}
  ],
  "edges": [
    {{"source": "node_1", "target": "node_2"}}
  ],
  "roi": {{
    "estimated_manual_minutes": 15,
    "hours_saved_per_week": 2.5,
    "annual_hours_saved": 130.0,
    "estimated_annual_cost_savings": 6500.0,
    "complexity_score": 6,
    "automation_confidence": 0.87
  }},
  "tags": ["finance", "email", "data-processing"]
}}

RULES:
- Always set requires_human_approval=true for any node that sends a message, makes a payment, or deletes data
- The first node must always be type=trigger
- Complexity score 1-10 (10=most complex)
- automation_confidence 0.0-1.0 based on how clear the process description is
- Assume $50/hour average employee cost for cost savings calculation
- hours_saved_per_week = (estimated_manual_minutes / 60) * average_weekly_occurrences (estimate based on context)
- annual_hours_saved = hours_saved_per_week * 52
- estimated_annual_cost_savings = annual_hours_saved * 50
- Use between 3 and 8 nodes for most workflows
- Generate realistic, specific labels — not generic ones
"""

USER_TEMPLATE = """Parse this business process description into a Shadow automation workflow:

---
{raw_input}
---

Return only the JSON object."""


def _build_chain():
    settings = get_settings()
    llm = ChatGoogleGenerativeAI(
        model="gemini-2.0-flash",
        google_api_key=settings.gemini_api_key,
        temperature=0.2,
        max_retries=1,          # fail fast instead of retrying 5+ times
        request_timeout=30,     # 30-second hard cap per call
    )
    prompt = ChatPromptTemplate.from_messages([
        ("system", SYSTEM_PROMPT),
        ("human", USER_TEMPLATE),
    ])
    parser = JsonOutputParser()
    return prompt | llm | parser


def _extract_json(text: str) -> dict:
    """Fallback: strip markdown fences and parse raw JSON."""
    text = re.sub(r"```(?:json)?", "", text).strip().rstrip("`").strip()
    return json.loads(text)


async def parse_workflow(raw_input: str) -> ParsedWorkflow:
    chain = _build_chain()
    logger.info("Sending workflow to Gemini for parsing...")

    try:
        result = await chain.ainvoke({"raw_input": raw_input})
    except Exception as e:
        logger.error(f"LangChain invoke failed: {e}")
        raise ValueError(f"AI parsing failed: {str(e)}")

    # result is already a dict from JsonOutputParser
    if isinstance(result, str):
        result = _extract_json(result)

    try:
        parsed = ParsedWorkflow(**result)
    except Exception as e:
        logger.error(f"Schema validation failed: {e}\nRaw result: {result}")
        raise ValueError(f"AI returned invalid schema: {str(e)}")

    logger.info(f"Successfully parsed workflow: '{parsed.workflow_name}' with {len(parsed.nodes)} nodes")
    return parsed
