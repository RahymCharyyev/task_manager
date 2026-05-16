import { makeAutoObservable } from 'mobx'

const STORAGE_KEY = 'tm_theme_mode'

export type ThemeMode = 'light' | 'dark'

function readStoredMode(): ThemeMode {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    if (v === 'light' || v === 'dark') return v
  } catch {
    /* ignore */
  }
  return 'light'
}

export class ThemeStore {
  mode: ThemeMode = readStoredMode()

  constructor() {
    makeAutoObservable(this)
    queueMicrotask(() => this.syncDomClass())
  }

  get isDark(): boolean {
    return this.mode === 'dark'
  }

  setMode(mode: ThemeMode) {
    this.mode = mode
    try {
      localStorage.setItem(STORAGE_KEY, mode)
    } catch {
      /* ignore */
    }
    this.syncDomClass()
  }

  toggle() {
    this.setMode(this.mode === 'light' ? 'dark' : 'light')
  }

  private syncDomClass() {
    if (typeof document === 'undefined') return
    const root = document.documentElement
    root.classList.toggle('dark', this.mode === 'dark')
    root.style.colorScheme = this.mode === 'dark' ? 'dark' : 'light'
  }
}

export const themeStore = new ThemeStore()
