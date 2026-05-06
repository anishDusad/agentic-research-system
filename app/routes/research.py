from fastapi import APIRouter
from fastapi.responses import StreamingResponse
import json

from app.agents.planner import planner_agent
from app.agents.researcher import research_agent
from app.agents.analyzer import analyzer_agent
from app.agents.critic import critic_agent
from app.memory.vector_store import store_memory, retrieve_memory

router = APIRouter()


def stream_generator(query: str):

    # Step 1: Retrieve memory
    memory = retrieve_memory(query)
    yield json.dumps({"memory": memory}) + "\n"

    # Step 2: Planner
    plan = planner_agent(query)
    yield json.dumps({"plan": plan}) + "\n"

    if "error" in plan:
        return

    # Step 3: Research
    research = research_agent(plan["steps"])
    yield json.dumps({"research_logs": research["logs"]}) + "\n"

    # Step 4: Analyzer (with memory)
    analysis = analyzer_agent(research["data"], memory)
    yield json.dumps({"analysis": analysis}) + "\n"

    # Step 5: Critic
    critic = critic_agent(analysis)
    yield json.dumps({"critic": critic}) + "\n"

    # Step 6: Retry if needed
    if critic["needs_retry"]:
        analysis = analyzer_agent(research["data"], memory)
        yield json.dumps({"retry_analysis": analysis}) + "\n"
        critic["logs"].append("Retry triggered")

    # Step 7: Store memory
    store_memory(query, analysis)


@router.get("/analyze")
def analyze(query: str):
    return StreamingResponse(
        stream_generator(query),
        media_type="text/plain"
    )