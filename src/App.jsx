import { useState } from "react";
import Login from "./pages/Login"

export default function App() {

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  return (
    <>
      <Login
        email={email}
        setEmail={setEmail}
        pass={pass}
        setPass={setPass}
      />
    </>
  )
}


