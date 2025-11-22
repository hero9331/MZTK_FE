import { useState, useEffect } from "react";
import { issueVoucher } from "../utils/voucher";
import { ethers } from "ethers";

const My = () => {
  const [code, setCode] = useState("");
  const [amount, setAmount] = useState("1");
  const [balance, setBalance] = useState("Checking...");

  // 우리가 확인한 진짜 토큰 주소
  const MZTT_TOKEN_ADDRESS = "0x10c274e66c5d92693b82def84b8617f7fe838460";

  // 페이지 들어오자마자 잔액 확인
  useEffect(() => {
    const checkBalance = async () => {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const tokenContract = new ethers.Contract(
          MZTT_TOKEN_ADDRESS,
          ["function balanceOf(address) view returns (uint256)"],
          provider
        );
        // 내 지갑(바우처 컨트랙트) 주소의 잔액 조회
        const addr = import.meta.env.VITE_VOUCHER_ADDRESS;
        try {
          const raw = await tokenContract.balanceOf(addr);
          setBalance(ethers.formatUnits(raw, 18));
        } catch (e) {
          console.error("잔액 조회 실패", e);
        }
      }
    };
    checkBalance();
  }, []);

  const handleIssue = async () => {
    if (!code || !amount) return alert("코드와 수량을 입력하세요");
    try {
      // alert("지갑 서명 요청 중..."); // 너무 자주 뜨면 귀찮으니 제거 가능
      await issueVoucher(code, amount);
      alert(`✅ 발급 성공! (${amount} MZTT)`);
      window.location.reload(); // 잔액 갱신을 위해 새로고침
    } catch (error: any) {
      console.error(error);
      alert("❌ 발급 실패: " + (error.message || "Unknown error"));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-6">
      <h1 className="text-3xl font-bold text-blue-600">사장님 바우처 발급</h1>

      {/* 잔액 표시 카드 */}
      <div className="bg-gray-100 p-4 rounded-lg text-center w-64 shadow-sm">
        <p className="text-sm text-gray-500">현재 사용 가능 잔액</p>
        <p className="text-2xl font-bold text-gray-800">{balance} MZTT</p>
      </div>

      <div className="flex flex-col gap-3 w-64">
        <label className="text-sm font-semibold">바우처 코드</label>
        <input
          className="border p-3 rounded border-gray-300 focus:outline-blue-500"
          placeholder="예: SPECIAL_GIFT"
          onChange={(e) => setCode(e.target.value)}
        />

        <label className="text-sm font-semibold">지급 수량</label>
        <input
          className="border p-3 rounded border-gray-300 focus:outline-blue-500"
          type="number"
          placeholder="수량"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <button
          onClick={handleIssue}
          className="bg-blue-600 text-white py-3 rounded font-bold hover:bg-blue-700 transition mt-2"
        >
          바우처 발급하기
        </button>
      </div>
    </div>
  );
};

export default My;