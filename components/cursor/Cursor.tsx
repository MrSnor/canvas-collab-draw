import CursorSVG from "@/public/assets/CursorSVG";
import React from "react";

type Props = {
  color: string;
  x: number;
  y: number;
  message: string;
};

const Cursor = ({ color, x, y, message }: Props) => {
  return (
    <div
      className="pointer-events-auto absolute top-0 left-0"
      style={{
        transform: `translateX(${x}px) translateY(${y}px)`,
      }}
    >
      <CursorSVG color={color} />
      {/* <span className="">Cursor</span> */}
      {/* Message / Name to be shown under cursor */}
      {message &&
      <div className="rounded-3xl absolute left-2 top-5 px-2 py-4" style={{backgroundColor: color}}>
        <p className="text-sm whitespace-nowrap leading-relaxed">
          {message}
        </p>
      </div>
      }
    </div>
  );
};

export default Cursor;
