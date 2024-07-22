import React, { useCallback, useEffect, useState } from "react";
import LiveCursors from "./cursor/LiveCursors";
import { useMyPresence, useOthers } from "@/liveblocks.config";
import CursorChat from "./cursor/CursorChat";
import { CursorMode } from "@/types/type";

const Live = () => {
  const others = useOthers();
  const [{ cursor }, updateMyPresence] = useMyPresence() as any;
  const [cursorState, setCursorState] = useState({
    mode: CursorMode.Hidden,
  });

  const handlePointerMove = useCallback((event: React.PointerEvent) => {
    event.preventDefault();

    const xPos = event.clientX - event.currentTarget.getBoundingClientRect().x;
    const yPos = event.clientY - event.currentTarget.getBoundingClientRect().y;

    updateMyPresence({ cursor: { x: xPos, y: yPos } });
  }, []);

  const handlePointerLeave = useCallback((event: React.PointerEvent) => {
    setCursorState({ mode: CursorMode.Hidden });

    updateMyPresence({ cursor: null, message: null });
  }, []);

  const handlePointerDown = useCallback((event: React.PointerEvent) => {
    const xPos = event.clientX - event.currentTarget.getBoundingClientRect().x;
    const yPos = event.clientY - event.currentTarget.getBoundingClientRect().y;

    updateMyPresence({ cursor: { x: xPos, y: yPos } });
  }, []);

  useEffect(() => {
    const onKeyUp = (event: KeyboardEvent) => {
      
      if (event.key === "/") {
        console.log(event);
        setCursorState({
          mode: CursorMode.Chat,
          previousMessage: null,
          message: "",
        });
      } else if (event.key === "Escape") {
        updateMyPresence({ message: "" });
        setCursorState({
          mode: CursorMode.Hidden,
        });
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "/") {
        event.preventDefault();
      }
    };

    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [updateMyPresence]);

  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      className="h-screen w-full flex flex-col items-center justify-center border border-emerald-500"
    >
      <h1 className="text-4xl">Collborative Canvas App</h1>
      <span>There are {others.length} other user(s) online</span>

      <LiveCursors others={others} />

      {cursor && (
        <CursorChat
          cursor={cursor}
          cursorState={cursorState}
          setCursorState={setCursorState}
          updateMyPresence={updateMyPresence}
        />
      )}
    </div>
  );
};

export default Live;
