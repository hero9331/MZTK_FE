import { VoucherTest } from "@components/home";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="">
      <VoucherTest />
      <button
        className="bg-main p-2 m-2"
        type="button"
        onClick={() => navigate("/login")}
      >
        로그인 실험 페이지로 이동하기 &gt;
      </button>
    </div>
  );
};

export default Home;
