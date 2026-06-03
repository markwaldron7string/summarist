// src/redux/slices/authSlice.test.ts
import reducer, {
  openAuthModal,
  login,
  logout,
  setAuthMode,
  setSubscription,
} from './authSlice'
import type { User } from './authSlice'

// This slice writes to localStorage in some actions (login/logout). jsdom
// gives us a real localStorage, but it persists between tests in the same
// file — so we clear it before each test to keep them independent. Test
// isolation: each test should start from a clean slate, never depending on
// what a previous test left behind.
beforeEach(() => {
  localStorage.clear()
})

describe('authSlice', () => {
  it('opens the auth modal and sets the mode from the payload', () => {
    // Passing `undefined` as the state makes the reducer return its initial
    // state — a handy way to get a fresh starting point without importing it.
    const initial = reducer(undefined, { type: 'unknown' })

    const next = reducer(initial, openAuthModal('register'))

    expect(next.isAuthModalOpen).toBe(true)
    expect(next.authMode).toBe('register')
  })

  it('logs a user in: stores the user and closes the modal', () => {
    const initial = reducer(undefined, { type: 'unknown' })
    const user: User = { email: 'mark@example.com', subscription: 'premium' }

    const next = reducer(initial, login(user))

    expect(next.user).toEqual(user)
    expect(next.isAuthModalOpen).toBe(false)
    expect(next.subscriptionIntent).toBe(null)
  })

  it('logs a user out: clears the user back to null', () => {
    // Build a "logged-in" state first, then log out from it.
    const loggedIn = reducer(
      undefined,
      login({ email: 'mark@example.com', subscription: 'premium' })
    )

    const next = reducer(loggedIn, logout())

    expect(next.user).toBe(null)
  })

  it('remembers the previous mode when switching to reset', () => {
    // setAuthMode has a branch: only when the mode is "reset" does it save
    // the previous mode. Start from a known mode, then switch to reset.
    const start = reducer(undefined, setAuthMode('register'))
    const next = reducer(start, setAuthMode('reset'))

    expect(next.authMode).toBe('reset')
    expect(next.previousAuthMode).toBe('register') // the branch fired
  })

  it('does nothing on setSubscription when no user is logged in', () => {
    // setSubscription has a guard: it only updates if state.user exists.
    // From the initial (logged-out) state, it should be a no-op.
    const initial = reducer(undefined, { type: 'unknown' })
    const next = reducer(initial, setSubscription('premium-plus'))

    expect(next.user).toBe(null) // still null — the guard held
  })
})