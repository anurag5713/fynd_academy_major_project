import signupImg from "../assets/computer.jpg"
import Template from "../components/core/Auth/Template"

function Signup() {
  return (
    <Template
      title="Join CodeMate  and Elevate Your Coding Experience!"
      description1="Ready to revolutionize the way you code?"
      description2=" Sign up now and become part of the CodeMate community. "
      image={signupImg}
      formType="signup"
    />
  )
}

export default Signup
