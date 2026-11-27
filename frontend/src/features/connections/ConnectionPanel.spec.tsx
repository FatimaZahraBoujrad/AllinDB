import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ConnectionPanel } from './ConnectionPanel'
import {
  createConnection,
  disconnectConnection,
  testConnection,
} from './api'

vi.mock('./api', () => ({
  createConnection: vi.fn(),
  disconnectConnection: vi.fn(),
  testConnection: vi.fn(),
}))

const mockedCreateConnection = vi.mocked(createConnection)
const mockedDisconnectConnection = vi.mocked(disconnectConnection)
const mockedTestConnection = vi.mocked(testConnection)

describe('ConnectionPanel', () => {
  afterEach(() => {
    cleanup()
    vi.resetAllMocks()
  })

  it('tests a connection and reports a safe failure', async () => {
    mockedTestConnection.mockRejectedValue(
      new Error('PostgreSQL authentication failed. Check the username and password.'),
    )
    render(<ConnectionPanel onConnectionChange={vi.fn()} />)
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'sample-password' },
    })

    fireEvent.click(screen.getByRole('button', { name: 'Test connection' }))

    const alert = await screen.findByRole('alert')
    expect(alert.textContent).toContain('PostgreSQL authentication failed.')
    expect(alert.textContent).not.toContain('sample-password')
  })

  it('reports a successful connection test without opening a session', async () => {
    mockedTestConnection.mockResolvedValue({ status: 'connected' })
    render(<ConnectionPanel onConnectionChange={vi.fn()} />)
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'sample-password' },
    })

    fireEvent.click(screen.getByRole('button', { name: 'Test connection' }))

    expect((await screen.findByRole('status')).textContent).toContain(
      'Connection test succeeded.',
    )
    expect(mockedCreateConnection).not.toHaveBeenCalled()
  })

  it('connects, clears the password from the form, and disconnects', async () => {
    const onConnectionChange = vi.fn()
    mockedCreateConnection.mockResolvedValue({
      status: 'connected',
      connectionId: 'session-id',
    })
    mockedDisconnectConnection.mockResolvedValue({ status: 'disconnected' })
    render(<ConnectionPanel onConnectionChange={onConnectionChange} />)
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'sample-password' },
    })

    fireEvent.click(screen.getByRole('button', { name: 'Connect' }))

    await screen.findByRole('heading', { name: 'Database connected' })
    expect(mockedCreateConnection).toHaveBeenCalledWith(
      expect.objectContaining({
        host: '127.0.0.1',
        sslMode: 'require',
        password: 'sample-password',
      }),
    )
    expect(onConnectionChange).toHaveBeenLastCalledWith(true)
    expect(screen.queryByLabelText('Password')).toBeNull()

    fireEvent.click(screen.getByRole('button', { name: 'Disconnect' }))

    await waitFor(() =>
      expect(
        screen.getByRole('heading', { name: 'Connect a database' }),
      ).toBeTruthy(),
    )
    expect(mockedDisconnectConnection).toHaveBeenCalledWith('session-id')
    expect(onConnectionChange).toHaveBeenLastCalledWith(false)
  })
})
