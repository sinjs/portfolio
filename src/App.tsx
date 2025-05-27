import { Window } from "./components/window";
import { useWindowManager } from "./hooks/use-window-manager";

function App() {
  const { windows, closeWindow, focusWindow, onTitlePointerDown } =
    useWindowManager({
      initialWindows: [
        { id: "hello", title: "Hello" },
        { title: "World", initialX: 300, initialY: 100 },
        { title: "Three", initialX: 600, initialY: 300 },
      ],
    });

  return (
    <div className="h-screen w-screen overflow-hidden relative bg-black text-green-500 text-glow font-mono text-shadow-md">
      {windows.map((window, index) => {
        return (
          <Window
            key={window.id}
            title={window.title}
            onClose={() => closeWindow(window.id)}
            onMouseDown={() => focusWindow(window.id)}
            onTitlePointerDown={(e) => onTitlePointerDown(window.id, e)}
            position={window.position}
            style={{ zIndex: index + 1 }}
          />
        );
      })}
    </div>
  );
}

export default App;
