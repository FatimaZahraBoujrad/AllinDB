export type ConnectionRequest = {
  host: string
  port: number
  database: string
  username: string
  password: string
  sslMode: 'disable' | 'require'
}

export type ConnectionTestResponse = {
  status: 'connected'
}

export type ConnectionSessionResponse = ConnectionTestResponse & {
  connectionId: string
}

export type DisconnectResponse = {
  status: 'disconnected'
}

export async function testConnection(
  connection: ConnectionRequest,
): Promise<ConnectionTestResponse> {
  return request('/api/connections/test', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(connection),
  })
}

export async function createConnection(
  connection: ConnectionRequest,
): Promise<ConnectionSessionResponse> {
  return request('/api/connections', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(connection),
  })
}

export async function disconnectConnection(
  connectionId: string,
): Promise<DisconnectResponse> {
  return request(`/api/connections/${encodeURIComponent(connectionId)}`, {
    method: 'DELETE',
  })
}

async function request<T>(url: string, init: RequestInit): Promise<T> {
  const response = await fetch(url, init)
  const payload: unknown = await response.json()

  if (!response.ok) {
    const message = getErrorMessage(payload)
    throw new Error(message)
  }

  return payload as T
}

function getErrorMessage(payload: unknown): string {
  if (
    typeof payload === 'object' &&
    payload !== null &&
    'message' in payload
  ) {
    const message = payload.message
    if (typeof message === 'string') return message
    if (
      Array.isArray(message) &&
      message.every((item) => typeof item === 'string')
    ) {
      return message.join(' ')
    }
  }
  return 'The request could not be completed. Try again.'
}
