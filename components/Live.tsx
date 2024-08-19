import React, { useCallback, useEffect, useState } from "react";
import LiveCursors from "./cursor/LiveCursors";
import {
  useBroadcastEvent,
  useEventListener,
  useMyPresence,
  useOthers,
} from "@/liveblocks.config";
import CursorChat from "./cursor/CursorChat";
import { CursorMode, CursorState, Reaction, ReactionEvent } from "@/types/type";
import ReactionSelector from "./reaction/ReactionButton";
import FlyingReaction from "./reaction/FlyingReaction";
import useInterval from "@/hooks/useInterval";

const Live = () => {
  const others = useOthers();
  const [{ cursor }, updateMyPresence] = useMyPresence() as any;
  const [cursorState, setCursorState] = useState<CursorState>({
    mode: CursorMode.Hidden,
  });
  const [reaction, setReaction] = useState<Reaction[]>([]);

  const broadcast = useBroadcastEvent();

  // remove reactions after 1 second (if they are are older than 3 seconds)
  useInterval(() => {
    setReaction((reactions) =>
      reactions.filter((reaction) => {
        if (reaction.timestamp === 0) return true;

        const timeSinceReaction = Date.now() - reaction.timestamp;

        return timeSinceReaction < 3000;
      })
    );
  }, 1000);

  // shows reactions in determined intervals
  useInterval(() => {
    if (
      cursorState.mode === CursorMode.Reaction &&
      cursorState.isPressed &&
      cursor
    ) {
      setReaction((reactions) => {
        return reactions.concat([
          {
            point: { x: cursor.x, y: cursor.y },
            value: cursorState.reaction,
            timestamp: Date.now(),
          },
        ]);
      });

      // use broadcast to send the reaction to everyone
      broadcast({
        x: cursor.x,
        y: cursor.y,
        value: cursorState.reaction,
      });
    }
  }, 100);

  // listen for reactions from others
  useEventListener((eventData) => {
    const event = eventData.event as ReactionEvent;

    setReaction((reactions) => {
      return reactions.concat([
        {
          point: { x: event.x, y: event.y },
          value: event.value,
          timestamp: Date.now(),
        },
      ]);
    });
  });

  const handlePointerMove = useCallback((event: React.PointerEvent) => {
    event.preventDefault();

    if (cursor === null || cursorState.mode !== CursorMode.ReactionSelector) {
      const xPos =
        event.clientX - event.currentTarget.getBoundingClientRect().x;
      const yPos =
        event.clientY - event.currentTarget.getBoundingClientRect().y;

      updateMyPresence({ cursor: { x: xPos, y: yPos } });
    }
  }, []);

  const handlePointerLeave = useCallback((event: React.PointerEvent) => {
    setCursorState({ mode: CursorMode.Hidden });

    updateMyPresence({ cursor: null, message: null });
  }, []);

  const handlePointerDown = useCallback(
    (event: React.PointerEvent) => {
      const xPos =
        event.clientX - event.currentTarget.getBoundingClientRect().x;
      const yPos =
        event.clientY - event.currentTarget.getBoundingClientRect().y;

      updateMyPresence({ cursor: { x: xPos, y: yPos } });

      setCursorState((state: CursorState) =>
        cursorState.mode === CursorMode.Reaction
          ? {
              ...state,
              isPressed: true,
            }
          : state
      );
    },
    [cursorState, setCursorState]
  );

  const handlePointerUp = useCallback(
    (event: React.PointerEvent) => {
      setCursorState((state: CursorState) =>
        cursorState.mode === CursorMode.Reaction
          ? {
              ...state,
              isPressed: true,
            }
          : state
      );
    },
    [cursorState.mode, setCursorState]
  );

  useEffect(() => {
    const onKeyUp = (event: KeyboardEvent) => {
      if (event.key === "/") {
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
      } else if (event.key === "e") {
        // temporary solution for triggering the reaction selector while using the cursor chat
        // if event target is a input element, don't trigger
        // if (event.target instanceof HTMLInputElement) {
        //   return;
        // }

        setCursorState({
          mode: CursorMode.ReactionSelector,
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

  const setReactions = useCallback((reaction: string) => {
    setCursorState({
      mode: CursorMode.Reaction,
      reaction,
      isPressed: false,
    });
  }, []);

  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      className="h-screen w-full flex flex-col items-center justify-center border border-emerald-500"
      style={{
        cursor: "url(/cursor.svg) 0 0, auto",
      }}
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

      {cursorState.mode === CursorMode.ReactionSelector && (
        <ReactionSelector setReaction={setReactions} />
      )}

      {reaction.map((r) => {
        return (
          <FlyingReaction
            key={r.timestamp.toString()}
            x={r.point.x}
            y={r.point.y}
            timestamp={r.timestamp}
            value={r.value}
          />
        );
      })}
    </div>
  );
};

export default Live;
