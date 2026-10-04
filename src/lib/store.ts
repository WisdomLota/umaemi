import { useSyncExternalStore } from "react";

type Listener = () => void;

export type Store<T> = {
  get: () => T;
  set: (value: T) => void;
  subscribe: (listener: Listener) => () => void;
};

export function createStore<T>(initial: T): Store<T> {
  let value = initial;
  const listeners = new Set<Listener>();
  return {
    get: () => value,
    set(next) {
      if (Object.is(next, value)) return;
      value = next;
      listeners.forEach((l) => l());
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

export function useStore<T>(store: Store<T>, serverValue: T = store.get()) {
  return useSyncExternalStore(store.subscribe, store.get, () => serverValue);
}

// "loading" while the preloader covers the page, "done" once the hero is live.
export type IntroPhase = "loading" | "done";
export const introStore = createStore<IntroPhase>("loading");
