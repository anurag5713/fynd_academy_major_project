import React from "react";
import { NavLink } from "react-router-dom";
import { Link } from "react-router-dom";
import HighlightText from "../core/homepage/HighlightText"

const Navbar = () => {
  const token = null;
  return (
    <div className="bg-richblack-900 flex h-14 items-center justify-center border-b-[1px] border-b-richblack-600 text-white max-w[100vw]">
      <div className="flex w-11/12 max-w-maxContent items-center justify-between">
        <Link to="/">
          <HighlightText text={"CodeMate"} />
        </Link>

        <div className="flex gap-x-4">
          <NavLink to="/contact">Contact</NavLink>
          <NavLink to="/joinroom">JoinRoom</NavLink>
        </div>

        <div className="hidden items-center gap-x-4 md:flex">
          {token === null && (
            <Link to="/login">
              <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                Log in
              </button>
            </Link>
          )}
          {token === null && (
            <Link to="/signup">
              <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                Sign up
              </button>
            </Link>
          )}
          {token !== null && <ProfileDropdown />}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
