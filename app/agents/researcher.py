from app.tools.search import search_web

def research_agent(steps):
    all_results = []
    logs = []

    for step in steps:
        query = step["step"]

        logs.append(f"Searching: {query}")

        results = search_web(query)

        all_results.append({
            "query": query,
            "results": results
        })

    return {
        "data": all_results,
        "logs": logs
    }