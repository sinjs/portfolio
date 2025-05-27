export type WindowId = string;
export type NewWindow = Omit<Window, "id" | "position"> & {
  id?: WindowId;
  initialX?: number;
  initialY?: number;
};

export type Window = {
  id: WindowId;
  title: string;
  position: WindowPosition;
};

export type WindowPosition = {
  x: number;
  y: number;
  prevX: number;
  prevY: number;
};
