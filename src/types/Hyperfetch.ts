import type { HttpRequestFunctions } from './request.js'
import type { Hooks } from './hooks.js'

declare function init(baseUrl?: string, hooks?: Hooks, DEBUG?: boolean): HttpRequestFunctions
declare const _default: {
  init: typeof init
}
export default _default
