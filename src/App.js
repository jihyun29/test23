import Router from "./shared/Router";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="w-[100vw] h-[100vh] bg-black">
        <div className="flex flex-col justify-center items-center w-full h-full mx-auto bg-white">
          <Router />
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;
