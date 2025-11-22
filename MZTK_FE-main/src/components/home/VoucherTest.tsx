import { useEffect, useState } from "react";
import { ethers, toUtf8Bytes, hexlify } from "ethers";
import { VOUCHER_ABI } from "@abi"; // Voucher ABI를 import

const VoucherTest = () => {
  const [account, setAccount] = useState<string>();
  const [voucherContract, setVoucherContract] = useState<ethers.Contract>();
  const [voucherCode, setVoucherCode] = useState<string>("");
  const [redeemCode, setRedeemCode] = useState<string>("");
  const [tokenBalance, setTokenBalance] = useState<string>("0");

  const VOUCHER_ADDRESS = import.meta.env.VITE_VOUCHER_ADDRESS;

  useEffect(() => {
    const init = async () => {
      if (!window.ethereum) {
        alert("MetaMask를 설치해주세요!");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();
      setAccount(userAddress);

      const voucher = new ethers.Contract(VOUCHER_ADDRESS, VOUCHER_ABI, signer);
      setVoucherContract(voucher);

      const tokenAddress = await voucher.rewardToken();
      const tokenContract = new ethers.Contract(
        tokenAddress,
        ["function balanceOf(address) view returns (uint256)"],
        signer
      );
      const balance = await tokenContract.balanceOf(VOUCHER_ADDRESS);
      setTokenBalance(ethers.formatUnits(balance, 18));
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
      alert("Voucher issued!");
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert("Issue failed: " + err.message);
      } else {
        alert("Issue failed: Unknown error");
      }
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
      alert("Voucher redeemed!");
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert("Issue failed: " + err.message);
      } else {
        alert("Issue failed: Unknown error");
      }
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Voucher Dashboard</h2>
      <p>Connected account: {account}</p>
      <p>Voucher contract token balance: {tokenBalance}</p>

      <div className="mt-4">
        <h3 className="font-semibold">Issue Voucher</h3>
        <input
          type="text"
          placeholder="Enter voucher code"
          value={voucherCode}
          onChange={(e) => setVoucherCode(e.target.value)}
          className="border p-1 mr-2"
        />
        <button
          onClick={issueVoucher}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Issue 1 Token
        </button>
      </div>

      <div className="mt-4">
        <h3 className="font-semibold">Redeem Voucher</h3>
        <input
          type="text"
          placeholder="Enter voucher code"
          value={redeemCode}
          onChange={(e) => setRedeemCode(e.target.value)}
          className="border p-1 mr-2"
        />
        <button
          onClick={redeemVoucher}
          className="bg-green-500 text-white p-2 rounded"
        >
          Redeem
        </button>
      </div>
    </div>
  );
};

export default VoucherTest;
