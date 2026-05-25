import { BrowserRouter } from "react-router-dom";
import { QueryProvider } from "./providers/QueryProvider";
import { AppRoutes } from "./routes/AppRoutes";

function App() {
  return (
    <QueryProvider>
      <BrowserRouter basename={import.meta.env.VITE_BASE_PATH || "/"}>
        <AppRoutes />
      </BrowserRouter>
    </QueryProvider>
  );
}

export default App;