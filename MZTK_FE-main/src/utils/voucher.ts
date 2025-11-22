// 파일 경로: src/utils/voucher.ts
import { ethers, toUtf8Bytes, hexlify } from "ethers";

// 🔴 [핵심 수정] index.ts를 거치지 않고, 방금 만든 1번 파일을 직접 가리킵니다.
import { VOUCHER_ABI } from "../abi/Voucher";

const VOUCHER_ADDRESS = import.meta.env.VITE_VOUCHER_ADDRESS;

// 메타마스크 Provider 가져오기 & 네트워크 체크 함수
const getProviderAndSigner = async () => {
  if (!window.ethereum) throw new Error("메타마스크가 설치되지 않았습니다.");

  const provider = new ethers.BrowserProvider(window.ethereum);
  const network = await provider.getNetwork();

  // Sepolia(11155111)가 아니면 강제 전환 시도
  if (network.chainId.toString() !== "11155111") {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0xaa36a7" }], // Sepolia Chain ID
      });
    } catch (e) {
      throw new Error("Sepolia 네트워크로 변경해주세요.");
    }
  }
  return provider.getSigner(); // 서명자 반환
};

// 문자열 -> Bytes32 (0x...) 변환 함수 (패딩 포함)
const stringToBytes32 = (str: string) => {
  const bytes = toUtf8Bytes(str);
  if (bytes.length > 32) throw new Error("코드는 32바이트(영문 32자)를 넘을 수 없습니다.");
  const padded = new Uint8Array(32);
  padded.set(bytes);
  return hexlify(padded);
};

// 1. 바우처 발급 함수
export const issueVoucher = async (code: string, amountStr: string) => {
  const signer = await getProviderAndSigner();
  const contract = new ethers.Contract(VOUCHER_ADDRESS, VOUCHER_ABI, signer);

  const codeBytes32 = stringToBytes32(code);
  const amount = ethers.parseUnits(amountStr, 18); // MZTT는 18자리라고 가정

  const tx = await contract.issueVoucher(codeBytes32, amount);
  await tx.wait(); // 트랜잭션 완료 대기
  return tx;
};

// 2. 바우처 사용(수령) 함수
export const redeemVoucher = async (code: string) => {
  const signer = await getProviderAndSigner();
  const contract = new ethers.Contract(VOUCHER_ADDRESS, VOUCHER_ABI, signer);

  const codeBytes32 = stringToBytes32(code);

  const tx = await contract.redeemVoucher(codeBytes32);
  await tx.wait();
  return tx;
};