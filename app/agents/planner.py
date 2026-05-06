from app.utils.llm import call_llm
from app.utils.parser import extract_json

def planner_agent(query: str):
    prompt = f"""
You are a planning agent.

Break the query into clear steps.

Query:
{query}

STRICT RULES:
- Return ONLY JSON
- No explanation
- Format:
[
  {{"step": "..."}},
  {{"step": "..."}}
]
"""

    for attempt in range(3):
        response = call_llm(prompt)
        parsed = extract_json(response)

        if parsed:
            return {
                "steps": parsed,
                "logs": [
                    f"Planner success on attempt {attempt + 1}"
                ]
            }

    return {
        "error": "Planner failed after 3 attempts",
        "raw_output": response
    }