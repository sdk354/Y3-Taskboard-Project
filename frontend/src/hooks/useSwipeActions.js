import { useEffect, useRef } from "react";

// swipe a card right to push it to the next column, left to delete it.
// only locks in for clearly-horizontal moves so vertical scrolling wins,
// and backs off if the long-press drag already lifted the card.
export function useSwipeActions(ref, actions) {
  const actionsRef = useRef(actions);
  actionsRef.current = actions;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let sx = 0;
    let sy = 0;
    let dx = 0;
    let locked = null;

    const reset = () => {
      el.style.transition = "transform 0.2s ease";
      el.style.transform = "";
      el.classList.remove("swiping-left", "swiping-right");
      setTimeout(() => {
        el.style.transition = "";
      }, 200);
      locked = null;
      dx = 0;
    };

    const onStart = (e) => {
      if (e.touches.length !== 1) return;
      // ios skips touchcancel when a system gesture (edge swipe,
      // notification pull) hijacks the touch, which left the card
      // stuck part-slid — clear any leftovers before a new gesture
      el.style.transition = "";
      el.style.transform = "";
      el.classList.remove("swiping-left", "swiping-right");
      sx = e.touches[0].clientX;
      sy = e.touches[0].clientY;
      locked = null;
      dx = 0;
    };

    const onMove = (e) => {
      // the long-press drag owns the gesture once the card is lifted
      if (el.classList.contains("touch-lifted")) return;
      // a second finger means pinch/system stuff, walk away cleanly
      if (e.touches.length !== 1) {
        reset();
        return;
      }
      const t = e.touches[0];
      dx = t.clientX - sx;
      const dy = t.clientY - sy;

      if (!locked) {
        if (Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy) * 1.2) {
          // if the browser already claimed the gesture for scrolling,
          // the events can't be cancelled and fighting them jitters
          if (!e.cancelable) {
            locked = "v";
            return;
          }
          locked = "h";
          // kill the hover transition so the card tracks the finger
          // instead of easing 200ms behind it
          el.style.transition = "none";
        } else if (Math.abs(dy) > 8) {
          locked = "v";
        }
      }
      if (locked !== "h" || !e.cancelable) return;

      e.preventDefault();
      const { onSwipeRight, onSwipeLeft } = actionsRef.current;
      // no action that way? rubber-band instead of promising something
      let shown = dx;
      if (dx > 0 && !onSwipeRight) shown = Math.min(dx * 0.15, 24);
      if (dx < 0 && !onSwipeLeft) shown = Math.max(dx * 0.15, -24);
      el.style.transform = `translateX(${shown}px) rotate(${shown / 60}deg)`;
      el.classList.toggle("swiping-right", dx > 40 && Boolean(onSwipeRight));
      el.classList.toggle("swiping-left", dx < -40 && Boolean(onSwipeLeft));
    };

    const onEnd = () => {
      if (locked !== "h") {
        locked = null;
        return;
      }
      const w = el.offsetWidth;
      const { onSwipeRight, onSwipeLeft } = actionsRef.current;
      if (dx > w * 0.45 && onSwipeRight) onSwipeRight();
      else if (dx < -w * 0.45 && onSwipeLeft) onSwipeLeft();
      reset();
    };

    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchmove", onMove, { passive: false });
    el.addEventListener("touchend", onEnd);
    el.addEventListener("touchcancel", reset);
    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchmove", onMove);
      el.removeEventListener("touchend", onEnd);
      el.removeEventListener("touchcancel", reset);
    };
  }, [ref]);
}
