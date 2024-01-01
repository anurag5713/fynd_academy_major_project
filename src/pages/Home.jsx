import React from "react";
import user1 from "../assets/user1.jpg";
import user2 from "../assets/user4.jpg";
import shape from "../assets/hero-shape.svg";

import CodeBlocks from "../components/core/homepage/CodeBlocks";
import Features from "../components/core/homepage/Features";
import HighlightText from "../components/core/homepage/HighlightText";
import CodeSection from "../components/core/homepage/CodeSection";
import Button from "../components/core/homepage/Button";

const Home = () => {
  return (
    <div className="max-w-[100vw] relative">
      {/* hero section  */}
      <div className=" bg-richblack-900">
        <div className="relative mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 text-white ">
          <div className="text-center text-4xl font-semibold mt-16">
            Elevate your coding experience with{" "}
            <HighlightText text={"CodeMate"} />
          </div>
          <div className="-mt-8 w-[90%] text-center text-2xl font-bold text-richblack-300">
            A real-time collaborative code editor
          </div>

          <div className="-mt-3 w-[90%] text-center text-lg font-bold text-richblack-300">
            Simplify teamwork, boost productivity, and code seamlessly together.
            Start your collaborative coding journey today.
          </div>
          <Button linkto={"/login"}>Start Now</Button>

          <div className="flex mb-16 mt-8 gap-x-28">
            <div className="mx-3 my-7 shadow-[10px_-5px_50px_-5px] shadow-blue-200">
              <CodeBlocks
                codeblock={`import React from "react";\n import CTAButton from "./Button";\nimport TypeAnimation from "react-type";\nimport { FaArrowRight } from "react-icons/fa";\nconst Home = () => {\nreturn (\n<div>Home</div>\n)\n}\nexport default Home;`}
                image={user1}
                top={"top-20"}
                left={"left-16"}
                rotate={"-rotate-12 "}
              />
            </div>
            <div className="mx-3 my-7 shadow-[10px_-5px_50px_-5px] shadow-blue-200">
              <CodeBlocks
                codeblock={`import React from "react";\n import CTAButton from "./Button";\nimport TypeAnimation from "react-type";\nimport { FaArrowRight } from "react-icons/fa";\nconst Home = () => {\nreturn (\n<div>Home</div>\n)\n}\nexport default Home;`}
                image={user2}
                top={"top-16"}
                left={"left-20"}
                rotate={"-rotate-6"}
              />
            </div>
          </div>
        </div>
      </div>
      <img
        src={shape}
        alt="shape image"
        className="w-[100%]  z-50 absolute top-[765px]"
      />
      <div className="mt-32 relative ">
        <img
          src={shape}
          alt="shape image"
          className="w-[100%]  z-50 absolute rotate-180 top-[610px] "
        />
        <Features />
      </div>
      <div className="mt-40">
        <CodeSection />
      </div>
    </div>
  );
};

export default Home;
