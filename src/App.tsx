import { forwardRef, useState, type MouseEvent, type ReactNode } from "react";
import { useImmer } from "use-immer";

import xIcon from "./assets/x.png";
import { cn } from "./lib/utils";

const Window = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    title?: string;
    children?: ReactNode;
    onClose?: () => unknown;
    focused?: boolean;
  }
>(({ title, children, onClose, focused, className, style, ...props }, ref) => {
  const [position, setPosition] = useImmer({
    x: 50,
    y: 50,
    prevX: 0,
    prevY: 0,
  });

  const handlePointerDown = (e: MouseEvent) => {
    setPosition((draft) => {
      draft.prevX = e.clientX;
      draft.prevY = e.clientY;
    });

    const handlePointerMove = (e: PointerEvent) => {
      setPosition((draft) => {
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
  };

  return (
    <div
      ref={ref}
      className={cn(
        "absolute bg-black w-[600px] h-[300px] border-glow border",
        className
      )}
      {...props}
      style={{
        top: position.y,
        left: position.x,
        ...style,
      }}
    >
      <div
        className="h-9 w-full flex items-center justify-between"
        onPointerDown={handlePointerDown}
      >
        <span className="pl-3 select-none">{title}</span>
        <div className="flex h-full items-center gap-2">
          {onClose && (
            <div
              className="flex h-full items-center justify-center w-9"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => onClose()}
            >
              <img
                className="block h-2.5 w-2.5 drop-shadow-[0_0_5px]"
                draggable={false}
                src={xIcon}
              />
            </div>
          )}
        </div>
      </div>
      <div className="w-full bg-green-500 border-glow h-px absolute"></div>
      <div className="p-3">
        <pre>
          $ ls{"\n"}Hello World{"\n"}${" "}
        </pre>
      </div>
    </div>
  );
});

interface Window {
  id: number;
  title: string;
  focused: boolean;
}

function App() {
  const [windowOrder, setWindowOrder] = useImmer<number[]>([1, 2, 3]);
  const [windows, setWindows] = useImmer<Window[]>([
    { id: 1, focused: false, title: "First" },
    { id: 2, focused: true, title: "Second" },
    { id: 3, focused: false, title: "Third" },
  ]);

  function closeWindow(id: number) {
    setWindows((windows) => {
      const index = windows.findIndex((window) => window.id === id);
      if (index !== -1) windows.splice(index, 1);
    });
    setWindowOrder((windowOrder) => {
      const index = windowOrder.findIndex((windowId) => windowId === id);
      windowOrder.splice(index, 1);
    });
  }

  function focusWindow(id: number) {
    setWindows((windows) => {
      for (const window of windows) {
        window.focused = window.id === id;
      }
    });
    setWindowOrder((windowOrder) => {
      const index = windowOrder.findIndex((windowId) => windowId === id);
      windowOrder.splice(index, 1);
      windowOrder.push(id);
    });
  }

  return (
    <div className="h-screen w-screen overflow-hidden relative bg-black text-green-500 text-glow font-mono text-shadow-md">
      {windowOrder.map((windowId, index) => {
        const window = windows.find((w) => w.id === windowId);
        if (!window) return <></>;
        return (
          <Window
            key={window.id}
            title={window.title}
            onClose={() => closeWindow(window.id)}
            onMouseDown={() => focusWindow(window.id)}
            focused={window.focused}
            style={{ zIndex: index + 1 }}
          />
        );
      })}
    </div>
  );
}

export default App;
