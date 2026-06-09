import { useState } from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';

interface Project {
  title: string;
  description: string;
  badge: { label: string; cls: string; live?: boolean };
  tags: string[];
  links: { label: string; href: string; internal?: boolean; accent?: boolean }[];
}

const PROJECTS: Project[] = [
  {
    title: 'Sybil Detection Engine',
    description:
      'Explainable sybil-wallet scoring for airdrop QA. Eight transparent signals (wallet age, transaction count, shared funder, batch-funding timing, behavioral repetition, gas similarity, inter-wallet transfers, CEX funding) produce a risk band per wallet, then union-find clustering surfaces coordinated farms. Keyless and deterministic — every score shows its work.',
    badge: { label: 'Live demo', cls: 'badge-live', live: true },
    tags: ['TypeScript', 'Graph clustering', 'React', 'Cloudflare'],
    links: [
      { label: 'Open live demo', href: '/projects/sybil', internal: true, accent: true },
      { label: 'GitHub', href: 'https://github.com/rled7/sybil-detection-engine' },
    ],
  },
  {
    title: 'Bridge Cost Optimizer',
    description:
      'Cross-chain bridge route ranking tool. Decomposes the true cost into three layers (source gas, destination gas, protocol fee) and ranks routes by net capital preserved. Flags unreasonable fees as a QA signal.',
    badge: { label: 'Live demo', cls: 'badge-live', live: true },
    tags: ['TypeScript', 'Express', 'LI.FI', 'React', 'Cloudflare'],
    links: [
      { label: 'Open live demo', href: '/projects/bridge', internal: true, accent: true },
      { label: 'GitHub', href: 'https://github.com/rled7/bridge-cost-optimizer' },
    ],
  },
  {
    title: 'RAG Alpha Aggregator',
    description:
      'Keyless local RAG classifier that surfaces airdrop opportunities from noisy feeds — bag-of-words cosine retrieval + keyword rules rank signals by confidence and return steps to qualify. No API key required.',
    badge: { label: 'Live demo', cls: 'badge-live', live: true },
    tags: ['RAG', 'TypeScript', 'NLP', 'React', 'Cloudflare'],
    links: [
      { label: 'Open live demo', href: '/projects/rag', internal: true, accent: true },
      { label: 'GitHub', href: 'https://github.com/rled7/rag-alpha-aggregator' },
    ],
  },
  {
    title: 'NexusScale — Image & PDF Upscaler',
    description:
      'A 100% in-browser image and PDF upscaler. Pick a multiplier or a 4K/8K resolution target; it enhances on-device with bicubic resampling + denoise/contrast/sharpen, run off the main thread in a Web Worker so the UI never freezes. Zero network calls, no API keys, nothing uploaded — 8K output and the offline claim are verified by a real-browser smoke test.',
    badge: { label: 'Live demo', cls: 'badge-live', live: true },
    tags: ['React', 'Canvas', 'Web Workers', 'pdf.js', 'Offline'],
    links: [
      { label: 'Open live demo', href: '/projects/nexus', internal: true, accent: true },
      { label: 'GitHub', href: 'https://github.com/rled7/nexus-scale' },
    ],
  },
];

function Avatar() {
  const [failed, setFailed] = useState(false);
  // Drop a real photo at public/profile.jpg to replace the monogram.
  if (failed) {
    return <div className="avatar avatar--fallback" aria-label="Rene Ledesma">RL</div>;
  }
  return (
    <img
      className="avatar"
      src="/profile.jpg"
      alt="Rene Ledesma"
      onError={() => setFailed(true)}
    />
  );
}

export default function Portfolio() {
  return (
    <section className="section">
      <div className="shell">
        <Reveal className="devzone">
          {/* ---- Intro + profile ---- */}
          <div className="dev-head">
            <div className="dev-intro">
              <span className="eyebrow">Software</span>
              <h2 className="dev-title">Engineering, with the same hands-on accountability.</h2>
              <p className="lead">
                Full-stack work by Rene Ledesma — React, TypeScript &amp; Node. Built with real
                data, in production or active development. A few are running live below.
              </p>
            </div>

            <div className="dev-profile">
              <Avatar />
              <div className="dev-profile-name">Rene Ledesma</div>
              <div className="dev-profile-role">Full-stack engineer · React / TS / Node</div>
              <div className="dev-profile-links">
                {/* TODO: drop the PDF at public/resume.pdf */}
                <a
                  className="proj-link proj-link--accent"
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Résumé <span aria-hidden="true">↗</span>
                </a>
                <a
                  className="proj-link"
                  href="https://www.linkedin.com/in/rene-ledesma"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn <span aria-hidden="true">↗</span>
                </a>
                <a
                  className="proj-link"
                  href="https://github.com/rled7"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
          </div>

          {/* ---- Projects ---- */}
          <div className="proj-grid">
            {PROJECTS.map((p, i) => (
              <Reveal key={p.title} delay={i * 90}>
                <div className="proj-card">
                  <div className="proj-card-head">
                    <span className="proj-card-title">{p.title}</span>
                    <span className={`badge ${p.badge.cls}`}>
                      {p.badge.live && <span className="pulse" aria-hidden="true" />}
                      {p.badge.label}
                    </span>
                  </div>
                  <p className="proj-card-desc">{p.description}</p>
                  <div className="tag-row">
                    {p.tags.map((t) => (
                      <span className="tag" key={t}>{t}</span>
                    ))}
                  </div>
                  <div className="proj-links">
                    {p.links.map((l) =>
                      l.internal ? (
                        <Link
                          key={l.label}
                          to={l.href}
                          className={`proj-link ${l.accent ? 'proj-link--accent' : ''}`}
                        >
                          {l.label} <span aria-hidden="true">→</span>
                        </Link>
                      ) : (
                        <a
                          key={l.label}
                          href={l.href}
                          className={`proj-link ${l.accent ? 'proj-link--accent' : ''}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {l.label} <span aria-hidden="true">↗</span>
                        </a>
                      )
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <p className="devzone-foot">
            More projects on{' '}
            <a href="https://github.com/rled7" target="_blank" rel="noopener noreferrer">
              github.com/rled7
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
