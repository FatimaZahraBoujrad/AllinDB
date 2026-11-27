import { useEffect, useState } from 'react'
import { ConnectionPanel } from './features/connections/ConnectionPanel'
import './App.css'

type ApiHealth = {
  status: 'ok'
  service: 'allindb-api'
}

function App() {
  const [apiOnline, setApiOnline] = useState<boolean | null>(null)
  const [databaseConnected, setDatabaseConnected] = useState(false)

  useEffect(() => {
    let isMounted = true

    fetch('/health')
      .then((response) => {
        if (!response.ok) throw new Error('API health check failed')
        return response.json() as Promise<ApiHealth>
      })
      .then((health) => {
        if (isMounted) setApiOnline(health.status === 'ok')
      })
      .catch(() => {
        if (isMounted) setApiOnline(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="workspace">
      <aside className="sidebar">
        <a className="brand" href="/" aria-label="AllinDB home">
          <span className="brand-mark">A</span>
          <span>AllinDB</span>
        </a>
        <div className="workspace-label">WORKSPACE</div>
        <nav aria-label="Main navigation">
          <a className="nav-item active" href="#overview"><span>▦</span> Overview</a>
          <a className="nav-item disabled" href="#explorer" aria-disabled="true"><span>◫</span> Explorer</a>
          <a className="nav-item disabled" href="#query" aria-disabled="true"><span>⌘</span> SQL workspace</a>
          <a className="nav-item disabled" href="#assistant" aria-disabled="true"><span>✳</span> AI assistant</a>
          <a className="nav-item disabled" href="#monitoring" aria-disabled="true"><span>⌁</span> Monitoring</a>
        </nav>
        <div className="sidebar-bottom">
          <div className="connection-card">
            <span className={`connection-dot ${databaseConnected ? 'active' : ''}`} />
            <div><strong>{databaseConnected ? 'Database connected' : 'No database'}</strong><small>{databaseConnected ? 'Session active' : 'Connect to get started'}</small></div>
          </div>
          <div className="user-chip"><span className="avatar">D</span><span>Developer workspace</span><span className="more">···</span></div>
        </div>
      </aside>

      <main className="main-panel" id="overview">
        <header className="topbar">
          <div className="breadcrumbs">Workspace <span>/</span> Overview</div>
          <div className="topbar-right">
            <span className={`api-badge ${apiOnline ? 'online' : apiOnline === false ? 'offline' : ''}`}>
              <i /> {apiOnline ? 'API connected' : apiOnline === false ? 'API offline' : 'Checking API'}
            </span>
            <button className="icon-button" type="button" aria-label="Help">?</button>
          </div>
        </header>

        <div className="content">
          <div className="eyebrow"><span className="eyebrow-line" /> YOUR DATABASE WORKSPACE</div>
          <h1>Good work starts<br />with <em>understanding</em> your data.</h1>
          <p className="intro">Explore PostgreSQL, work with SQL, and get thoughtful AI assistance — all in one focused workspace.</p>

          <section className="onboarding-card" aria-labelledby="getting-started-title">
            <div className="card-icon database-icon">⌘</div>
            <div className="onboarding-copy">
              <div className="card-kicker">GETTING STARTED</div>
              <h2 id="getting-started-title">Connect your PostgreSQL database</h2>
              <p>Test a connection and open a temporary session. Schema exploration is next.</p>
            </div>
            <span className="milestone-pill">MILESTONE 2</span>
          </section>

          <ConnectionPanel onConnectionChange={setDatabaseConnected} />

          <div className="section-heading">
            <div><h2>Workspace modules</h2><p>Tools for your day-to-day database work</p></div>
            <span className="coming-soon">IN DEVELOPMENT</span>
          </div>

          <section className="module-grid" aria-label="Workspace modules">
            <article className="module-card"><div className="module-icon purple">◫</div><div className="module-meta">01 · EXPLORE</div><h3>Database explorer</h3><p>Browse schemas, tables, columns, and relationships.</p><span className="module-status">Coming in Milestone 3 <b>↗</b></span></article>
            <article className="module-card"><div className="module-icon blue">⌘</div><div className="module-meta">02 · QUERY</div><h3>SQL workspace</h3><p>Write and run bounded, read-only SQL with confidence.</p><span className="module-status">Coming in Milestone 4 <b>↗</b></span></article>
            <article className="module-card"><div className="module-icon amber">✳</div><div className="module-meta">03 · ASSIST</div><h3>AI assistant</h3><p>Generate and understand SQL, always in your control.</p><span className="module-status">Coming in Milestone 5 <b>↗</b></span></article>
          </section>

          <footer className="footer"><span>ALLINDB <b>·</b> LOCAL DEVELOPMENT</span><span>Built for PostgreSQL, designed for clarity.</span></footer>
        </div>
      </main>
    </div>
  )
}

export default App
