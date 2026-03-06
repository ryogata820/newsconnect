import { useState, useEffect } from "react";
import Head from "next/head";

const categories = ["すべて", "映画", "小説", "ドラマ"];
const categoryEmoji = { 映画: "🎬", 小説: "📚", ドラマ: "📺" };

function Spinner({ label = "AIが分析中..." }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", padding: "48px 0" }}>
      <div style={{
        width: "38px", height: "38px",
        border: "3px solid rgba(255,255,255,0.08)",
        borderTop: "3px solid #FF6B35",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite"
      }} />
      <p style={{ color: "#777", fontSize: "13px", margin: 0 }}>{label}</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function ManualInput({ onSubmit, disabled }) {
  const [val, setVal] = useState("");
  function handleSubmit() {
    const trimmed = val.trim();
    if (!trimmed || disabled) return;
    onSubmit(trimmed);
    setVal("");
  }
  return (
    <div style={{
      background: "rgba(255,107,53,0.06)", border: "1px solid rgba(255,107,53,0.2)",
      borderRadius: "16px", padding: "14px 16px", marginBottom: "20px"
    }}>
      <p style={{ margin: "0 0 10px", fontSize: "12px", color: "#FF8C42" }}>✏️ 気になるトピックを直接入力</p>
      <div style={{ display: "flex", gap: "8px" }}>
        <input
          value={val}
          onChange={e => setVal(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSubmit()}
          placeholder="例：AI規制、気候変動、宇宙開発..."
          disabled={disabled}
          style={{
            flex: 1, background: "rgba(0,0,0,0.4)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "10px", padding: "9px 12px",
            color: "#fff", fontSize: "13px", outline: "none", fontFamily: "inherit"
          }}
        />
        <button onClick={handleSubmit} disabled={!val.trim() || disabled} style={{
          background: val.trim() && !disabled ? "#FF6B35" : "rgba(255,255,255,0.08)",
          border: "none", borderRadius: "10px", padding: "9px 16px",
          color: val.trim() && !disabled ? "#fff" : "#555",
          fontSize: "13px", cursor: val.trim() && !disabled ? "pointer" : "default",
          fontFamily: "inherit", transition: "all 0.2s", whiteSpace: "nowrap"
        }}>検索</button>
      </div>
    </div>
  );
}

function NewsCard({ news, isSelected, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: isSelected ? "rgba(255,107,53,0.12)" : "rgba(255,255,255,0.04)",
      border: `1px solid ${isSelected ? "#FF6B35" : "rgba(255,255,255,0.08)"}`,
      borderRadius: "14px", padding: "14px 16px", cursor: "pointer",
      transition: "all 0.2s ease", marginBottom: "10px",
      position: "relative", overflow: "hidden"
    }}>
      {isSelected && <div style={{
        position: "absolute", top: 0, left: 0, width: "3px", height: "100%",
        background: "linear-gradient(180deg, #FF6B35, #FF8C42)"
      }} />}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
        <p style={{ margin: 0, fontSize: "14px", lineHeight: "1.5", color: isSelected ? "#fff" : "#ccc", fontWeight: isSelected ? "500" : "400" }}>
          {news.title}
        </p>
        {isSelected && <span style={{ fontSize: "16px", flexShrink: 0 }}>✓</span>}
      </div>
      <span style={{
        display: "inline-block", marginTop: "8px", fontSize: "11px", color: "#FF6B35",
        background: "rgba(255,107,53,0.1)", padding: "2px 8px", borderRadius: "20px"
      }}>{news.category}</span>
    </div>
  );
}

function RecommendCard({ item, index }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div style={{
      background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: "16px", padding: "18px", marginBottom: "12px",
      animation: `fadeIn 0.4s ease ${index * 0.08}s both`
    }}>
      <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }`}</style>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <span style={{ fontSize: "18px" }}>{categoryEmoji[item.type] || "🎯"}</span>
            <span style={{ fontSize: "11px", color: "#FF6B35", background: "rgba(255,107,53,0.1)", padding: "2px 8px", borderRadius: "20px" }}>{item.type}</span>
            {item.year && <span style={{ fontSize: "11px", color: "#666" }}>{item.year}</span>}
          </div>
          <h3 style={{ margin: "4px 0 4px", fontSize: "16px", color: "#fff" }}>{item.title}</h3>
          {item.author && <p style={{ margin: 0, fontSize: "12px", color: "#888" }}>{item.author}</p>}
        </div>
        <div style={{
          background: "linear-gradient(135deg, #FF6B35, #FF8C42)",
          borderRadius: "8px", padding: "4px 8px", marginLeft: "12px", flexShrink: 0
        }}>
          <span style={{ fontSize: "13px", fontWeight: "700", color: "#fff" }}>{item.match}%</span>
        </div>
      </div>
      <p style={{
        margin: "12px 0 0", fontSize: "13px", color: "#aaa", lineHeight: "1.7",
        display: expanded ? "block" : "-webkit-box",
        WebkitLineClamp: expanded ? "none" : 3,
        WebkitBoxOrient: "vertical",
        overflow: expanded ? "visible" : "hidden"
      }}>{item.reason}</p>
      <button onClick={() => setExpanded(!expanded)} style={{
        background: "none", border: "none", color: "#FF6B35",
        fontSize: "12px", cursor: "pointer", padding: "6px 0 0", fontFamily: "inherit"
      }}>{expanded ? "折りたたむ ▲" : "もっと見る ▼"}</button>
      {item.connection && (
        <div style={{ marginTop: "10px", padding: "10px 12px", background: "rgba(255,107,53,0.06)", borderRadius: "10px", borderLeft: "2px solid #FF6B35" }}>
          <p style={{ margin: 0, fontSize: "12px", color: "#FF8C42", lineHeight: "1.6" }}>
            📰 <strong>トピックとの接点：</strong>{item.connection}
          </p>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [news, setNews] = useState([]);
  const [selectedNews, setSelectedNews] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingNews, setFetchingNews] = useState(false);
  const [filter, setFilter] = useState("すべて");
  const [view, setView] = useState("news");
  const [error, setError] = useState(null);

  useEffect(() => { fetchTopics(); }, []);

  async function fetchTopics() {
    setFetchingNews(true);
    setError(null);
    try {
      const res = await fetch("/api/topics");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setNews(data.topics);
    } catch (e) {
      setError("トピックの取得に失敗しました。再試行してください。");
    } finally {
      setFetchingNews(false);
    }
  }

  async function getRecommendations(newsItem) {
    setSelectedNews(newsItem);
    setLoading(true);
    setRecommendations([]);
    setView("recs");
    setError(null);
    setFilter("すべて");
    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newsItem.title, category: newsItem.category }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setRecommendations(data.recommendations);
    } catch (e) {
      setError("おすすめの取得に失敗しました。再試行してください。");
      setView("news");
    } finally {
      setLoading(false);
    }
  }

  const filtered = recommendations.filter(r => filter === "すべて" || r.type === filter);

  return (
    <>
      <Head>
        <title>NewsConnect - ニュースから物語を発見する</title>
        <meta name="description" content="今日のニュースに関連した映画・小説・ドラマをAIがおすすめします" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>

      <div style={{
        minHeight: "100vh", background: "#0A0A0A",
        fontFamily: "'Hiragino Sans', 'Noto Sans JP', sans-serif",
        maxWidth: "430px", margin: "0 auto"
      }}>
        <div style={{
          position: "fixed", top: "-80px", right: "-80px", width: "260px", height: "260px",
          background: "radial-gradient(circle, rgba(255,107,53,0.07) 0%, transparent 70%)",
          pointerEvents: "none"
        }} />

        {/* Header */}
        <div style={{
          padding: "52px 20px 14px",
          background: "rgba(10,10,10,0.95)", backdropFilter: "blur(12px)",
          position: "sticky", top: 0, zIndex: 100,
          borderBottom: "1px solid rgba(255,255,255,0.06)"
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <h1 style={{ margin: 0, fontSize: "21px", fontWeight: "700", color: "#fff", letterSpacing: "-0.5px" }}>
                📡 NewsConnect
              </h1>
              <p style={{ margin: "2px 0 0", fontSize: "11px", color: "#666" }}>ニュースから物語を発見する</p>
            </div>
            {view === "recs" && (
              <button onClick={() => setView("news")} style={{
                background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "20px", padding: "6px 14px",
                color: "#ccc", fontSize: "12px", cursor: "pointer", fontFamily: "inherit"
              }}>← トピック</button>
            )}
          </div>
          {view === "recs" && !loading && recommendations.length > 0 && (
            <div style={{ display: "flex", gap: "6px", marginTop: "12px", overflowX: "auto", paddingBottom: "2px" }}>
              {categories.map(cat => (
                <button key={cat} onClick={() => setFilter(cat)} style={{
                  background: filter === cat ? "#FF6B35" : "rgba(255,255,255,0.06)",
                  border: "none", borderRadius: "20px", padding: "5px 12px", fontSize: "12px",
                  color: filter === cat ? "#fff" : "#888",
                  cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit", transition: "all 0.2s"
                }}>{cat}</button>
              ))}
            </div>
          )}
        </div>

        {/* Body */}
        <div style={{ padding: "16px 20px 100px" }}>
          {error && (
            <div style={{
              background: "rgba(255,50,50,0.08)", border: "1px solid rgba(255,50,50,0.2)",
              borderRadius: "12px", padding: "12px 16px", marginBottom: "16px"
            }}>
              <p style={{ margin: "0 0 8px", fontSize: "13px", color: "#ff7070" }}>{error}</p>
              <button onClick={fetchTopics} style={{
                background: "none", border: "1px solid #ff7070", borderRadius: "8px",
                padding: "4px 12px", color: "#ff7070", fontSize: "12px", cursor: "pointer", fontFamily: "inherit"
              }}>再試行</button>
            </div>
          )}

          {view === "news" && (
            <>
              <ManualInput onSubmit={(title) => getRecommendations({ id: 999, title, category: "カスタム" })} disabled={loading} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <h2 style={{ margin: 0, fontSize: "12px", color: "#666", fontWeight: "400" }}>
                  {fetchingNews ? "AIがトピックを生成中..." : `話題のトピック ${news.length}件`}
                </h2>
                <button onClick={fetchTopics} disabled={fetchingNews} style={{
                  background: "none", border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "20px", padding: "4px 12px",
                  color: "#777", fontSize: "11px", cursor: "pointer", fontFamily: "inherit"
                }}>🔄 更新</button>
              </div>
              {fetchingNews ? <Spinner label="AIがトピックを生成中..." /> : (
                news.map(n => (
                  <NewsCard key={n.id} news={n} isSelected={selectedNews?.id === n.id} onClick={() => getRecommendations(n)} />
                ))
              )}
            </>
          )}

          {view === "recs" && (
            <>
              {selectedNews && (
                <div style={{
                  background: "rgba(255,107,53,0.08)", border: "1px solid rgba(255,107,53,0.2)",
                  borderRadius: "14px", padding: "12px 14px", marginBottom: "16px"
                }}>
                  <p style={{ margin: "0 0 4px", fontSize: "11px", color: "#FF6B35" }}>選択中のトピック</p>
                  <p style={{ margin: 0, fontSize: "14px", color: "#fff", lineHeight: "1.4" }}>{selectedNews.title}</p>
                </div>
              )}
              {loading ? <Spinner /> : (
                filtered.length > 0 ? (
                  <>
                    <p style={{ fontSize: "12px", color: "#666", marginBottom: "12px" }}>{filtered.length}件の作品が見つかりました</p>
                    {filtered.map((item, i) => <RecommendCard key={i} item={item} index={i} />)}
                  </>
                ) : (
                  <div style={{ textAlign: "center", padding: "60px 20px", color: "#555" }}>
                    <p style={{ fontSize: "13px" }}>該当する作品がありません</p>
                  </div>
                )
              )}
            </>
          )}
        </div>

        {view === "news" && !fetchingNews && news.length > 0 && (
          <div style={{
            position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
            width: "100%", maxWidth: "430px",
            background: "linear-gradient(0deg, #0A0A0A 50%, transparent)",
            padding: "30px 20px 24px", textAlign: "center", pointerEvents: "none"
          }}>
            <p style={{ margin: 0, fontSize: "11px", color: "#555" }}>トピックをタップして作品を探す ↑</p>
          </div>
        )}
      </div>
    </>
  );
}
