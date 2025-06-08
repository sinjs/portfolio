import { Window } from "./components/window";
import { useWindowManager } from "./hooks/use-window-manager";
import { cn } from "./lib/utils";

function App() {
  const {
    windows,
    unorderedWindows,
    createWindow,
    closeWindow,
    focusWindow,
    onTitlePointerDown,
  } = useWindowManager({
    initialWindows: [
      { id: "hello", title: "Hello" },
      { title: "World", initialX: 300, initialY: 100 },
      { title: "Three", initialX: 600, initialY: 300 },
    ],
  });

  return (
    <div className="h-screen w-screen overflow-hidden relative bg-black text-green-500 text-glow font-mono text-shadow-md crt">
      {windows.map((window, index) => {
        const focused = windows[windows.length - 1].id === window.id;

        return (
          <Window
            key={window.id}
            window={window}
            focused={focused}
            onClose={() => closeWindow(window.id)}
            onMouseDown={() => focusWindow(window.id)}
            onTitlePointerDown={(e) => onTitlePointerDown(window.id, e)}
            style={{ zIndex: index + 1 }}
          />
        );
      })}
      <div
        className="absolute bottom-0 w-full h-12 bg-black crt"
        style={{ zIndex: windows.length + 1 }}
      >
        <div className="w-full bg-green-500 border-glow h-px absolute"></div>
        <div className="h-full w-full flex items-center p-1 gap-1">
          <button
            className="h-10 w-10 flex justify-center items-center bg-green-500/20 text-glow text-xl border border-glow"
            onClick={() =>
              createWindow({
                title: "Example",
                initialX: Math.floor(Math.random() * window.innerWidth),
                initialY: Math.floor(Math.random() * (window.innerHeight - 40)),
              })
            }
          >
            +
          </button>
          {unorderedWindows.map((window) => {
            const focused = windows[windows.length - 1].id === window.id;
            return (
              <button
                className={cn(
                  "h-10 w-10 flex justify-center items-center text-glow border border-glow",
                  focused && "bg-green-500/10"
                )}
                onClick={() => focusWindow(window.id)}
              >
                {window.title[0]}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
