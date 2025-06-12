import { Window } from "./components/window";
import { useWindowManager } from "./hooks/use-window-manager";
import { cn } from "./lib/utils";

/*
function ProjectsWindow() {
  return (
    <div className="grid grid-cols-3 p-3 gap-3">
      <div>1</div>
      <div>2</div>
      <div>3</div>
      <div>1</div>
      <div>2</div>
      <div>3</div>
      <div>1</div>
      <div>2</div>
      <div>3</div>
    </div>
  );
}
*/

function AboutWindow() {
  return (
    <div className="flex flex-col justify-between h-full p-3">
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-bold">Welcome!</h1>
        <p className="text-sm">
          I'm <strong>sin</strong>, a developer focusing on low-level software
          and full-stack web development.
        </p>
        <p className="text-sm">
          You can find me on{" "}
          <a
            className="font-bold underline"
            href="https://github.com/sinjs"
            target="_blank"
          >
            GitHub
          </a>
          .
        </p>
        <div className="flex gap-2 pt-1">
          <button
            className="border crt border-glow px-2 py-1 text-sm"
            onClick={() => {}}
          >
            Projects
          </button>
          <button className="border crt border-glow px-2 py-1 text-sm">
            Languages
          </button>
        </div>
      </div>
      <div>
        {/* HACK: To get the glowing effect, you have to do this for some reason */}
        <p className="select-none -ml-1 " style={{ letterSpacing: -5 }}>
          -----------------------------------------------------------------------------------------------------------------------------
        </p>
        <p className="text-xs">
          This website is still under construction.{" "}
          <a
            className="font-bold underline"
            href="https://github.com/sinjs/portfolio"
            target="_blank"
          >
            Source Code
          </a>
        </p>
      </div>
    </div>
  );
}
function App() {
  // HACK: fix this please
  const {
    windows,
    unorderedWindows,
    createWindow,
    closeWindow,
    focusWindow,
    onTitlePointerDown,
    onWindowPointerDown,
  } = useWindowManager({
    initialWindows: [
      {
        title: "About",
        content: <AboutWindow />,

        initialX: window.innerWidth / 2 - 300,
        initialY: window.innerHeight / 2 - 150 - 48,
      },
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
            onWindowPointerDown={(e) => onWindowPointerDown(window.id, e)}
            style={{ zIndex: index + 1 }}
          >
            {window.content}
          </Window>
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
                content: <p>Example</p>,
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
