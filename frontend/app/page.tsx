"use client";

import { useState } from "react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [analysis, setAnalysis] = useState<any>(null);

  const [status, setStatus] = useState({
    planner: false,
    researcher: false,
    analyzer: false,
    critic: false,
  });

  const [activities, setActivities] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addActivity = (text: string) => {
    setActivities((prev) => [...prev, text]);
  };

  const runAnalysis = async () => {
    setAnalysis(null);

    setActivities([]);

    setStatus({
      planner: false,
      researcher: false,
      analyzer: false,
      critic: false,
    });

    setLoading(true);

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/analyze?query=${encodeURIComponent(query)}`
      );

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      let buffer = "";

      while (true) {
        const { done, value } = await reader!.read();

        if (done) break;

        buffer += decoder.decode(value);

        const parts = buffer.split("\n");

        for (let part of parts.slice(0, -1)) {
          try {
            const parsed = JSON.parse(part);

            if (parsed.plan) {
              setStatus((s) => ({ ...s, planner: true }));
              addActivity("Planner created execution strategy");
            }

            if (parsed.research_logs) {
              setStatus((s) => ({ ...s, researcher: true }));
              addActivity("Researcher gathered intelligence");
            }

            if (parsed.analysis) {
              setStatus((s) => ({ ...s, analyzer: true }));
              addActivity("Analyzer generated insights");

              setAnalysis(parsed.analysis.analysis);
            }

            if (parsed.critic) {
              setStatus((s) => ({ ...s, critic: true }));
              addActivity("Critic validated final output");
            }

            if (parsed.retry_analysis) {
              setAnalysis(parsed.retry_analysis.analysis);
            }
          } catch {}
        }

        buffer = parts[parts.length - 1];
      }
    } catch (err) {
      console.error(err);
      addActivity("Connection failed");
    }

    setLoading(false);
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#FDFBD4",
        color: "#38240D",
        padding: "48px",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* HEADER */}

      <div style={{ marginBottom: 40 }}>
        <h1
          style={{
            fontSize: 56,
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: 14,
            letterSpacing: "-2px",
          }}
        >
          Agentic AI Research System
        </h1>

        <p
          style={{
            color: "#713600",
            opacity: 0.85,
            fontSize: 20,
            maxWidth: 800,
            lineHeight: 1.6,
          }}
        >
          Multi-agent intelligence platform for automated research,
          strategy, and market analysis.
        </p>
      </div>

      {/* INPUT */}

      <div
        style={{
          display: "flex",
          gap: 18,
          marginBottom: 42,
        }}
      >
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask anything..."
          style={{
            flex: 1,
            background: "#FFFDF2",
            border: "1px solid #E7DCC8",
            color: "#38240D",
            padding: "20px",
            borderRadius: 20,
            fontSize: 17,
            outline: "none",
            boxShadow: "0 4px 14px rgba(56,36,13,0.05)",
          }}
        />

        <button
          onClick={runAnalysis}
          disabled={loading}
          style={{
            padding: "20px 34px",
            borderRadius: 20,
            border: "none",
            background:
              "linear-gradient(to right, #713600, #C05800)",
            color: "#FDFBD4",
            fontWeight: 700,
            cursor: "pointer",
            fontSize: 15,
            boxShadow: "0 8px 24px rgba(192,88,0,0.25)",
          }}
        >
          {loading ? "Running..." : "Run Analysis"}
        </button>
      </div>

      {/* WORKFLOW */}

      <div style={{ marginBottom: 34 }}>
        <h2
          style={{
            marginBottom: 18,
            fontSize: 26,
            fontWeight: 700,
          }}
        >
          Agent Workflow
        </h2>

        <div
          style={{
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <FlowNode
            label="Planner"
            active={status.planner}
          />

          <FlowNode
            label="Researcher"
            active={status.researcher}
          />

          <FlowNode
            label="Analyzer"
            active={status.analyzer}
          />

          <FlowNode
            label="Critic"
            active={status.critic}
          />
        </div>
      </div>

      {/* MAIN GRID */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "360px 1fr",
          gap: 28,
          alignItems: "start",
        }}
      >
        {/* LEFT PANEL */}

        <div
          style={{
            background: "#FFFDF2",
            border: "1px solid #E7DCC8",
            borderRadius: 28,
            padding: 28,
            boxShadow: "0 8px 24px rgba(56,36,13,0.05)",
          }}
        >
          <h2
            style={{
              marginBottom: 24,
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            Agent Activity
          </h2>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            {activities.length === 0 && (
              <div
                style={{
                  color: "#713600",
                  opacity: 0.75,
                  fontSize: 15,
                }}
              >
                Waiting for execution...
              </div>
            )}

            {activities.map((activity, i) => (
              <div
                key={i}
                style={{
                  background: "#FDFBF4",
                  borderRadius: 18,
                  padding: 18,
                  border: "1px solid #E7DCC8",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <span
                    style={{
                      fontSize: 15,
                      color: "#38240D",
                      lineHeight: 1.5,
                    }}
                  >
                    {activity}
                  </span>

                  <span
                    style={{
                      color: "#C05800",
                      fontSize: 14,
                      fontWeight: 700,
                    }}
                  >
                    ✓
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT PANEL */}

        <div>
          {analysis && (
            <div
              style={{
                display: "grid",
                gap: 24,
              }}
            >
              <InsightCard
                title="Trends"
                borderColor="#713600"
                items={analysis.trends}
              />

              <InsightCard
                title="Risks"
                borderColor="#A63A00"
                items={analysis.risks}
              />

              <InsightCard
                title="Opportunities"
                borderColor="#C05800"
                items={analysis.opportunities}
              />

              <InsightCard
                title="Key Players"
                borderColor="#38240D"
                items={analysis.key_players}
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

/* FLOW NODE */

function FlowNode({
  label,
  active,
}: {
  label: string;
  active: boolean;
}) {
  return (
    <div
      style={{
        padding: "16px 26px",
        borderRadius: 18,
        background: active ? "#C05800" : "#FFFDF2",
        border: active
          ? "1px solid #C05800"
          : "1px solid #E7DCC8",
        color: active ? "#FDFBD4" : "#38240D",
        fontWeight: 700,
        fontSize: 15,
        transition: "0.3s",
        boxShadow: active
          ? "0 6px 18px rgba(192,88,0,0.2)"
          : "0 2px 8px rgba(56,36,13,0.03)",
      }}
    >
      {label}
    </div>
  );
}

/* INSIGHT CARD */
function InsightCard({
  title,
  items,
  borderColor,
}: {
  title: string;
  items: any[];
  borderColor: string;
}) {
  return (
    <div
      style={{
        background: "#FFFDF2",
        borderRadius: 28,
        padding: 28,
        borderLeft: `6px solid ${borderColor}`,
        borderTop: "1px solid #E7DCC8",
        borderRight: "1px solid #E7DCC8",
        borderBottom: "1px solid #E7DCC8",
        boxShadow: "0 8px 24px rgba(56,36,13,0.05)",
      }}
    >
      <h2
        style={{
          marginBottom: 22,
          fontSize: 30,
          fontWeight: 800,
          color: "#38240D",
        }}
      >
        {title}
      </h2>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        {items?.map((item: any, i: number) => (
          <div
            key={i}
            style={{
              background: "#FDFBF4",
              padding: "18px 20px",
              borderRadius: 18,
              color: "#38240D",
              border: "1px solid #E7DCC8",
              lineHeight: 1.6,
              fontSize: 15,
            }}
          >
            • {formatItem(item)}
          </div>
        ))}
      </div>
    </div>
  );
}

/* FORMATTER */

function formatItem(item: any) {
  if (typeof item === "string") return item;

  if (item.name) return item.name;

  return JSON.stringify(item);
}