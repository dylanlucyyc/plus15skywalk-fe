import "./App.css";
import Router from "./routes/";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Router />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
