"use client";
import LeftSidebar from "@/components/LeftSidebar";
import Live from "@/components/Live";
import Navbar from "@/components/Navbar";
import RightSidebar from "@/components/RightSidebar";
import { useOthers } from "@/liveblocks.config";
import { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import {
  handleCanvasMouseDown,
  handleResize,
  initializeFabric,
} from "@/lib/canvas";
import { ActiveElement } from "@/types/type";

type shapes =
  | "rectangle"
  | "circle"
  | "triangle"
  | "line"
  | "freeform"
  | "image";

export default function Page() {
  const others = useOthers();
  // reference to the actual html canvas
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // reference to the fabricjs canvas which is a wrapper around the html canvas to provide additional features
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const isDrawing = useRef(false);
  const shapeRef = useRef<fabric.Object | null>(null);
  const selectedShapeRef = useRef<string | null>(null);
  const [activeElement, setActiveElement] = useState<ActiveElement>({
    name: "",
    value: "",
    icon: "",
  });

  const handleActiveElement = (element: ActiveElement) => {
    setActiveElement(element);

    selectedShapeRef.current = element?.value as string;
  };

  useEffect(() => {
    const canvas = initializeFabric({
      canvasRef,
      fabricRef,
    });

    canvas.on("mouse:down", (options) => {
      handleCanvasMouseDown({
        options,
        canvas,
        isDrawing,
        shapeRef,
        selectedShapeRef,
      });
    });

    window.addEventListener("resize", () => {
      handleResize({ fabricRef });
    });
  }, [shapeRef, selectedShapeRef, fabricRef, canvasRef, isDrawing]);

  return (
    <main className="h-screen overflow-hidden text-white">
      {/* <h1 className="text-4xl">Collborative Canvas App</h1>
      <span>There are {others.length} other user(s) online</span> */}

      <Navbar
        activeElement={activeElement}
        handleActiveElement={handleActiveElement}
      />
      <section className="h-full flex">
        <LeftSidebar />
        <Live canvasRef={canvasRef} />
        <RightSidebar />
      </section>
    </main>
  );
}
