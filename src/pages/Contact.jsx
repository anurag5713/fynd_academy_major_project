import React from "react"
import ContactDetails from "../components/core/ContactUsForm/ContactDetails"
import ContactForm from "../components/core/ContactUsForm/ContactForm"

const Contact = () => {
  return (
    <div className="bg-black ">
      <div className="mx-auto mt-20 flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-white lg:flex-row ">
        {/* Contact Details */}
        <div className="lg:w-[40%]">
          <ContactDetails />
        </div>

        {/* Contact Form */}
        <div className="lg:w-[60%]">
          <ContactForm />
        </div>
      </div>
      {/* <Footer /> */}
    </div>
  )
}

export default Contact
