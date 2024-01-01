import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import HighlightText from "../core/homepage/HighlightText";
import { useDispatch, useSelector } from "react-redux";
import ProfileDropdown from "../core/Auth/ProfileDropdown";
import {logout} from "../../services/operations/authApi"

// Navbar component
const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile); 

  return (
    <div className="bg-richblack-900 flex h-14 items-center justify-center border-b-[1px] border-b-richblack-600 text-white max-w[100vw]">
      <div className="flex w-11/12 max-w-maxContent items-center justify-between">
        {/* Logo Link */}
        <Link to="/">
          <HighlightText text={"CodeMate"} />
        </Link>

        {/* Navigation Links */}
        <div className="flex gap-x-4">
          <NavLink to="/contact">Contact</NavLink>
          <NavLink to="/joinroom">JoinRoom</NavLink>
        </div>

       
        <div className="hidden items-center gap-x-4 md:flex">
          {/* Show Login button if not logged in */}
          {token === null && (
            <Link to="/login">
              <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                Log in
              </button>
            </Link>
          )}

          {/* Show Signup button if not logged in */}
          {token === null && (
            <Link to="/signup">
              <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                Sign up
              </button>
            </Link>
          )}

          {/* Show ProfileDropdown if logged in */}
          {token !== null && <ProfileDropdown />}
          {token !== null && <button  onClick={() => { dispatch(logout(navigate))}} className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">Logout</button>}

        </div>
      </div>
    </div>
  );
};

export default Navbar;
