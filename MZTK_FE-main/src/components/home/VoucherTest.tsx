import { useEffect, useState } from "react";
import { ethers, toUtf8Bytes, hexlify } from "ethers";
import { VOUCHER_ABI } from "@abi";

const VoucherTest = () => {
  const [account, setAccount] = useState<string>();
  const [voucherContract, setVoucherContract] = useState<ethers.Contract>();
  const [voucherCode, setVoucherCode] = useState<string>("");
  const [redeemCode, setRedeemCode] = useState<string>("");
  const [tokenBalance, setTokenBalance] = useState<string>("Loading...");

  // ✅ [수정됨] 문제 해결의 핵심: MZTT 토큰 주소 직접 지정
  const MZTT_TOKEN_ADDRESS = "0x10c274e66c5d92693b82def84b8617f7fe838460";
  const VOUCHER_ADDRESS = import.meta.env.VITE_VOUCHER_ADDRESS;

  useEffect(() => {
    const init = async () => {
      if (!window.ethereum) {
        alert("MetaMask를 설치해주세요!");
        return;
      }

      try {
        const provider = new ethers.BrowserProvider(window.ethereum);

        // 네트워크 체크 (Sepolia가 아니면 경고)
        const network = await provider.getNetwork();
        if (network.chainId.toString() !== "11155111") {
          alert("현재 Sepolia 네트워크가 아닙니다. 메타마스크에서 변경해주세요.");
        }

        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const userAddress = await signer.getAddress();
        setAccount(userAddress);

        // 바우처 컨트랙트 연결
        const voucher = new ethers.Contract(VOUCHER_ADDRESS, VOUCHER_ABI, signer);
        setVoucherContract(voucher);

        // ✅ [수정됨] rewardToken() 호출 대신, 위에서 정의한 진짜 주소를 사용
        const tokenContract = new ethers.Contract(
          MZTT_TOKEN_ADDRESS,
          ["function balanceOf(address) view returns (uint256)"],
          signer
        );

        // 바우처 컨트랙트의 MZTT 잔액 조회
        const balance = await tokenContract.balanceOf(VOUCHER_ADDRESS);
        setTokenBalance(ethers.formatUnits(balance, 18));

      } catch (err) {
        console.error(err);
        setTokenBalance("Error");
      }
    };

    init();
  }, [VOUCHER_ADDRESS]);

  const issueVoucher = async () => {
    if (!voucherContract || !voucherCode) return;

    const codeBytes = toUtf8Bytes(voucherCode);
    const padded = new Uint8Array(32);
    padded.set(codeBytes);
    const codeBytes32 = hexlify(padded);

    const amount = ethers.parseUnits("1", 18);

    try {
      const tx = await voucherContract.issueVoucher(codeBytes32, amount);
      await tx.wait();
      alert("Voucher issued successfully!");
      window.location.reload(); // 잔액 갱신을 위해 새로고침
    } catch (err: any) {
      alert("Issue failed: " + (err.message || "Unknown error"));
    }
  };

  const redeemVoucher = async () => {
    if (!voucherContract || !redeemCode) return;

    const codeBytes = toUtf8Bytes(redeemCode);
    const padded = new Uint8Array(32);
    padded.set(codeBytes);
    const codeBytes32 = hexlify(padded);

    try {
      const tx = await voucherContract.redeemVoucher(codeBytes32);
      await tx.wait();
      alert("Voucher redeemed successfully!");
      window.location.reload(); // 잔액 갱신을 위해 새로고침
    } catch (err: any) {
      alert("Redeem failed: " + (err.message || "Unknown error"));
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Voucher Dashboard</h2>
      <div className="text-sm text-gray-600 mb-4">
        <p>Connected account: {account}</p>
        <p>Voucher contract token balance: <span className="font-bold text-black">{tokenBalance} MZTT</span></p>
      </div>

      <div className="mt-4 p-4 border rounded shadow-sm bg-white">
        <h3 className="font-semibold mb-2">Issue Voucher</h3>
        <div className="flex">
          <input
            type="text"
            placeholder="Enter voucher code"
            value={voucherCode}
            onChange={(e) => setVoucherCode(e.target.value)}
            className="border p-2 mr-2 rounded flex-grow"
          />
          <button
            onClick={issueVoucher}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Issue 1 Token
          </button>
        </div>
      </div>

      <div className="mt-4 p-4 border rounded shadow-sm bg-white">
        <h3 className="font-semibold mb-2">Redeem Voucher</h3>
        <div className="flex">
          <input
            type="text"
            placeholder="Enter voucher code"
            value={redeemCode}
            onChange={(e) => setRedeemCode(e.target.value)}
            className="border p-2 mr-2 rounded flex-grow"
          />
          <button
            onClick={redeemVoucher}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Redeem
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoucherTest;