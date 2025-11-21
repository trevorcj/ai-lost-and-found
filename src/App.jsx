import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Signup from "./pages/Signup";
import LoginPage from "./pages/LoginPage";
import Feed from "./pages/Feed";

function App() {
  return (
    <AuthProvider>
      <div className="bg-(--bg-main) h-screen p-5 overflow-auto">
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
