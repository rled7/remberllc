# Bug Log

A running record of notable bugs, their root cause, and the fix.

---

## 2026-06-01 — Home page nav-cards overlap vertically

**Commit:** `4538a9b` &nbsp;|&nbsp; **File:** `src/index.css` (`.nav-card`) &nbsp;|&nbsp; **Severity:** visual / layout

### Symptom
On the home page (`Hub`), scrolling down to the **"Explore — One operation, two
crafts"** section, the three nav-cards (Trucking / Software / Contact) rendered
**on top of one another**: the white card boxes fragmented and overlapped, with
the title/description text appearing *between* the broken boxes ("buttons one on
top of another with the words in between"). Most obvious at viewport widths
**≤ 880px**, where the cards stack into a single column — but the underlying
broken box model was present at every width.

### Root cause
`.nav-card` is rendered as an `<a>` (React Router `<Link>`). Its CSS set
`position`, `background`, `border`, `padding`, etc. — but **never set a
`display` value**, so it defaulted to `display: inline`. The anchor contains
**block-level** children (`<div class="nav-card-title">`, `<div
class="nav-card-desc">`).

An inline element cannot properly contain block-level descendants: the browser
splits the inline box into fragments, so the background/border paint only around
the inline pieces and the block children escape the card's box — causing
adjacent cards to collide and overlap.

The sibling component `.proj-card` was correct (`display: flex; flex-direction:
column;`); `.nav-card` was simply missing it. The scroll-reveal animation
(`transform: translateY(26px)`, larger than the `18px` grid gap) made the
overlap more obvious during scroll, but it was a symptom, not the cause.

#### Offending code

`src/index.css` — note: **no `display`**:
```css
.nav-card {
  position: relative;          /* <-- inline <a>, no display set */
  background: var(--bg-surface);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 30px 28px 26px;
  text-decoration: none;
  color: var(--ink);
  overflow: hidden;
  transition: transform var(--t), box-shadow var(--t), border-color var(--t);
}
```

`src/pages/Hub.tsx` — an inline `<a>` wrapping block `<div>`s:
```tsx
<Link to={c.to} className="nav-card">
  <span className="num">{c.num}</span>
  <div className="nav-card-title">{c.title}</div>   {/* block child */}
  <div className="nav-card-desc">{c.desc}</div>      {/* block child */}
  <span className="go">Enter <span aria-hidden="true">&rarr;</span></span>
</Link>
```

### Fix
Make `.nav-card` a proper block container (matching `.proj-card`) by adding two
lines:

```css
.nav-card {
  display: flex;            /* <-- added */
  flex-direction: column;  /* <-- added */
  position: relative;
  background: var(--bg-surface);
  /* ...unchanged... */
}
```

With `display: flex`, the anchor establishes a real block box that fully
contains its children, so the card background wraps all content and cards no
longer overlap.

### How it was diagnosed
- Static headless screenshots were misleading: Chrome floors the window at
  **500px** wide (a 390px shot is a *crop* of a 500px render), and the
  scroll-reveal animation keeps below-fold content at `opacity:0` until scrolled
  into view (never happens in a static shot). Both produced false "overflow"
  readings early on.
- Reliable method: run the dev server, temporarily force `.reveal { opacity:1 }`
  and collapse `.hero { min-height:auto }`, then screenshot the stacked
  (≤880px) layout — which exposed the fragmented/overlapping card boxes.
- Verified the fix at 760px (clean stacked cards), confirmed `npm run build`
  passes, and confirmed the live Cloudflare bundle (`index-BkUKZOMy.css`)
  contained `display:flex`.

### Prevention
Any element styled as a "card" (background + border + padding) that wraps
block-level children must declare `display: flex`/`block`/`grid` — never rely on
the default `inline` for `<a>`/`<span>` containers.
