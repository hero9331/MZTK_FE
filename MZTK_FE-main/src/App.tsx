import { Layout } from "@components/layout";
import { Err401, Home, Login } from "@pages";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* Home */}
          <Route path="/" element={<Home />} />
          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/login-success" element={<Navigate to="/" replace />} />
          {/* Error */}
          <Route path="/auth/error" element={<Err401 />} />
          {/* fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
