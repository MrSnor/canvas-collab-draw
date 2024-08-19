"use client";
import Live from "@/components/Live";
import Navbar from "@/components/Navbar";
import { useOthers } from "@/liveblocks.config";

export default function Page() {
  const others = useOthers();

  return (
    <main className="h-screen overflow-hidden text-white">
      {/* <h1 className="text-4xl">Collborative Canvas App</h1>
      <span>There are {others.length} other user(s) online</span> */}

      <Navbar />
      <section className="h-full flex">
        <Live />
      </section>
    </main>
  );
}
