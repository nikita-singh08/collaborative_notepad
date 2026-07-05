"use client";

import React, { useState, useEffect, useRef } from "react";
import { Room } from "@/app/Room";
import { StorageTldraw } from "@/components/StorageTldraw";
import { RoomHeader } from "@/components/RoomHeader";
import { LiveCursors } from "@/components/LiveCursors";
import { 
  Tldraw, 
  DefaultStylePanel, 
  DefaultToolbar, 
  TldrawUiMenuItem, 
  useTools, 
  useIsToolSelected 
} from "tldraw";
import "tldraw/tldraw.css";

type Props = {
  params: Promise<{ roomId: string }>;
};

function LocalMinimalistTldraw() {
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <Tldraw
        components={{
          Toolbar: CustomToolbar,
          StylePanel: () => (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginTop: 4,
              }}
            >
              <div className="mb-2 px-3 py-1.5 bg-amber-50 text-amber-800 text-[10px] font-medium rounded border border-amber-200/50 shadow-sm text-center">
                Offline Mode (No API Key)
              </div>
              <DefaultStylePanel />
            </div>
          ),
        }}
        autoFocus
      />
    </div>
  );
}

function CustomToolbar() {
  const tools = useTools();
  const selectTool = tools['select'];
  const drawTool = tools['draw'];
  const highlightTool = tools['highlight'];
  const textTool = tools['text'];
  const eraserTool = tools['eraser'];

  return (
    <DefaultToolbar>
      {selectTool && <TldrawUiMenuItem {...selectTool} isSelected={useIsToolSelected(selectTool)} />}
      {drawTool && <TldrawUiMenuItem {...drawTool} isSelected={useIsToolSelected(drawTool)} />}
      {highlightTool && <TldrawUiMenuItem {...highlightTool} isSelected={useIsToolSelected(highlightTool)} />}
      {textTool && <TldrawUiMenuItem {...textTool} isSelected={useIsToolSelected(textTool)} />}
      {eraserTool && <TldrawUiMenuItem {...eraserTool} isSelected={useIsToolSelected(eraserTool)} />}
    </DefaultToolbar>
  );
}

export default function RoomPage({ params }: Props) {
  const { roomId } = React.use(params);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLiveblocksConfigured, setIsLiveblocksConfigured] = useState<boolean | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/config")
      .then((res) => res.json())
      .then((data) => {
        setIsLiveblocksConfigured(data.liveblocksConfigured);
      })
      .catch(() => {
        setIsLiveblocksConfigured(false);
      });
  }, []);

  return (
    <div className="relative flex h-screen w-screen overflow-hidden bg-[#faf9f5]">
      
      {/* Main Canvas Area */}
      <div ref={containerRef} className="relative flex-1 h-full w-full">
        {isLiveblocksConfigured === null ? (
          <div className="flex h-full w-full items-center justify-center bg-[#faf9f5]">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-stone-200 border-t-purple-600" />
              <p className="text-xs font-medium text-stone-500">Connecting to Project InkSync...</p>
            </div>
          </div>
        ) : isLiveblocksConfigured ? (
          <Room roomId={roomId}>
            <StorageTldraw />
            {/* Sync pointers on top of infinite canvas */}
            <LiveCursors containerRef={containerRef} />
          </Room>
        ) : (
          <LocalMinimalistTldraw />
        )}
        
        {/* Custom Header: Title, Liveblocks Status Indicator, and Share Invite Link */}
        <RoomHeader roomId={roomId} isLiveblocksConfigured={isLiveblocksConfigured ?? false} />

        {/* Collapsible right sidebar trigger button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute top-4 right-4 z-[1000] flex h-10 w-10 items-center justify-center rounded-lg bg-white/85 backdrop-blur-md shadow-sm border border-stone-200/50 hover:bg-stone-50 transition-all text-stone-750"
          title="Toggle AI Assistant"
          id="toggle-ai-sidebar-btn"
        >
          {isSidebarOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275Z"/><path d="m5 3 1 2.5L8.5 6 6 7 5 9.5 4 7 1.5 6 4 5.5Z"/><path d="m19 17 1 2.5 2.5.5-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1Z"/></svg>
          )}
        </button>
      </div>

      {/* Gemini AI Assistant Sidebar */}
      {/* Gemini AI Assistant Panel Placeholder */}
      <div
        className={`h-full border-l border-stone-200/50 bg-white/95 backdrop-blur-md shadow-lg transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "w-80 opacity-100" : "w-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex h-full flex-col p-6 w-80">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-4 mb-4">
            <svg className="text-purple-600" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275Z"/></svg>
            <h2 className="font-semibold text-stone-850">Gemini AI Assistant</h2>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
            <p className="text-sm text-stone-400">
              Gemini canvas partner integration is coming in Phase 4. Soon you can generate flowcharts, convert handwriting to text, and clean up layouts.
            </p>
          </div>
          <div className="mt-auto border-t border-stone-100 pt-4 text-xs text-stone-400">
            Phase 1 Placeholder
          </div>
        </div>
      </div>
      
    </div>
  );
}
