import { useNavigate } from 'react-router-dom'

const FEATURES = [
  {
    icon: '🧠',
    title: 'AI Workflow Compiler',
    description: 'Gemini Pro dissects messy natural language into triggers, conditions, and actions with surgical precision.',
    color: '#7c3aed',
  },
  {
    icon: '🔀',
    title: 'Dynamic Flow Graph',
    description: 'Every parsed workflow is instantly rendered as an interactive, node-based pipeline using React Flow.',
    color: '#06b6d4',
  },
  {
    icon: '🛡️',
    title: 'Human-in-the-Loop',
    description: 'Critical actions pause for human approval before execution — compliance and trust built into the core.',
    color: '#10b981',
  },
  {
    icon: '📊',
    title: 'Live ROI Analytics',
    description: 'Every workflow is evaluated for time savings, cost reduction, and automation confidence scores.',
    color: '#f59e0b',
  },
  {
    icon: '💾',
    title: 'Agent Library',
    description: 'All parsed workflows persist to MongoDB, building your organization\'s private automation library.',
    color: '#f43f5e',
  },
  {
    icon: '⚡',
    title: 'Simulation Mode',
    description: 'Step through every node with real-time visual feedback before deploying to production.',
    color: '#a78bfa',
  },
]

const FLOW_STEPS = [
  { label: 'Messy Human Narrative',    icon: '📝', color: '#94a3b8' },
  { label: 'Gemini AI Compiler',       icon: '🧠', color: '#7c3aed' },
  { label: 'React Flow Graph',         icon: '🔀', color: '#06b6d4' },
  { label: 'Human-in-the-Loop Agent',  icon: '🛡️', color: '#10b981' },
]

const STATS = [
  { value: '85%',    label: 'Avg Time Saved',      icon: '⏱' },
  { value: '$47k+',  label: 'Annual Cost Savings',  icon: '💰' },
  { value: '< 30s',  label: 'Parse Speed',          icon: '⚡' },
  { value: '99.9%',  label: 'Schema Accuracy',      icon: '🎯' },
]

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="gradient-bg-hero" style={{ minHeight: '100vh', overflowX: 'hidden' }}>
      {/* ── NAV ── */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 48px',
        borderBottom: '1px solid var(--color-border)',
        backdropFilter: 'blur(12px)',
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(8,11,20,0.85)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '8px',
            background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '16px',
          }}>🤖</div>
          <span style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700, fontSize: '18px',
            background: 'linear-gradient(135deg, #a78bfa, #06b6d4)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            Shadow
          </span>
          <span style={{
            fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em',
            color: 'var(--color-text-muted)', textTransform: 'uppercase',
            paddingLeft: '8px', borderLeft: '1px solid var(--color-border)',
          }}>
            AI Ops Engine
          </span>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <a href="#features" style={{ color: 'var(--color-text-muted)', fontSize: '14px', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={e => e.target.style.color = '#a78bfa'}
            onMouseLeave={e => e.target.style.color = 'var(--color-text-muted)'}>
            Features
          </a>
          <a href="#how-it-works" style={{ color: 'var(--color-text-muted)', fontSize: '14px', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={e => e.target.style.color = '#a78bfa'}
            onMouseLeave={e => e.target.style.color = 'var(--color-text-muted)'}>
            How It Works
          </a>
          <button className="btn-primary" onClick={() => navigate('/dashboard')} style={{ padding: '9px 20px', fontSize: '13px' }}>
            Launch App →
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ padding: '100px 48px 80px', textAlign: 'center', position: 'relative' }}>
        {/* Glow blobs */}
        <div className="hero-glow" style={{
          background: 'rgba(124,58,237,0.25)', top: '-100px', left: '10%',
        }} />
        <div className="hero-glow" style={{
          background: 'rgba(6,182,212,0.15)', top: '0px', right: '10%',
          width: '400px', height: '400px',
        }} />

        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '6px 16px',
          background: 'rgba(124,58,237,0.12)',
          border: '1px solid rgba(124,58,237,0.3)',
          borderRadius: '20px',
          marginBottom: '28px',
          fontSize: '12px', fontWeight: 600, color: '#a78bfa',
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block', animation: 'pulse-green 2s infinite' }} />
          Powered by Gemini Pro · LangChain · React Flow
        </div>

        {/* Headline */}
        <h1 style={{
          fontSize: 'clamp(40px, 6vw, 72px)',
          fontWeight: 900,
          lineHeight: 1.1,
          marginBottom: '24px',
          maxWidth: '900px',
          margin: '0 auto 24px',
          fontFamily: "'Space Grotesk', sans-serif",
        }}>
          Turn{' '}
          <span className="gradient-text">Messy Human Workflows</span>
          <br />into Production-Ready{' '}
          <span style={{ color: '#10b981' }}>AI Agents</span>
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: '18px', color: 'var(--color-text-secondary)',
          maxWidth: '620px', margin: '0 auto 40px',
          lineHeight: 1.7,
        }}>
          Shadow parses your natural language process descriptions and instantly synthesizes
          visual, human-in-the-loop automated pipelines with measurable ROI analytics.
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            className="btn-primary"
            onClick={() => navigate('/dashboard')}
            style={{ padding: '16px 36px', fontSize: '16px', borderRadius: '14px' }}
          >
            ⚡ Start Automating Free
          </button>
          <a href="#how-it-works" style={{ textDecoration: 'none' }}>
            <button className="btn-secondary" style={{ padding: '16px 28px', fontSize: '15px', borderRadius: '14px' }}>
              See How It Works →
            </button>
          </a>
        </div>

        {/* Flow steps diagram */}
        <div id="how-it-works" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '0', marginTop: '72px', flexWrap: 'wrap',
        }}>
          {FLOW_STEPS.map((step, i) => (
            <div key={step.label} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
                padding: '20px 24px',
                background: 'rgba(255,255,255,0.03)',
                border: `1px solid ${step.color}33`,
                borderRadius: '16px',
                minWidth: '150px',
                transition: 'all 0.3s ease',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = `${step.color}80`
                  e.currentTarget.style.background = `${step.color}10`
                  e.currentTarget.style.transform = 'translateY(-4px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = `${step.color}33`
                  e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <div style={{ fontSize: '28px' }}>{step.icon}</div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: step.color, textAlign: 'center', lineHeight: 1.4 }}>
                  {step.label}
                </div>
              </div>
              {i < FLOW_STEPS.length - 1 && (
                <div style={{
                  color: 'var(--color-text-muted)', fontSize: '20px',
                  padding: '0 8px', opacity: 0.5,
                }}>➔</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{
        padding: '40px 48px',
        borderTop: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)',
        background: 'rgba(255,255,255,0.01)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '48px', flexWrap: 'wrap' }}>
          {STATS.map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '12px', marginBottom: '4px' }}>{s.icon}</div>
              <div style={{
                fontSize: '32px', fontWeight: 900,
                fontFamily: "'Space Grotesk', sans-serif",
                background: 'linear-gradient(135deg, #a78bfa, #06b6d4)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>
                {s.value}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ padding: '80px 48px' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800,
            fontFamily: "'Space Grotesk', sans-serif", marginBottom: '16px',
          }}>
            Enterprise-Grade{' '}
            <span className="gradient-text">Automation Intelligence</span>
          </h2>
          <p style={{ fontSize: '16px', color: 'var(--color-text-secondary)', maxWidth: '500px', margin: '0 auto' }}>
            Built for ops teams that need to scale without scaling headcount
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
          maxWidth: '1100px',
          margin: '0 auto',
        }}>
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className="glass-card glass-card-hover"
              style={{
                padding: '28px',
                animation: `fadeInUp 0.5s ease ${i * 0.08}s forwards`,
                opacity: 0,
              }}
            >
              <div style={{
                width: '48px', height: '48px', borderRadius: '12px',
                background: `${f.color}18`,
                border: `1px solid ${f.color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '22px', marginBottom: '16px',
              }}>
                {f.icon}
              </div>
              <h3 style={{
                fontSize: '16px', fontWeight: 700, marginBottom: '8px',
                fontFamily: "'Space Grotesk', sans-serif", color: 'var(--color-text-primary)',
              }}>
                {f.title}
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA FOOTER ── */}
      <section style={{
        padding: '80px 48px',
        textAlign: 'center',
        borderTop: '1px solid var(--color-border)',
        background: 'radial-gradient(ellipse at center, rgba(124,58,237,0.1) 0%, transparent 70%)',
      }}>
        <h2 style={{
          fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 900,
          fontFamily: "'Space Grotesk', sans-serif", marginBottom: '20px',
        }}>
          Ready to Automate Your Ops?
        </h2>
        <p style={{ fontSize: '16px', color: 'var(--color-text-secondary)', marginBottom: '36px' }}>
          One workflow description. Instant AI pipeline. Zero code required.
        </p>
        <button
          className="btn-primary"
          onClick={() => navigate('/dashboard')}
          style={{ padding: '18px 48px', fontSize: '17px', borderRadius: '16px' }}
        >
          🚀 Build Your First Agent
        </button>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '24px 48px',
        borderTop: '1px solid var(--color-border)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        fontSize: '12px', color: 'var(--color-text-muted)',
      }}>
        <span>Shadow AI Ops Engine · Built with Gemini + LangChain + React Flow</span>
        <span>© 2025 Shadow</span>
      </footer>
    </div>
  )
}
