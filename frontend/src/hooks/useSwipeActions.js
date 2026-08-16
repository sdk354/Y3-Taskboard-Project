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
      sx = e.touches[0].clientX;
      sy = e.touches[0].clientY;
      locked = null;
      dx = 0;
      el.style.transition = "";
    };

    const onMove = (e) => {
      // the long-press drag owns the gesture once the card is lifted
      if (el.classList.contains("touch-lifted")) return;
      const t = e.touches[0];
      dx = t.clientX - sx;
      const dy = t.clientY - sy;

      if (!locked) {
        if (Math.abs(dx) > 14 && Math.abs(dx) > Math.abs(dy) * 1.5) {
          locked = "h";
        } else if (Math.abs(dy) > 14) {
          locked = "v";
        }
      }
      if (locked !== "h") return;

      e.preventDefault();
      el.style.transform = `translateX(${dx}px) rotate(${dx / 60}deg)`;
      el.classList.toggle("swiping-right", dx > 40);
      el.classList.toggle("swiping-left", dx < -40);
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
