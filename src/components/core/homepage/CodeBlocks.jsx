import React from "react";
import { TypeAnimation } from "react-type-animation";

const CodeBlocks = ({
  top,
  left,
  codeblock,
  image,
  rotate
}) => {
  return (
    <div className="leading-none relative max-w-[100vw]">
      {/* Display the running text image */}
      <img src={image} alt="running text image" className="h-[400px] w-[500px]" />

      {/* Container for code block with line numbers */}
      <div className={`h-fit code-border flex flex-row py-3 text-[10px] sm:text-sm sm:leading-6 r w-[100%] lg:w-[470px] absolute ${top} ${left} ${rotate}`}>
        
        {/* Indexing for line numbers */}
        <div className="text-center flex flex-col leading-none w-[5%] select-none text-richblack-400 font-inter font-bold text-[8px]  ">
          <p>1</p>
          <p>2</p>
          <p>3</p>
          <p>4</p>
          <p>5</p>
          <p>6</p>
          <p>7</p>
          <p>8</p>
          <p>9</p>
          <p>10</p>
          <p>11</p>
        </div>

        {/* Display the code with animation */}
        <div className={`w-[95%] flex flex-col leading-none  font-bold font-mono text-black text-[8px] `}>
          {/* TypeAnimation component to animate the code */}
          <TypeAnimation
            sequence={[codeblock, 1000, ""]}
            cursor={true}
            repeat={Infinity}
            style={{
              whiteSpace: "pre-line",
              display: "block",
            }}
            omitDeletionAnimation={true}
          />
        </div>
      </div>
    </div>
  );
};

export default CodeBlocks;
