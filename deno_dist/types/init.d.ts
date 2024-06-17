import type { Hooks } from "./hooks.ts";

export type InitOptions = {
  baseUrl?: string;
  hooks?: Hooks;
  DEBUG?: boolean;
};
