import { useState } from 'react'
import uniqid from 'uniqid'
import './Register.scss'

const Register = () => {

  const [userName, setUserName] = useState("")

  const onEnterClick = (e) => {
    const key = e.keyCode || e.which

    if (!userName) return

    if (key === 13) {
      const user = {
        name: userName,
        userId: uniqid()
      }
      localStorage.setItem("userData", JSON.stringify(user))
      window.location.reload()
    }
  }

  return (
    <div className="register">
      <p>
        Welcome to the Chat Room! <br />
        <small>Enter your Pen Name and press enter!!</small>
      </p>
      <input
        autoFocus
        name="register"
        onChange={(e) => setUserName(e.target.value)}
        value={userName}
        onKeyUp={onEnterClick}
      />
    </div>
  )
}

export default Register
