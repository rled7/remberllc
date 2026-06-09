// Parse a pasted transcript into messages [{ role, text }]. Supports two shapes:
//  1) Speaker-prefixed lines:  "User: ..."  /  "Assistant: ..."  (continuation lines
//     without a prefix append to the current message).
//  2) Plain lines: each non-empty line becomes its own message.
const PREFIX = /^([A-Za-z][\w .-]{0,24}):\s*(.*)$/;

export function parseTranscript(text) {
  const lines = String(text).replace(/\r/g, "").split("\n");
  const hasPrefixes = lines.some(l => PREFIX.test(l.trim()));
  const messages = [];

  if (!hasPrefixes) {
    for (const l of lines) { const t = l.trim(); if (t) messages.push({ role: "msg", text: t }); }
    return messages;
  }

  let cur = null;
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    const m = line.match(PREFIX);
    if (m) { cur = { role: m[1].trim(), text: m[2].trim() }; messages.push(cur); }
    else if (cur) { cur.text += " " + line; }
    else { cur = { role: "msg", text: line }; messages.push(cur); }
  }
  return messages;
}
