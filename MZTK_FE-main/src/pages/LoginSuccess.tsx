import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const LoginSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        // 백엔드에서 리다이렉트 시 전달해준 토큰 파라미터 이름 확인 필요 (예: token, accessToken)
        const accessToken = searchParams.get("accessToken") || searchParams.get("token");
        const refreshToken = searchParams.get("refreshToken");

        if (accessToken) {
            // 로컬 스토리지에 토큰 저장 (useAuth 및 client.ts와 키 이름 통일: authToken)
            localStorage.setItem("authToken", accessToken);
            if (refreshToken) {
                localStorage.setItem("refreshToken", refreshToken);
            }

            console.log("Login successful, tokens saved.");

            // 메인 페이지 또는 이전 페이지로 이동
            navigate("/exchange", { replace: true });
        } else {
            console.error("No access token found in URL parameters");
            console.log("Current SearchParams:", searchParams.toString());
            // 에러 처리가 필요하면 /auth/error 등으로 이동
            // navigate("/auth/error", { replace: true });
        }
    }, [searchParams, navigate]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
            <h2 className="text-xl font-bold">로그인 처리 중...</h2>
            <p className="text-gray-500">잠시만 기다려 주세요.</p>

            <button
                onClick={() => navigate("/")}
                className="px-4 py-2 text-sm text-white bg-blue-500 rounded hover:bg-blue-600 transition"
            >
                로그인 화면으로 돌아가기
            </button>
        </div>
    );
};

export default LoginSuccess;
