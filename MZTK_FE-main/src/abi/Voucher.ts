// 파일 경로: src/abi/Voucher.ts
// ⚠️ 반드시 export const VOUCHER_ABI = [...] 형태여야 합니다.

export const VOUCHER_ABI = [
  "function issueVoucher(bytes32 codeHash, uint256 amount) external",
  "function redeemVoucher(bytes32 codeHash) external",
  "function rewardToken() view returns (address)"
];