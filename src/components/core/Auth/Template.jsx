import { FcGoogle } from "react-icons/fc";
import { useSelector } from "react-redux";

import frameImg from "../../../assets/computer.png";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

// Template component
function Template({ title, description1, description2, image, formType }) {
  const { loading } = useSelector((state) => state.auth);

  return (
    <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center bg-richblack-900">
      {loading ? (
        // Loading Spinner
        <div className="spinner"></div>
      ) : (
        // Main Content Section
        <div className="mx-auto flex w-11/12 max-w-maxContent flex-col-reverse justify-between gap-y-12 py-12 md:flex-row md:gap-y-0 md:gap-x-12">
          {/* Left Content Section */}
          <div className="mx-auto w-11/12 max-w-[450px] md:mx-0">
            {/* Title */}
            <h1 className="text-[1.875rem] font-semibold leading-[2.375rem] text-richblack-5">
              {title}
            </h1>
            {/* Description */}
            <p className="mt-4 text-[1.125rem] leading-[1.625rem]">
              <span className="text-richblack-100">{description1}</span>{" "}
              <span className="font-edu-sa font-bold italic text-blue-100">
                {description2}
              </span>
            </p>
            {/* Render SignupForm or LoginForm based on formType */}
            {formType === "signup" ? <SignupForm /> : <LoginForm />}
          </div>

          {/* Right Content Section (Image) */}
          <div className="relative mx-auto w-11/12 max-w-[450px] md:mx-0">
            {/* Frame Image */}
            <img
              src={frameImg}
              alt="Pattern"
              width={558}
              height={504}
              loading="lazy"
            />
            {/* Students Image */}
            <img
              src={image}
              alt="Students"
              width={558}
              height={504}
              loading="lazy"
              className="absolute -top-4 right-4 z-10"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Template;
