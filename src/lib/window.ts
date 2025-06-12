import type { ReactNode } from "react";

export type WindowId = string;
export type NewWindow = Omit<Window, "id" | "position" | "size"> & {
  id?: WindowId;
  initialX?: number;
  initialY?: number;
  initialWidth?: number;
  initialHeight?: number;
};

export type Window = {
  id: WindowId;
  title: string;
  content: ReactNode;
  position: WindowPosition;
  size: WindowSize;
};

export type WindowSize = {
  width: number;
  height: number;
};

export type WindowPosition = {
  x: number;
  y: number;
  prevX: number;
  prevY: number;
};
