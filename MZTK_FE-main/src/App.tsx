import { Layout } from "@components/layout";
// My와 Verify가 추가되었습니다.
import { Err401, Home, Login, My, Verify } from "@pages";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* Home */}
          <Route path="/" element={<Home />} />

          {/* Voucher Routes (새로 추가됨) */}
          <Route path="/my" element={<My />} />       {/* 발급 페이지 */}
          <Route path="/verify" element={<Verify />} /> {/* 수령 페이지 */}

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