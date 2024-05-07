import React, { useCallback } from "react";
import LiveCursors from "./cursor/LiveCursors";
import { useMyPresence, useOthers } from "@/liveblocks.config";

const Live = () => {
  const others = useOthers();
  const [{ cursor }, updateMyPresence] = useMyPresence() as any;

  const handlePointerMove = useCallback((event: React.PointerEvent) => {
    event.preventDefault();

    const xPos = event.clientX - event.currentTarget.getBoundingClientRect().x;
    const yPos = event.clientY - event.currentTarget.getBoundingClientRect().y;

    updateMyPresence({ cursor: { x: xPos, y: yPos } });
  }, []);

  const handlePointerLeave = useCallback((event: React.PointerEvent) => {
    event.preventDefault();

    updateMyPresence({ cursor: null, message: null });
  }, []);

  const handlePointerDown = useCallback((event: React.PointerEvent) => {
    const xPos = event.clientX - event.currentTarget.getBoundingClientRect().x;
    const yPos = event.clientY - event.currentTarget.getBoundingClientRect().y;

    updateMyPresence({ cursor: { x: xPos, y: yPos } });
  }, []);

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
    </div>
  );
};

export default Live;
