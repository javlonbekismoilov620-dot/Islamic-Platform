"use client";
import { useSyncExternalStore } from "react";

type Ticker = { now: Date; listeners: Set<() => void>; id?: number };
const tickers = new Map<number, Ticker>();

function ticker(interval: number): Ticker {
  let t = tickers.get(interval);
  if (!t) { t = { now: new Date(), listeners: new Set() }; tickers.set(interval, t); }
  return t;
}

const subscribers = new Map<number, (cb: () => void) => () => void>();
function subscriberFor(interval: number) {
  let fn = subscribers.get(interval);
  if (!fn) { fn = (cb) => subscribe(interval, cb); subscribers.set(interval, fn); }
  return fn;
}

function subscribe(interval: number, cb: () => void) {
  const t = ticker(interval);
  t.listeners.add(cb);
  if (t.id === undefined) {
    t.id = window.setInterval(() => { t.now = new Date(); t.listeners.forEach((l) => l()); }, interval);
  }
  return () => {
    t.listeners.delete(cb);
    if (!t.listeners.size && t.id !== undefined) { window.clearInterval(t.id); t.id = undefined; }
  };
}

/** Har `interval` ms da yangilanadigan joriy vaqt. Server render va hydration paytida null. */
export function useNow(interval = 1000): Date | null {
  return useSyncExternalStore(
    subscriberFor(interval),
    () => ticker(interval).now,
    () => null,
  );
}
