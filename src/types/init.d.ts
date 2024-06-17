import type { Hooks } from "./hooks.js";

export type InitOptions = {
  baseUrl?: string;
  hooks?: Hooks;
  DEBUG?: boolean;
};
