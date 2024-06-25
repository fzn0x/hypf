import type { Hooks } from './hooks.js'

export type InitOptions = {
  baseUrl?: string
  hooks?: Hooks
  debug?: boolean
  throwOnError?: boolean
}
