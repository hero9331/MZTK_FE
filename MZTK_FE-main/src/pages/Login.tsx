import React from "react";

const Login = () => {
  // 1. 환경변수에서 키값 가져오기
  const KAKAO_REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;
  // 백엔드에서 설정한 리다이렉트 주소와 정확히 일치해야 합니다.
  const KAKAO_REDIRECT_URI = "http://localhost:8080/auth/login/kakao";

  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const GOOGLE_REDIRECT_URI = "http://localhost:8080/auth/login/google";

  // 2. 카카오 로그인 링크 생성
  const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_REST_API_KEY}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`;

  // 3. 구글 로그인 링크 생성
  const GOOGLE_AUTH_URL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_REDIRECT_URI}&response_type=code&scope=email profile`;

  // 4. 버튼 클릭 핸들러
  const handleKakaoLogin = () => {
    window.location.href = KAKAO_AUTH_URL;
  };

  const handleGoogleLogin = () => {
    window.location.href = GOOGLE_AUTH_URL;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-center">로그인</h1>

        <div className="flex flex-col gap-4">
          {/* 카카오 버튼 */}
          <button
            onClick={handleKakaoLogin}
            className="px-6 py-3 font-bold text-black bg-[#FEE500] rounded-lg hover:bg-[#E6CF00] transition-colors"
          >
            카카오로 로그인하기
          </button>

          {/* 구글 버튼 */}
          <button
            onClick={handleGoogleLogin}
            className="px-6 py-3 font-bold text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
          >
            구글로 로그인하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;