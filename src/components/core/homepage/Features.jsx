
import React from 'react';
import dottedrows from "../../../assets/images/feature-section1-dottedrows.png"
import FeatureCard from './FeatureCard';

const Features = () => {
 

  return (
    <div className="bg-white relative">
    <div className="relative w-11/12 max-w-[1080px] mx-auto pt-4">
        <img src={dottedrows} alt=""
        className="absolute w-[233px] left-[300px] -top-[6rem] z-10" />
        <img src={dottedrows} alt=""
        className="absolute w-[233px] -right-[3.5rem] -top-[6rem] z-10" />

        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-4 relative z-[100]">
           
            <div className="relative flex items-center z-0">
                <h2
                className="text-deepBlueHead font-mullish font-extrabold text-4xl leading-[3.375rem]"
                >Why  <br/>
                    <span className="text-lightBlue500">
                        CodeMate?
                    </span>
                </h2>
            </div>
            <FeatureCard title={"Real-time Collaboration"} desc={"Work together seamlessly on code with instant updates for efficient and synchronized development."} />
            <FeatureCard title={"Multi-language Support"} desc={"CodeMate supports various programming languages, providing flexibility for diverse coding projects."} />
            <FeatureCard title={"Code Compilation"} desc={"Instantly compile and execute code, facilitating quick testing and debugging for efficient development."} />
            <FeatureCard title={"Chat Integration"} desc={"Communicate effortlessly within the platform, enhancing team coordination and project discussion."} />
            <FeatureCard title={"Intuitive Interface"} desc={"Streamlined design for a user-friendly experience, fostering productivity and focused coding."} />
       
           
        </div>
    </div>
</div>
    
     
  );
};

export default Features;
