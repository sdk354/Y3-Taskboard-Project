import React from "react";
import { STATUSES } from "../data/statuses";
import { LABEL_CLASS } from "../utils/noteStyle";

// phone-only strip of mini column labels: tap to jump, syncs while
// swiping, and doubles as a drop target when dragging a card
const ColumnPager = ({ counts, active, onJump, onDropTask }) => {
  return (
    <div className="column-pager" role="tablist" aria-label="Columns">
      {STATUSES.map((s) => (
        <button
          key={s}
          role="tab"
          aria-selected={active === s}
          data-status={s}
          className={`pager-chip ${LABEL_CLASS[s]} ${active === s ? "active" : ""}`}
          onClick={() => onJump(s)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const id = e.dataTransfer.getData("text/plain");
            if (id) onDropTask(id, s);
          }}
        >
          {s} ({counts[s] ?? 0})
        </button>
      ))}
    </div>
  );
};

export default ColumnPager;
