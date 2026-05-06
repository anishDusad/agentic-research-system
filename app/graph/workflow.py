from langgraph.graph import StateGraph

from app.agents.planner import planner_agent
from app.agents.researcher import research_agent
from app.agents.analyzer import analyzer_agent
from app.agents.critic import critic_agent


def run_graph(query: str):

    state = {
        "query": query
    }

    # Planner
    plan = planner_agent(query)
    state["plan"] = plan

    if "error" in plan:
        return state

    # Research
    research = research_agent(plan["steps"])
    state["research"] = research

    # Analysis
    analysis = analyzer_agent(research["data"])
    state["analysis"] = analysis

    # Critic
    critic = critic_agent(analysis)
    state["critic"] = critic

    return state