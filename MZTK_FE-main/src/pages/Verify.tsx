import { useState } from "react";
import { redeemVoucher } from "../utils/voucher";

const Verify = () => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRedeem = async () => {
    if (!code) return alert("코드를 입력하세요");
    setLoading(true);
    try {
      await redeemVoucher(code);
      alert("🎉 축하합니다! 토큰이 지갑으로 들어왔습니다.");
      setCode(""); // 입력창 비우기
    } catch (error: any) {
      console.error(error);
      // 에러 메시지 분석
      if (error.message.includes("executed")) alert("❌ 이미 사용된 코드입니다.");
      else alert("❌ 코드가 틀렸거나 처리에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-6">
      <h1 className="text-2xl font-bold text-green-600">손님 바우처 교환</h1>
      <div className="flex flex-col gap-3 w-72">
        <input
          className="border p-3 rounded border-gray-300 focus:outline-green-500"
          placeholder="받은 쿠폰 코드 입력"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button
          onClick={handleRedeem}
          disabled={loading}
          className={`py-3 rounded font-bold text-white transition ${
            loading ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {loading ? "처리 중..." : "토큰 받기"}
        </button>
      </div>
    </div>
  );
};

export default Verify;