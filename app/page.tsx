"use client";
import Live from "@/components/Live";
import { useOthers } from "@/liveblocks.config";

export default function Page() {
  const others = useOthers();

  return (
    <div className="text-white">
      {/* <h1 className="text-4xl">Collborative Canvas App</h1>
      <span>There are {others.length} other user(s) online</span> */}

      <Live />
    </div>
  );
}
