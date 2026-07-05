"use client";

import React, { useState } from "react";
import { useStatus } from "@liveblocks/react";

type RoomHeaderProps = {
  roomId: string;
  isLiveblocksConfigured: boolean;
};

function LiveblocksStatusBadge() {
  const status = useStatus();

  let label = "Connecting";
  let dotColorClass = "bg-amber-400 animate-pulse";
  let badgeStyleClass = "text-amber-700 bg-amber-50/80 border-amber-200/50";

  if (status === "connected") {
    label = "Synced";
    dotColorClass = "bg-emerald-500";
    badgeStyleClass = "text-emerald-700 bg-emerald-50/80 border-emerald-200/30";
  } else if (status === "disconnected" || status === "reconnecting") {
    label = "Offline";
    dotColorClass = "bg-rose-500";
    badgeStyleClass = "text-rose-700 bg-rose-50/80 border-rose-200/30";
  }

  return (
    <div className={`flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold border tracking-wide transition-all ${badgeStyleClass}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dotColorClass}`} />
      <span>{label}</span>
    </div>
  );
}

function LocalStatusBadge() {
  return (
    <div className="flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold border border-stone-200/50 text-stone-600 bg-stone-50/80 tracking-wide">
      <span className="h-1.5 w-1.5 rounded-full bg-stone-400" />
      <span>Local Mode</span>
    </div>
  );
}

export function RoomHeader({ roomId, isLiveblocksConfigured }: RoomHeaderProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link: ", err);
    }
  };

  return (
    <div className="absolute top-4 left-4 z-[1000] flex items-center gap-3 rounded-xl bg-white/80 backdrop-blur-md px-3.5 py-2 shadow-sm border border-stone-200/50 transition-all hover:bg-white/90">
      
      {/* Branding and Room Meta */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Project InkSync</span>
        <span className="text-stone-300">/</span>
        <span className="text-sm font-semibold text-stone-800 tracking-tight">Room: {roomId}</span>
      </div>

      <span className="h-4 w-px bg-stone-200/60" />

      {/* Connection Status Badge */}
      {isLiveblocksConfigured ? (
        <LiveblocksStatusBadge />
      ) : (
        <LocalStatusBadge />
      )}

      <span className="h-4 w-px bg-stone-200/60" />

      {/* Share / Invite Button */}
      <button
        onClick={handleShare}
        className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium border transition-all duration-200 ${
          copied
            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
            : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50 hover:text-stone-900"
        }`}
        title="Copy invitation URL to clipboard"
      >
        {copied ? (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
            <span>Copied!</span>
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
            <span>Invite</span>
          </>
        )}
      </button>

    </div>
  );
}
