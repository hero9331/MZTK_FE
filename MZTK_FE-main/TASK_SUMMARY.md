# 🚀 과제 수행 요약 보고서

## 1. � OAuth (Social Login) 구현
사용자 편의성을 위해 카카오와 구글 로그인을 구현하고, 백엔드 연동을 완료했습니다.

### 🔄 동작 프로세스
1. **OAuth 인증**: 프론트엔드에서 카카오/구글 SDK 또는 리다이렉트 방식을 통해 인가 코드를 받습니다.
2. **백엔드 검증**: `/api/auth/login/{provider}` 엔드포인트로 코드를 전달합니다.
3. **JWT(로그인) 토큰 발급**: 백엔드는 소셜 제공자와 통신하여 유저를 확인하고 서비스 전용 **JWT(인증 토큰)**를 발급합니다.

### 📄 주요 코드
- **`src/services/auth.ts`**: `GetKakaoLogin`, `GetGoogleLogin` 함수로 API 통신
- **`src/pages/Login.tsx`**: 소셜 로그인 버튼 UI 및 이벤트 핸들링

---

## 2. �🔐 Wallet Auth (OAuth 스타일 지갑 로그인)
백엔드(`WalletAuthController`)의 Challenge-Response 보안 구조를 프론트엔드에 완벽하게 연동했습니다.

### 🔄 동작 프로세스
1. **Challenge 요청**: 사용자의 지갑 주소를 서버로 보냅니다. (`/api/auth/wallet/challenge`)
2. **서명(Signature)**: 서버로부터 받은 랜덤 메시지를 표준 지갑 서명 방식(Personal Sign)으로 서명합니다.
3. **검증 및 토큰 발급**: 서명 결과와 주소를 서버로 보내 검증받고, 성공 시 **JWT 토큰**을 발급받아 저장합니다. (`/api/auth/wallet/login`)

### 📄 주요 코드 (Frontend)
- **`src/services/auth.ts`**: Axios를 통한 백엔드 API 통신 함수 추가
- **`src/hooks/useAuth.ts`**: 위 API들을 엮어 로그인 상태(`isAuthenticated`, `token`)를 관리하는 Hook

---

## 2. 🔌 Provider 주입 (EIP-6963) 적용
기존 `window.ethereum` 의존성을 제거하고, 다중 지갑 충돌을 방지하는 최신 표준 **EIP-6963**을 적용했습니다.

### ✅ 특징
- **자동 감지**: 브라우저에 설치된 호환 지갑(MetaMask, Rabby, Coinbase 등)을 자동으로 리스트업합니다.
- **충돌 방지**: 여러 지갑이 동시에 설치되어 있어도 사용자가 명시적으로 선택할 수 있습니다.

### 📄 주요 코드
- **`src/hooks/useEIP6963.ts`**: `eip6963:announceProvider` 이벤트를 구독하여 지갑 목록을 실시간 업데이트

---

## 3. 🛠 Custom Hook 모듈화
UI 컴포넌트 간결화를 위해 핵심 로직을 커스텀 훅으로 분리했습니다.

| Hook 이름 | 기능 설명 |
| :--- | :--- |
| **`useWallet`** | 지갑 연결, 해제, 계정(Account) 및 체인(ChainId) 상태 관리 |
| **`useAuth`** | 지갑 서명 로그인, 로그아웃, JWT 토큰 관리 |
| **`useContract`** | 스마트 컨트랙트 연결 인스턴스 생성 (Ethers.js v6) |
| **`useUserGrade`** | 유저 등급 조회 (컨트랙트 직접 호출) |
| **`useMZTT`** | MZTT 토큰 잔액 조회 (ERC20 표준) |

---

## 4. ⛓ Smart Contract Direct Read (B/E 우회)
데이터의 무결성을 위해 **유저 등급**과 **MZTT 토큰** 정보는 백엔드 DB가 아닌 **블록체인(Smart Contract)에서 직접 조회**합니다.

### 💎 유저 등급 (`useUserGrade`)
- 백엔드 API를 타지 않고, 클라이언트(브라우저)가 RPC 노드를 통해 직접 컨트랙트의 `getUserGrade` 함수를 호출합니다.
- **장점**: 서버 장애와 무관하게 데이터 조회가 가능하며, 온체인 데이터의 신뢰성을 보장합니다.

### 💰 MZTT 토큰 잔액 (`useMZTT`)
- 표준 **ERC-20** 인터페이스를 사용합니다.
- `balanceOf(address)`를 직접 호출하여 실시간 잔액을 가져옵니다.
- `decimals()`를 자동 조회하여 사람이 읽기 쉬운 단위로 변환 로직이 포함되어 있습니다.
