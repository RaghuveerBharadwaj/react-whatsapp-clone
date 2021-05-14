import './Chat.scss'
import { useEffect, useState } from 'react'
import axios from 'axios'

const Chat = ({ messages, setMessages }) => {
  const userData = JSON.parse(localStorage.getItem("userData"))
  const [input, setInput] = useState("")

  useEffect(() => {
    setTimeout(() => {
      const divElement = document.getElementById("chat_body")
      divElement.scrollTo({
        top: divElement.scrollHeight,
        behavior: 'smooth'
      })
    }, 300)

    axios
      .get(`${process.env.REACT_APP_BASE_URL}/messages/sync`)
      .then(res => setMessages(res.data))
      .catch(err => console.error(err))

  }, [])

  const onEnterClick = (e) => {
    const key = e.keyCode || e.which

    if (key === 13) {
      axios
        .post(`${process.env.REACT_APP_BASE_URL}/messages/new`, {
          ...userData,
          timeStamp: new Date().toLocaleString(),
          message: input
        })
        .catch(err => console.error(err))
      setInput("")
    }
  }

  return (
    <div className="chat">
      <div className="header">
        Raghuveer's Chat Room
      </div>
      <div className="chat_body" id="chat_body">
        {messages.map(mess => (
          <div key={mess._id} className={`message_body ${userData?.userId === mess.userId && 'sent'}`}>
            <svg className="arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 13" width="8" height="13"><path opacity=".13" fill="#0000000" d="M1.533 3.568L8 12.193V1H2.812C1.042 1 .474 2.156 1.533 3.568z"></path><path fill="currentColor" d="M1.533 2.568L8 11.193V0H2.812C1.042 0 .474 1.156 1.533 2.568z"></path></svg>
            {!mess.sent && <small className="sender">
              {mess.name}
            </small>}
            <p className="message">
              {mess.message}
            </p>
            <p className="timestamp">
              {mess.timeStamp}
            </p>
          </div>
        ))}
      </div>
      <div className="footer">
        <textarea
          rows={1}
          placeholder="Enter your message here"
          onChange={(e) => setInput(e.target.value)}
          value={input}
          onKeyUp={onEnterClick}
        />
      </div>
    </div>
  )
}

export default Chat
