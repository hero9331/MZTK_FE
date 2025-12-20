import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { issueVoucher } from "../utils/voucher";
import { ethers } from "ethers";
import { useWallet, useMZTT, useUserGrade } from "@/hooks";

const My = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [amount, setAmount] = useState("1");
  const [voucherBalance, setVoucherBalance] = useState("Checking...");

  // Contracts
  const MZTT_TOKEN_ADDRESS = "0x10c274e66c5d92693b82def84b8617f7fe838460";
  // TODO: Replace with actual Grade Contract Address
  const GRADE_CONTRACT_ADDRESS = "0x1234567890123456789012345678901234567890";

  // Hooks
  const { account } = useWallet();
  const { balance: myMztt, loading: mzttLoading } = useMZTT(MZTT_TOKEN_ADDRESS);
  const { grade, loading: gradeLoading } = useUserGrade(GRADE_CONTRACT_ADDRESS);

  // Existing Logic: Check Voucher Contract Balance (사장님 잔액?)
  useEffect(() => {
    const checkVoucherBalance = async () => {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const tokenContract = new ethers.Contract(
          MZTT_TOKEN_ADDRESS,
          ["function balanceOf(address) view returns (uint256)"],
          provider
        );
        const addr = import.meta.env.VITE_VOUCHER_ADDRESS;
        if (addr) {
          try {
            const raw = await tokenContract.balanceOf(addr);
            setVoucherBalance(ethers.formatUnits(raw, 18));
          } catch (e) {
            console.error("잔액 조회 실패", e);
          }
        }
      }
    };
    checkVoucherBalance();
  }, []);

  const handleIssue = async () => {
    if (!code || !amount) return alert("코드와 수량을 입력하세요");
    try {
      await issueVoucher(code, amount);
      alert(`✅ 발급 성공! (${amount} MZTT)`);
      window.location.reload();
    } catch (error: any) {
      console.error(error);
      alert("❌ 발급 실패: " + (error.message || "Unknown error"));
    }
  };

  /* 3. New Logic: Transfer MZTT to Voucher Contract */
  const [transferAmount, setTransferAmount] = useState("100");

  const handleTransfer = async () => {
    if (!transferAmount) return alert("충전할 수량을 입력하세요");
    try {
      if (!window.ethereum) throw new Error("No Wallet found");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const tokenContract = new ethers.Contract(MZTT_TOKEN_ADDRESS, [
        "function transfer(address to, uint256 amount) public returns (bool)",
        "function decimals() view returns (uint8)"
      ], signer);

      // Decimals 조회 (usually 18)
      const decimals = await tokenContract.decimals();
      const amountWei = ethers.parseUnits(transferAmount, decimals);

      const voucherAddr = import.meta.env.VITE_VOUCHER_ADDRESS;
      if (!voucherAddr) throw new Error("Voucher Address not set");

      console.log(`Transferring ${transferAmount} MZTT to ${voucherAddr}`);

      const tx = await tokenContract.transfer(voucherAddr, amountWei);
      alert("전송 요청됨. 트랜잭션 대기 중...");
      await tx.wait();

      alert(`✅ ${transferAmount} MZTT 충전 완료!`);
      window.location.reload();

    } catch (e: any) {
      console.error(e);
      alert("❌ 전송 실패: " + (e.message || "Unknown error"));
    }
  };

  useEffect(() => {
    console.log("🔍 Checking Balance for:", account);
    console.log("🔍 Using Hash Token Address:", MZTT_TOKEN_ADDRESS);
  }, [account]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-6 p-4">

      {/* 1. User Info Section */}
      <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-md border border-blue-100">
        <h2 className="text-xl font-bold mb-4 text-gray-800">내 정보 (Blockchain)</h2>

        {!account ? (
          <p className="text-gray-500">지갑이 연결되지 않았습니다.</p>
        ) : (
          <div className="space-y-3">

            <div className="flex justify-between items-center bg-gray-50 p-3 rounded">
              <span className="text-gray-600 font-medium">보유 토큰 (Balance)</span>
              <span className="font-bold text-green-600">
                {mzttLoading ? "..." : myMztt} MZTT
              </span>
            </div>
            <div className="text-xs text-gray-400 text-right break-all">{account}</div>
          </div>
        )}
      </div>

      <hr className="w-full max-w-md border-gray-200" />

      {/* 2. Top Up Section (New) */}
      <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-md border border-green-100">
        <h2 className="text-lg font-bold mb-4 text-green-800">💰 바우처 충전</h2>
        <div className="flex gap-2">
          <input
            type="number"
            value={transferAmount}
            onChange={(e) => setTransferAmount(e.target.value)}
            className="flex-1 border p-2 rounded"
            placeholder="충전량"
          />
          <button
            onClick={handleTransfer}
            className="bg-green-600 text-white px-4 py-2 rounded font-bold hover:bg-green-700"
          >
            충전하기
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2">내 지갑의 MZTT &rarr; 바우처 컨트랙트</p>
      </div>


      {/* 3. Voucher Issue Section */}
      <div className="flex flex-col items-center gap-4 w-full max-w-md">
        <h1 className="text-2xl font-bold text-blue-600">바우처 발급</h1>

        <div className="bg-gray-100 p-4 rounded-lg text-center w-full shadow-sm">
          <p className="text-sm text-gray-500">발급 가능 예산 (Contract)</p>
          <p className="text-2xl font-bold text-gray-800">{voucherBalance} MZTT</p>
        </div>

        <div className="flex flex-col gap-3 w-full">
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

      {/* 4. Navigation to Home */}
      <button
        onClick={() => navigate("/exchange")}
        className="text-blue-500 underline text-sm mt-4 hover:text-blue-700"
      >
        바우처 교환소로 이동하기 &gt;
      </button>
    </div>
  );
};

export default My;