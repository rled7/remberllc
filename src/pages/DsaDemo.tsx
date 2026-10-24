import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';

export default function DsaDemo() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <section className="section novo-case-study">
      <div className="shell">
        <Reveal>
          <Link to="/portfolio" className="devzone-back">← Portfolio</Link>
          <span className="eyebrow">Developer tools / Learning</span>
          <h1 className="dev-title">DSA Study Buddy</h1>
          <p className="lead">A focused workspace for learning algorithms by pattern. Write a solution, run the test cases, and compare approaches without leaving your browser.</p>
          <div className="novo-case-actions">
            <a className="dbtn dbtn--primary" href="/demos/dsa/">Open study workspace →</a>
            <a className="dbtn" href="/demos/dsa/#/problem/hash-two-sum">Try a coding problem →</a>
          </div>
        </Reveal>
        <div className="novo-capabilities">
          <Reveal><span className="eyebrow">01 / Practice</span><h2>Learn the patterns.</h2><p>Explore algorithm families, solve JavaScript problems, and compare reference implementations with time and space complexity.</p></Reveal>
          <Reveal delay={70}><span className="eyebrow">02 / Feedback</span><h2>Run real test cases.</h2><p>A disposable Web Worker runs your code with a time limit, keeping the interface responsive. Passing solutions and progress stay on your device.</p></Reveal>
          <Reveal delay={140}><span className="eyebrow">03 / Reference</span><h2>Build understanding.</h2><p>Browse system design concepts and language references. The full local edition also includes an Ollama assistant, note retrieval, C execution, and GitHub export.</p></Reveal>
        </div>
        <p className="novo-case-footnote">The public demo includes JavaScript practice and downloadable solutions. AI assistance and C compilation run in the local edition.</p>
      </div>
    </section>
  );
}
