import Lottie from "lottie-react";
import bubble from "@assets/speechbubble.json";

const Err401 = () => {
  return (
    <div className="flex flex-col flex-1 items-center justify-center text-center mx-auto w-[calc(100%-40px)] gap-y-[20px]">
      <Lottie
        animationData={bubble}
        style={{ width: "150px", height: "150px" }}
      />
      <div className="title font-bold">
        로그인 정보가 없습니다. <br /> 다시 로그인해주세요
      </div>
    </div>
  );
};

export default Err401;
