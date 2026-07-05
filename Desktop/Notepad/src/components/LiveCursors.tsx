"use client";

import { useMyPresence, useOthers } from "@liveblocks/react";
import React, { useEffect } from "react";

export function LiveCursors({ containerRef }: { containerRef: React.RefObject<HTMLDivElement | null> }) {
  const [, updateMyPresence] = useMyPresence();
  const others = useOthers();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Only sync if pointer is within whiteboard bounds
      if (x >= 0 && y >= 0 && x <= rect.width && y <= rect.height) {
        updateMyPresence({ cursor: { x, y } });
      } else {
        updateMyPresence({ cursor: null });
      }
    };

    const handlePointerLeave = () => {
      updateMyPresence({ cursor: null });
    };

    window.addEventListener("pointermove", handlePointerMove);
    container.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [containerRef, updateMyPresence]);

  return (
    <div className="absolute inset-0 pointer-events-none z-[500] overflow-hidden">
      {others.map(({ connectionId, presence, info }) => {
        // Safe check for cursor presence
        if (!presence || !presence.cursor) return null;
        const { x, y } = presence.cursor;
        const color = info?.color || "#6366f1";
        const name = info?.name || "Guest";

        return (
          <div
            key={connectionId}
            className="absolute transition-transform duration-75 ease-out will-change-transform"
            style={{
              transform: `translate3d(${x}px, ${y}px, 0)`,
            }}
          >
            {/* Premium custom styled cursor SVG */}
            <svg
              className="h-5 w-5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.18)]"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M3 3L10.07 20.07a0.5 0 0 0 .93-.18L13 13l6.89-2a0.5 0 0 0 .18-.93L3 3Z"
                fill={color}
                stroke="white"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
            
            {/* Floating user name identity tag */}
            <div
              className="absolute left-3.5 top-3.5 rounded px-2 py-0.5 text-[9px] font-bold text-white shadow-md border border-white/20 select-none whitespace-nowrap"
              style={{ backgroundColor: color }}
            >
              {name}
            </div>
          </div>
        );
      })}
    </div>
  );
}
