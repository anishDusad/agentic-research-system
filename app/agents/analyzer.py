from app.utils.llm import call_llm
from app.utils.parser import extract_json


def analyzer_agent(research_data, memory=None):
    """
    Converts research data into structured insights.
    Optionally uses retrieved memory to improve analysis.
    """

    # ---- 1. Build combined research text (trimmed to avoid token overflow) ----
    combined_text = ""

    for item in research_data[:3]:  # limit steps
        combined_text += f"\nQuery: {item['query']}\n"

        for r in item["results"][:2]:  # limit results
            content = r["content"][:300]  # trim content
            combined_text += f"""
Title: {r['title']}
Content: {content}
"""

    # ---- 2. Build memory context ----
    memory_text = ""

    if memory and isinstance(memory, dict):
        docs = memory.get("documents")

        # Chroma returns nested list: [[...]]
        if docs and isinstance(docs, list) and len(docs) > 0:
            first_list = docs[0]
            if first_list and len(first_list) > 0:
                memory_text = f"\nPAST CONTEXT:\n{first_list[0]}\n"

    # ---- 3. Prompt ----
    prompt = f"""
You are an expert market analyst.

Use both current research data and past context (if provided).

Return STRICT JSON in this format:
{{
  "trends": [],
  "key_players": [],
  "risks": [],
  "opportunities": []
}}

Rules:
- No explanation
- Only JSON
- Be concise and structured

{memory_text}

DATA:
{combined_text}
"""

    # ---- 4. Retry mechanism ----
    for attempt in range(3):
        response = call_llm(prompt, model="llama-3.1-8b-instant")

        parsed = extract_json(response)

        if parsed:
            return {
                "analysis": parsed,
                "logs": [f"Analyzer success on attempt {attempt + 1}"]
            }

    # ---- 5. Fallback ----
    return {
        "error": "Analyzer failed after retries",
        "raw_output": response
    }