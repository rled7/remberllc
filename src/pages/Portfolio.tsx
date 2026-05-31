import { Link } from 'react-router-dom';

interface Project {
  title: string;
  description: string;
  badge: { label: string; cls: string };
  links: { label: string; href: string; internal?: boolean }[];
}

const PROJECTS: Project[] = [
  {
    title: 'Bridge Cost Optimizer',
    description:
      'Cross-chain bridge route ranking tool. Decomposes the true cost into 3 layers (source gas, destination gas, protocol fee) and ranks routes by net capital preserved. Flags unreasonable fees as a QA signal. Live demo backed by a Cloudflare Pages Function.',
    badge: { label: 'Live demo', cls: 'badge-live' },
    links: [
      { label: 'Live demo', href: '/projects/bridge', internal: true },
      {
        label: 'GitHub',
        href: 'https://github.com/rled7',
      },
    ],
  },
  {
    title: 'RAG Alpha Aggregator',
    description:
      'Retrieval-augmented generation pipeline that aggregates and surfaces alpha signals from multiple data sources. Demonstrates applied RAG architecture for production research workflows.',
    badge: { label: 'Active', cls: 'badge-active' },
    links: [
      {
        label: 'GitHub',
        href: 'https://github.com/rled7/rag-alpha-aggregator',
      },
    ],
  },
];

export default function Portfolio() {
  return (
    <div className="page">
      <div className="section-header">
        <h2 className="section-title">Software Portfolio</h2>
        <p className="section-sub">
          Rene Ledesma — full-stack engineer (React / TypeScript / Node). Projects built
          with real data, in production or active development.
        </p>
      </div>

      <div className="project-grid">
        {PROJECTS.map((p) => (
          <div key={p.title} className="project-card">
            <div className="project-card-header">
              <span className="project-card-title">{p.title}</span>
              <span className={`project-badge ${p.badge.cls}`}>{p.badge.label}</span>
            </div>
            <p className="project-card-desc">{p.description}</p>
            {p.links.length > 0 && (
              <div className="project-card-links">
                {p.links.map((l) =>
                  l.internal ? (
                    <Link key={l.label} to={l.href} className="project-link">
                      {l.label}
                    </Link>
                  ) : (
                    <a
                      key={l.label}
                      href={l.href}
                      className="project-link"
                      target={l.href.startsWith('http') ? '_blank' : undefined}
                      rel={l.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    >
                      {l.label}
                    </a>
                  )
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <p style={{ marginTop: 24, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        More projects on{' '}
        <a
          href="https://github.com/rled7"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--accent)' }}
        >
          github.com/rled7
        </a>
      </p>
    </div>
  );
}
