# app/agents/critic.py

def critic_agent(analysis):

    data = analysis.get("analysis", {})

    issues = []
    
    # 🔹 Basic checks
    if not data.get("trends"):
        issues.append("Missing trends")

    if not data.get("risks"):
        issues.append("Missing risks")

    if not data.get("opportunities"):
        issues.append("Missing opportunities")

    # 🔹 Check if too shallow
    total_points = (
        len(data.get("trends", [])) +
        len(data.get("risks", [])) +
        len(data.get("opportunities", []))
    )

    if total_points < 5:
        issues.append("Analysis too shallow")

    # 🔹 Decision
    needs_retry = len(issues) > 0

    return {
        "needs_retry": needs_retry,
        "issues": issues,
        "logs": ["Critic evaluated analysis"]
    }