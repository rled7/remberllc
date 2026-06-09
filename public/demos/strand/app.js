// Strand demo UI — wires the pure core to a zero-build page.
import { parseTranscript, segment, savings, rankStrands, vectorizeMessages, LiveSegmenter, StrandStore } from "./core/index.js";
import { SAMPLE } from "./sample.js";

// A few past "conversations" for the cross-conversation memory demo — each drifts
// across its own mix of topics, the way real chats do.
const MEMORY_SAMPLES = {
  "mon-worklog": [
    "let's lock down the gemini agent, it tried writing into the trading bot repo",
    "the remberllc website about page needs to ship to cloudflare pages today",
    "back to the trading bot — the OANDA broker adapter needs a C++ parity test",
    "the cloudflare wrangler build keeps failing on the dist folder path",
  ],
  "tue-worklog": [
    "the image upscaler should support 8K resolution targets with bicubic interpolation",
    "profile the bicubic convolution, it is far too slow on large images",
    "the trading bot IBKR broker adapter parity test now passes all checks",
  ],
  "weekend-notes": [
    "my sourdough bread recipe should proof the dough overnight inside the fridge",
    "the Alpaca broker adapter for the trading bot still wants a parity test written",
    "sourdough proofing works best when the dough doubles before a hot oven bake",
  ],
};

const $ = (id) => document.getElementById(id);
const COLORS = ["#7c9cff", "#5fd0a8", "#f2b65a", "#e87fbf", "#9b8cff", "#65c7e8", "#e8755f"];

let state = { messages: [], strands: [], order: [], idfMap: null, active: null };

function organize() {
  const messages = parseTranscript($("input").value);
  if (!messages.length) { $("status").textContent = "Nothing to organize — paste a conversation or load the sample."; return; }
  const { strands, order } = segment(messages);
  const { idfMap } = vectorizeMessages(messages);
  state = { messages, strands, order, idfMap, active: null };
  render();
  $("status").textContent = `${messages.length} messages fanned into ${strands.length} strands.`;
}

function render() {
  const { messages, strands, order, active } = state;

  // Savings panel.
  const s = savings(messages, strands);
  const sv = $("savings");
  sv.style.display = "block";
  sv.innerHTML = `<div class="big">${s.reductionPct}% fewer tokens</div>
    <div class="lbl">Answering inside one strand averages ${s.avgStrand} tokens vs ${s.full} for the whole thread.</div>`;

  // Strand list (click to focus).
  $("strands").innerHTML = strands.map(st => {
    const c = COLORS[st.id % COLORS.length];
    const on = active === st.id ? " active" : "";
    return `<div class="strand${on}" data-id="${st.id}">
      <div class="name"><span class="dot" style="background:${c}"></span>${st.label.join(" · ") || "untitled"}</div>
      <div class="meta">${st.messageIndices.length} messages</div></div>`;
  }).join("");
  $("strands").querySelectorAll(".strand").forEach(el =>
    el.onclick = () => { state.active = state.active === +el.dataset.id ? null : +el.dataset.id; render(); });

  // Messages (dim those outside the focused strand).
  $("messages").innerHTML = messages.map((m, i) => {
    const sid = order[i], c = COLORS[sid % COLORS.length];
    const dim = active !== null && active !== sid ? " dim" : "";
    return `<div class="msg${dim}" style="border-left-color:${c}">
      <div class="role">${m.role} · strand: ${strands[sid].label.join(",") || sid}</div>${escapeHtml(m.text)}</div>`;
  }).join("");
}

function ask() {
  const q = $("q").value.trim();
  if (!q || !state.strands.length) return;
  const ranked = rankStrands(q, state.strands, state.idfMap);
  const top = ranked[0];
  if (!top || top.score === 0) { $("status").textContent = `No strand matches "${q}".`; return; }
  state.active = top.id;
  render();
  $("status").textContent = `"${q}" → strand [${state.strands[top.id].label.join(", ")}] (score ${top.score.toFixed(2)}). Only that strand would be sent to the model.`;
}

function escapeHtml(s) { return s.replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c])); }

$("sample").onclick = () => { $("input").value = SAMPLE; organize(); };
$("organize").onclick = organize;
$("ask").onclick = ask;
$("q").addEventListener("keydown", e => { if (e.key === "Enter") ask(); });

// ── Live mode: route each message as it's sent ──────────────────────────────────
let live = null;

function syncFromLive() {
  const order = new Array(live.messages.length).fill(0);
  for (const s of live.strands) for (const i of s.messageIndices) order[i] = s.id;
  const { idfMap } = vectorizeMessages(live.messages);
  state = { messages: live.messages.slice(), strands: live.strands, order, idfMap, active: null };
  render();
}

function liveSend() {
  const text = $("liveInput").value.trim();
  if (!text) return;
  if (!live) live = new LiveSegmenter();
  const d = live.add({ role: "user", text });
  $("liveInput").value = "";
  syncFromLive();
  $("status").textContent = d.isNew
    ? `🟢 NEW context detected → opened strand [${d.label.join(", ")}].`
    : `→ routed to strand [${d.label.join(", ")}] (score ${d.score.toFixed(2)}).`;
}

$("liveToggle").onclick = () => {
  const row = $("liveRow");
  const showing = row.style.display !== "none";
  row.style.display = showing ? "none" : "flex";
  $("liveToggle").textContent = showing ? "▶ Live mode" : "■ Live mode on";
  if (!showing && !live) { live = new LiveSegmenter(); $("status").textContent = "Live mode: send a message to watch it get routed."; }
};
$("liveSend").onclick = liveSend;
$("liveReset").onclick = () => { live = new LiveSegmenter(); state = { messages: [], strands: [], order: [], idfMap: null, active: null }; $("messages").innerHTML = ""; $("strands").innerHTML = ""; $("savings").style.display = "none"; $("status").textContent = "Live mode reset."; };
$("liveInput").addEventListener("keydown", e => { if (e.key === "Enter") liveSend(); });

// ── Memory mode: search across MANY past conversations at once ──────────────────
let memStore = null;

function buildMemory() {
  memStore = new StrandStore();
  for (const [id, msgs] of Object.entries(MEMORY_SAMPLES))
    memStore.addConversation(id, msgs.map(text => ({ role: "user", text })), id);
  const { conversations, strands } = memStore.stats();
  $("status").textContent = `Memory: ${conversations} past conversations (${strands} strands) loaded — search across all of them.`;
}

function memSearch() {
  const q = $("memInput").value.trim();
  if (!q) return;
  if (!memStore) buildMemory();
  const results = memStore.search(q, { limit: 8 });
  $("strands").innerHTML = "";
  $("savings").style.display = "none";
  const n = memStore.stats().conversations;
  if (!results.length) {
    $("messages").innerHTML = `<div class="hint">No strand in any of your ${n} conversations matches "${escapeHtml(q)}".</div>`;
    return;
  }
  $("messages").innerHTML = `<div class="hint">Top strands for "${escapeHtml(q)}" across all ${n} conversations — each tagged with the chat it came from:</div>` +
    results.map(r => `<div class="msg" style="border-left-color:${COLORS[0]}">
      <div class="role">${escapeHtml(r.convId)} · score ${r.score.toFixed(2)}</div>
      <strong>${escapeHtml(r.label.join(" · ")) || "untitled"}</strong><br>${escapeHtml(r.snippet)}</div>`).join("");
  $("status").textContent = `"${q}" searched across every conversation — ranked by relevance, source chat shown.`;
}

$("memToggle").onclick = () => {
  const row = $("memRow");
  const showing = row.style.display !== "none";
  row.style.display = showing ? "none" : "flex";
  $("memToggle").textContent = showing ? "▶ Memory" : "■ Memory on";
  if (!showing) buildMemory();
};
$("memSearch").onclick = memSearch;
$("memInput").addEventListener("keydown", e => { if (e.key === "Enter") memSearch(); });
