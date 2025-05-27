import { useImmer } from "use-immer";
import type { NewWindow, Window, WindowId } from "../lib/window";
import type { MouseEvent } from "react";

export type WindowManagerOptions = {
  initialWindows?: NewWindow[];
  initialFocus?: WindowId;
};

function constructWindow(newWindow: NewWindow): Window {
  return {
    id: newWindow.id ?? crypto.randomUUID(),
    title: newWindow.title,
    position: {
      x: newWindow.initialX ?? 0,
      y: newWindow.initialY ?? 0,
      prevX: 0,
      prevY: 0,
    },
  };
}

export function useWindowManager({
  initialFocus,
  ...options
}: WindowManagerOptions) {
  const initialWindows =
    options.initialWindows?.map((window, index, windows) => {
      if (window.id && windows.slice(0, index).some((w) => w.id === window.id))
        throw new Error(`Window with ID ${window.id} already exists.`);

      return constructWindow(window);
    }) ?? [];

  const [windows, setWindows] = useImmer<Window[]>(initialWindows);
  const [windowOrder, setWindowOrder] = useImmer<WindowId[]>(
    (initialFocus
      ? [...initialWindows].sort((a) => (a.id === initialFocus ? 1 : 0)) // Place the initial focused window at the end of the array
      : initialWindows
    ).map((w) => w.id)
  );

  function hasWindow(id: WindowId) {
    return windows.some((w) => w.id === id);
  }

  function getWindow(id: WindowId) {
    return windows.find((w) => w.id === id) ?? null;
  }

  function createWindow(newWindow: NewWindow) {
    if (newWindow.id && hasWindow(newWindow.id))
      throw new Error(`Window with ID ${newWindow.id} already exists.`);

    const window = constructWindow(newWindow);

    setWindowOrder((windowOrder) => {
      windowOrder.push(window.id);
    });
    setWindows((windows) => {
      windows.push(window);
    });
  }

  function closeWindow(id: WindowId) {
    setWindows((windows) => {
      const index = windows.findIndex((window) => window.id === id);
      if (index !== -1) windows.splice(index, 1);
    });
    setWindowOrder((windowOrder) => {
      const index = windowOrder.findIndex((windowId) => windowId === id);
      windowOrder.splice(index, 1);
    });
  }

  function focusWindow(id: WindowId) {
    setWindowOrder((windowOrder) => {
      const index = windowOrder.findIndex((windowId) => windowId === id);
      windowOrder.splice(index, 1);
      windowOrder.push(id);
    });
  }

  function onTitlePointerDown(id: WindowId, e: MouseEvent) {
    setWindows((windows) => {
      const draft = windows.find((w) => w.id === id)!.position;
      draft.prevX = e.clientX;
      draft.prevY = e.clientY;
    });

    const handlePointerMove = (e: PointerEvent) => {
      setWindows((windows) => {
        const draft = windows.find((w) => w.id === id)!.position;
        const deltaX = e.clientX - draft.prevX;
        const deltaY = e.clientY - draft.prevY;
        draft.x += deltaX;
        draft.y += deltaY;
        draft.prevX = e.clientX;
        draft.prevY = e.clientY;
      });
    };

    const handlePointerUp = () => {
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerup", handlePointerUp);
    };

    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", handlePointerUp);
  }

  return {
    unorderedWindows: windows,
    windows: windowOrder
      .map((id) => getWindow(id))
      .filter((window) => window !== null),
    getWindow,
    createWindow,
    closeWindow,
    focusWindow,
    onTitlePointerDown,
  };
}
