import React from 'react'
import { Link } from 'react-router-dom'
import codeImage from "../../../assets/code.png"
import HighlightText from './HighlightText'
import Button from './Button'

const CodeSection = () => {
  return (
    <div className='flex -mt-8  bg-richblack-900 pt-8 pb-12 max-w-[100vw]'>
        <div className='w-[50%]  mx-16 my-7 shadow-[10px_-5px_50px_-5px] shadow-blue-200'>
            <img src={codeImage} className='h-[600px] w-[900px] '/>
        </div>
        <div className='text-center text-4xl font-semibold mt-16 text-white w-[50%] flex justify-center items-center flex-col '>
            <HighlightText text={"Code and collaborate"}/> anywhere, anytime in browser
            <p> Share a link of your code to get invite, either async or with a live coding session.</p>
            <div className='mt-16'>
              <Button children={"Join Now"} linkto={"/signup"} />
            </div>
            
        </div>
    </div>
  )
}

export default CodeSection