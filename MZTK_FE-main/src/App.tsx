import { Layout } from "@components/layout";
// My와 Verify가 추가되었습니다.
import { Err401, Home, Login, My, Verify, LoginSuccess } from "@pages";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* Main Entry (Login) */}
          <Route path="/" element={<Login />} />

          {/* Core Feature (Voucher Exchange) */}
          <Route path="/exchange" element={<Home />} />

          {/* Voucher Routes */}
          <Route path="/my" element={<My />} />       {/* 발급 페이지 */}
          <Route path="/verify" element={<Verify />} /> {/* 수령 페이지 */}
          <Route path="/login-success" element={<LoginSuccess />} />

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