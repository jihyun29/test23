import Router from "./shared/Router";

function App() {
  return (
    <div className="w-[100vw] h-[100vh] bg-black">
      <div className="flex flex-col justify-center items-center w-full h-full mx-auto bg-white">
        <Router />
      </div>
    </div>
  );
}

export default App;
