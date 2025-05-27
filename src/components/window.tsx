import { forwardRef, type MouseEvent, type ReactNode } from "react";

import xIcon from "../assets/x.png";
import { cn } from "../lib/utils";
import type { WindowPosition } from "../lib/window";

export const Window = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    position: WindowPosition;
    title?: string;
    children?: ReactNode;
    onClose?: () => unknown;
    onTitlePointerDown?: (e: MouseEvent) => unknown;
  }
>(
  (
    {
      position,
      title,
      children,
      onClose,
      onTitlePointerDown,
      className,
      style,
      ...props
    },
    ref
  ) => {
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
          onPointerDown={onTitlePointerDown}
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
        <div className="p-3">{children}</div>
      </div>
    );
  }
);
