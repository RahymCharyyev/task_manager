import { makeAutoObservable } from 'mobx'

const TOKEN_KEY = 'tm_mock_token'
const EMAIL_KEY = 'tm_mock_email'

export class AuthStore {
  token: string | null = null
  userEmail: string | null = null

  constructor() {
    this.token = sessionStorage.getItem(TOKEN_KEY)
    this.userEmail = sessionStorage.getItem(EMAIL_KEY)
    makeAutoObservable(this)
  }

  get user(): { email: string } | null {
    return this.userEmail ? { email: this.userEmail } : null
  }

  get isAuthenticated(): boolean {
    return Boolean(this.token)
  }

  login(email: string, password: string) {
    void password
    const mockToken = `mock.${btoa(`${email}:${Date.now()}`)}`
    this.token = mockToken
    this.userEmail = email
    sessionStorage.setItem(TOKEN_KEY, mockToken)
    sessionStorage.setItem(EMAIL_KEY, email)
  }

  logout() {
    this.token = null
    this.userEmail = null
    sessionStorage.removeItem(TOKEN_KEY)
    sessionStorage.removeItem(EMAIL_KEY)
  }
}

export const authStore = new AuthStore()
