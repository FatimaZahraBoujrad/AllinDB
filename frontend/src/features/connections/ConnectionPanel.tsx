import { useEffect, useState, type FormEvent } from 'react'
import {
  createConnection,
  disconnectConnection,
  testConnection,
  type ConnectionRequest,
} from './api'

type ConnectionPanelProps = {
  onConnectionChange: (connected: boolean) => void
}

type PendingAction = 'test' | 'connect' | 'disconnect' | null

const initialConnection: ConnectionRequest = {
  host: '127.0.0.1',
  port: 54329,
  database: 'allindb_demo',
  username: 'allindb_readonly',
  password: '',
  sslMode: 'disable',
}

export function ConnectionPanel({
  onConnectionChange,
}: ConnectionPanelProps) {
  const [connection, setConnection] = useState(initialConnection)
  const [connectionId, setConnectionId] = useState<string | null>(null)
  const [pendingAction, setPendingAction] = useState<PendingAction>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const isConnected = connectionId !== null

  useEffect(() => {
    if (!connectionId) return

    const disconnectOnPageHide = () => {
      void fetch(`/api/connections/${encodeURIComponent(connectionId)}`, {
        method: 'DELETE',
        keepalive: true,
      })
    }

    window.addEventListener('pagehide', disconnectOnPageHide)
    return () => window.removeEventListener('pagehide', disconnectOnPageHide)
  }, [connectionId])

  function updateConnection<Key extends keyof ConnectionRequest>(
    key: Key,
    value: ConnectionRequest[Key],
  ) {
    setConnection((current) => ({ ...current, [key]: value }))
    setErrorMessage(null)
    setStatusMessage(null)
  }

  function updateHost(host: string) {
    setConnection((current) => ({
      ...current,
      host,
      sslMode: getDefaultSslMode(host),
    }))
    setErrorMessage(null)
    setStatusMessage(null)
  }

  async function handleTestConnection() {
    setPendingAction('test')
    setErrorMessage(null)
    setStatusMessage(null)

    try {
      await testConnection(connection)
      setStatusMessage('Connection test succeeded. You can connect now.')
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    } finally {
      setPendingAction(null)
    }
  }

  async function handleConnect(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPendingAction('connect')
    setErrorMessage(null)
    setStatusMessage(null)

    try {
      const session = await createConnection(connection)
      setConnectionId(session.connectionId)
      setConnection((current) => ({ ...current, password: '' }))
      onConnectionChange(true)
      setStatusMessage('Connected to PostgreSQL.')
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    } finally {
      setPendingAction(null)
    }
  }

  async function handleDisconnect() {
    if (!connectionId) return
    setPendingAction('disconnect')
    setErrorMessage(null)
    setStatusMessage(null)

    try {
      await disconnectConnection(connectionId)
      setConnectionId(null)
      onConnectionChange(false)
      setStatusMessage('Database connection closed.')
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    } finally {
      setPendingAction(null)
    }
  }

  return (
    <section className="connection-panel" aria-labelledby="connection-title">
      <div className="connection-panel-heading">
        <div>
          <div className="card-kicker">POSTGRESQL</div>
          <h2 id="connection-title">
            {isConnected ? 'Database connected' : 'Connect a database'}
          </h2>
        </div>
        {isConnected && <span className="connection-state">CONNECTED</span>}
      </div>

      {isConnected ? (
        <div className="connection-success">
          <p>Your database session is active in memory for this app session.</p>
          <button
            className="connection-button secondary"
            type="button"
            onClick={handleDisconnect}
            disabled={pendingAction !== null}
          >
            {pendingAction === 'disconnect' ? 'Disconnecting…' : 'Disconnect'}
          </button>
        </div>
      ) : (
        <form className="connection-form" onSubmit={handleConnect}>
          <label>
            Host
            <input
              name="host"
              autoComplete="off"
              value={connection.host}
              onChange={(event) => updateHost(event.target.value)}
              required
            />
          </label>
          <label>
            Port
            <input
              name="port"
              type="number"
              min="1"
              max="65535"
              value={connection.port}
              onChange={(event) =>
                updateConnection('port', Number(event.target.value))
              }
              required
            />
          </label>
          <label>
            Database
            <input
              name="database"
              autoComplete="off"
              value={connection.database}
              onChange={(event) =>
                updateConnection('database', event.target.value)
              }
              required
            />
          </label>
          <label>
            Username
            <input
              name="username"
              autoComplete="username"
              value={connection.username}
              onChange={(event) =>
                updateConnection('username', event.target.value)
              }
              required
            />
          </label>
          <label className="password-field">
            Password
            <input
              name="password"
              type="password"
              autoComplete="off"
              placeholder="POSTGRES_READONLY_PASSWORD from .env"
              value={connection.password}
              onChange={(event) =>
                updateConnection('password', event.target.value)
              }
              required
            />
          </label>
          <label>
            Transport security
            <select
              name="sslMode"
              value={connection.sslMode}
              onChange={(event) => {
                const { value } = event.target
                if (value === 'disable' || value === 'require') {
                  updateConnection('sslMode', value)
                }
              }}
            >
              <option value="require">Require TLS</option>
              <option value="disable">Disable TLS (local only)</option>
            </select>
          </label>

          <p className="connection-note">
            Credentials are sent only to the local API and are not saved. TLS
            is disabled for loopback hosts and required automatically for
            other hosts.
          </p>
          {errorMessage && (
            <p className="connection-message error" role="alert">
              {errorMessage}
            </p>
          )}
          {statusMessage && (
            <p className="connection-message success" role="status">
              {statusMessage}
            </p>
          )}

          <div className="connection-actions">
            <button
              className="connection-button secondary"
              type="button"
              onClick={handleTestConnection}
              disabled={pendingAction !== null || connection.password.length === 0}
            >
              {pendingAction === 'test' ? 'Testing…' : 'Test connection'}
            </button>
            <button
              className="connection-button primary"
              type="submit"
              disabled={pendingAction !== null}
            >
              {pendingAction === 'connect' ? 'Connecting…' : 'Connect'}
            </button>
          </div>
        </form>
      )}

      {isConnected && (
        <>
          {errorMessage && (
            <p className="connection-message error" role="alert">
              {errorMessage}
            </p>
          )}
          {statusMessage && (
            <p className="connection-message success" role="status">
              {statusMessage}
            </p>
          )}
        </>
      )}
    </section>
  )
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : 'The connection request could not be completed. Try again.'
}

function getDefaultSslMode(host: string): ConnectionRequest['sslMode'] {
  const normalizedHost = host.toLowerCase().replace(/\.$/, '')
  return normalizedHost === '127.0.0.1' ||
    normalizedHost === 'localhost' ||
    normalizedHost === '::1'
    ? 'disable'
    : 'require'
}
