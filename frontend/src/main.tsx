import "./index.css";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "boxicons/css/boxicons.min.css";
import "./interceptors/interceptors.ts";
import { SignupProvider } from "./contexts/signupContext.tsx";



createRoot(document.getElementById('root')!).render(
  <SignupProvider>
    <App/>
  </SignupProvider>
)