import { useEffect, useState } from "react";

/**
 * Manage notification state of action that can be taken multiple times
 * Set `visible = true` until `delay` milliseconds after latest `fadeIn()`
 * That is, each call to `fadeIn()` resets the timer to set `visible = false`
 */
export const useFadeSuccess = (delay: number) => {
  const [inflight, setInflight] = useState<number>(0);

  useEffect(() => {
    let cancelled = false;

    let timer = setTimeout(() => {
      if (!cancelled) {
        setInflight(0);
      }
    }, delay);

    return () => {
      cancelled = true;
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [inflight, setInflight]);

  return {
    /** Call `fadeIn()` to increment inflight counter, set `visible = true` */
    fadeIn: () => setInflight(inflight + 1),
    /** `visible = true` if `fadeIn()` called in last `delay` milliseconds */
    visible: inflight > 0,
  };
};
