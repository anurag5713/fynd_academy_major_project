import React,{useState} from 'react'
import bgImage from '../../../assets/images/instant-settlement-bg.svg';
import hoverBgImage from '../../../assets/images/instantsettlement-hoverbg.svg';
import cardImage from '../../../assets/images/razorpayXicon.svg';


const FeatureCard = ({title,desc}) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {
      setIsHovered(true);
    };
  
    const handleMouseLeave = () => {
      setIsHovered(false);
    };
  
    const cardStyle = `p-10 bg-[#fcfcff] bg-no-repeat transition-all duration-200 group 
      ${isHovered ? 'scale-105' : ''} ${isHovered ? 'hover:bg-[url(' + hoverBgImage + ')]' : ''}`;
  return (
    <div>
          <div
            className={cardStyle}
            style={{ backgroundImage: `url(${isHovered ? hoverBgImage : bgImage})` }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <img src={cardImage} alt="" className="w-10 h-10" />
            <h3 className="font-mullish text-lg font-bold pt-4">{title}</h3>
            <p className="font-mullish py-3 text-grayText leading-normal">
              {desc}
            </p>
            <div className="flex flex-row items-center cursor-pointer group">
              <a
                href=""
                className="font-mullish font-bold text-lightBlue500 group-hover:text-lightBlue
                      transition-all duration-200"
              >
                Know More
              </a>
              <i
                data-feather="chevron-right"
                className="w-5 h-5 text-lightBlue500 
                          group-hover:text-grayBlue transition-all duration-200"
              ></i>
            </div>
          </div>
        </div>
  )
}

export default FeatureCard