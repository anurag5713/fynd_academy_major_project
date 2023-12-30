import loginImg from "../assets/computer.png"
import Template from "../components/core/Auth/Template"

function Login() {
  return (
    <Template
      title="Welcome Back"
      description1="Experience the world of"
      description2="Collbrative Coding with CodeMate"
      image={loginImg}
      formType="login"
    />
  )
}

export default Login
