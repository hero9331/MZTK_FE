import { VoucherTest } from "@components/home";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="">
      <VoucherTest />

      <div className="flex">
        <button
          className="bg-gray-600 text-white p-2 m-2 rounded"
          type="button"
          onClick={() => navigate("/")}
        >
          로그인 페이지로<br />이동하기 &gt;
        </button>

        <button
          className="bg-blue-600 text-white p-2 m-2 rounded"
          type="button"
          onClick={() => navigate("/my")}
        >
          바우처 발급 페이지로 <br /> 이동하기 &gt;
        </button>
      </div>
    </div>
  );
};

export default Home;
