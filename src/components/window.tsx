import { forwardRef, type MouseEvent, type ReactNode } from "react";

import xIcon from "../assets/x.png";
import { cn } from "../lib/utils";
import type { Window as WindowType } from "../lib/window";

export const Window = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    window: WindowType;
    focused: boolean;
    children?: ReactNode;
    onClose?: () => unknown;
    onTitlePointerDown?: (e: MouseEvent) => unknown;
    onWindowPointerDown?: (e: MouseEvent) => unknown;
  }
>(
  (
    {
      window,
      focused,
      children,
      onClose,
      onTitlePointerDown,
      onWindowPointerDown,
      className,
      style,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn("absolute bg-black crt", className)}
        {...props}
        style={{
          top: window.position.y,
          left: window.position.x,
          width: window.size.width,
          height: window.size.height,
          ...style,
        }}
      >
        <div
          className={cn(
            focused ? "text-green-500" : "text-green-500/75",
            "border-glow border h-full flex flex-col"
          )}
        >
          <div
            className="h-9 w-full flex items-center justify-between"
            onPointerDown={onTitlePointerDown}
          >
            <span className="pl-3 select-none">{window.title}</span>
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
          <div
            className={cn(
              "w-full border-glow h-px",
              focused ? "bg-green-500" : "bg-green-500/75"
            )}
          ></div>
          <div className="grow">{children}</div>
        </div>
      </div>
    );
  }
);
