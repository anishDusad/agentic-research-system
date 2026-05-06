"use client";

import { useState } from "react";
import { CSSProperties } from "react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [logs, setLogs] = useState<any[]>([]);
  const [analysis, setAnalysis] = useState<any>(null);
  const [status, setStatus] = useState<any>({
    planner: false,
    researcher: false,
    analyzer: false,
    critic: false
  });
  const [loading, setLoading] = useState(false);

  const runAnalysis = async () => {
    setLogs([]);
    setAnalysis(null);
    setStatus({
      planner: false,
      researcher: false,
      analyzer: false,
      critic: false
    });

    setLoading(true);

    const res = await fetch(
      `http://127.0.0.1:8000/analyze?query=${query}`
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

          setLogs((prev) => [...prev, parsed]);

          // --- Flow status tracking ---
          if (parsed.plan) {
            setStatus((s: any) => ({ ...s, planner: true }));
          }

          if (parsed.research_logs) {
            setStatus((s: any) => ({ ...s, researcher: true }));
          }

          if (parsed.analysis) {
            setStatus((s: any) => ({ ...s, analyzer: true }));
            setAnalysis(parsed.analysis.analysis);
          }

          if (parsed.critic) {
            setStatus((s: any) => ({ ...s, critic: true }));
          }

          if (parsed.retry_analysis) {
            setAnalysis(parsed.retry_analysis.analysis);
          }

        } catch {}
      }

      buffer = parts[parts.length - 1];
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      
      {/* HEADER */}
      <h1 style={{ fontSize: 28 }}>Agentic AI System</h1>

      {/* INPUT */}
      <div style={{ marginBottom: 20 }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter query"
          style={inputStyle}
        />

        <button onClick={runAnalysis} style={buttonStyle}>
          Run
        </button>
      </div>

      {loading && <p>Running agents...</p>}

      {/* FLOW DIAGRAM */}
      <div style={{ marginBottom: 20 }}>
        <h3>Agent Flow</h3>
        <div style={flowContainer}>
          <FlowNode label="Planner" active={status.planner} />
          <Arrow />
          <FlowNode label="Researcher" active={status.researcher} />
          <Arrow />
          <FlowNode label="Analyzer" active={status.analyzer} />
          <Arrow />
          <FlowNode label="Critic" active={status.critic} />
        </div>
      </div>

      <div style={{ display: "flex", gap: 20 }}>

        {/* LEFT: LOGS */}
        <div style={logsContainer}>
          <h3>Trace</h3>
          {logs.map((log, i) => (
            <pre key={i} style={logBox}>
              {JSON.stringify(log, null, 2)}
            </pre>
          ))}
        </div>

        {/* RIGHT: ANALYSIS */}
        <div style={{ width: "60%" }}>
          {analysis && (
            <div>

              <Card title="Trends">
                {analysis.trends?.map((t: any, i: number) => (
                  <p key={i}>• {formatItem(t)}</p>
                ))}
              </Card>

              <Card title="Risks" color="#ffe5e5">
                {analysis.risks?.map((r: any, i: number) => (
                  <p key={i}>• {formatItem(r)}</p>
                ))}
              </Card>

              <Card title="Opportunities" color="#e6ffe6">
                {analysis.opportunities?.map((o: any, i: number) => (
                  <p key={i}>• {formatItem(o)}</p>
                ))}
              </Card>

              <Card title="Key Players">
                {analysis.key_players?.map((k: any, i: number) => (
                  <p key={i}>• {formatItem(k)}</p>
                ))}
              </Card>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}


/* ---------- UI COMPONENTS ---------- */

function FlowNode({ label, active }: any) {
  return (
    <div
      style={{
        padding: "10px 16px",
        borderRadius: 8,
        background: active ? "#000" : "#ccc",
        color: "#fff",
        fontSize: 14
      }}
    >
      {label}
    </div>
  );
}

function Arrow() {
  return <span style={{ margin: "0 8px" }}>→</span>;
}

function Card({ title, children, color = "#fff" }: any) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        background: color
      }}
    >
      <h3>{title}</h3>
      {children}
    </div>
  );
}

function formatItem(item: any) {
  if (typeof item === "string") return item;
  if (item.name) return item.name;
  return JSON.stringify(item);
}


/* ---------- STYLES ---------- */

const inputStyle = {
  padding: 10,
  width: 300,
  border: "1px solid #ccc",
  borderRadius: 6
};

const buttonStyle = {
  marginLeft: 10,
  padding: "10px 16px",
  background: "#000",
  color: "#fff",
  borderRadius: 6
};

const logsContainer: CSSProperties = {
  width: "40%",
  maxHeight: "500px",
  overflowY: "auto",
  border: "1px solid #ddd",
  padding: 10,
  borderRadius: 8
};

const logBox = {
  fontSize: 12,
  background: "#f5f5f5",
  padding: 8,
  borderRadius: 6,
  marginBottom: 10
};

const flowContainer = {
  display: "flex",
  alignItems: "center"
};