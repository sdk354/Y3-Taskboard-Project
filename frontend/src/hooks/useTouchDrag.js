import { useEffect, useRef } from "react";

// html5 drag and drop never fires on touch screens, so this fakes it:
// long-press a card to lift it, a ghost follows your finger, drop it on a
// column. dragging near the screen edge scrolls the board sideways so you
// can reach columns that are off screen.
export function useTouchDrag(ref, onDrop) {
  const onDropRef = useRef(onDrop);
  onDropRef.current = onDrop;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let timer = null;
    let ghost = null;
    let dragging = false;
    let startX = 0;
    let startY = 0;
    let lastCol = null;
    let scrollDir = 0;
    let raf = null;

    const board = () => document.querySelector(".board-columns");

    const columnUnder = (x, y) => {
      ghost.style.display = "none";
      const hit = document.elementFromPoint(x, y);
      ghost.style.display = "";
      return hit ? hit.closest(".column") : null;
    };

    const scrollLoop = () => {
      if (!dragging) return;
      if (scrollDir) board().scrollLeft += scrollDir * 10;
      raf = requestAnimationFrame(scrollLoop);
    };

    const startDrag = (touch) => {
      dragging = true;
      const rect = el.getBoundingClientRect();
      ghost = el.cloneNode(true);
      ghost.classList.add("touch-ghost");
      ghost.style.width = rect.width + "px";
      document.body.appendChild(ghost);
      el.classList.add("touch-lifted");
      board()?.classList.add("dragging");
      if (navigator.vibrate) navigator.vibrate(10);
      moveGhost(touch);
      raf = requestAnimationFrame(scrollLoop);
    };

    const moveGhost = (touch) => {
      const w = ghost.offsetWidth;
      ghost.style.transform = `translate(${touch.clientX - w / 2}px, ${touch.clientY - 30}px) rotate(2deg)`;

      const col = columnUnder(touch.clientX, touch.clientY);
      if (col !== lastCol) {
        lastCol?.classList.remove("drag-over");
        col?.classList.add("drag-over");
        lastCol = col;
      }

      const edge = 48;
      scrollDir =
        touch.clientX < edge
          ? -1
          : touch.clientX > window.innerWidth - edge
            ? 1
            : 0;
    };

    const cleanup = () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
      if (!dragging) return;
      dragging = false;
      ghost?.remove();
      ghost = null;
      el.classList.remove("touch-lifted");
      board()?.classList.remove("dragging");
      lastCol?.classList.remove("drag-over");
      lastCol = null;
    };

    const onTouchStart = (e) => {
      if (e.touches.length !== 1) return;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      timer = setTimeout(() => startDrag(e.touches[0]), 350);
    };

    const onTouchMove = (e) => {
      const t = e.touches[0];
      if (!dragging) {
        // finger moved before the long press fired, treat it as a scroll
        if (Math.hypot(t.clientX - startX, t.clientY - startY) > 10) {
          clearTimeout(timer);
        }
        return;
      }
      e.preventDefault();
      moveGhost(t);
    };

    const onTouchEnd = (e) => {
      if (!dragging) {
        clearTimeout(timer);
        return;
      }
      const t = e.changedTouches[0];
      const col = columnUnder(t.clientX, t.clientY);
      const status = col?.dataset.status;
      cleanup();
      if (status) onDropRef.current(status);
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd);
    el.addEventListener("touchcancel", cleanup);

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("touchcancel", cleanup);
      cleanup();
    };
  }, [ref]);
}
