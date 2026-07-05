"use client";

import "tldraw/tldraw.css";
import { 
  Tldraw, 
  DefaultStylePanel, 
  DefaultToolbar, 
  TldrawUiMenuItem, 
  useTools, 
  useIsToolSelected 
} from "tldraw";
import { useStorageStore } from "./useStorageStore";
import { useSelf } from "@liveblocks/react/suspense";
import { Avatars } from "@/components/Avatars";
import { Badge } from "@/components/Badge";

/**
 * IMPORTANT: LICENSE REQUIRED
 * To remove the watermark, you must first purchase a license
 * Learn more: https://tldraw.dev/community/license
 */

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

export function StorageTldraw() {
  // Getting authenticated user info. Doing this using selectors instead
  // of just `useSelf()` to prevent re-renders on Presence changes
  const id = useSelf((me) => me.id);
  const info = useSelf((me) => me.info);

  const store = useStorageStore({
    user: { id, color: info.color, name: info.name },
  });

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <Tldraw
        store={store}
        components={{
          Toolbar: CustomToolbar,
          // Render a live avatar stack at the top-right
          StylePanel: () => (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginTop: 4,
              }}
            >
              <Avatars />
              <DefaultStylePanel />
              <Badge />
            </div>
          ),
        }}
        autoFocus
      />
    </div>
  );
}
