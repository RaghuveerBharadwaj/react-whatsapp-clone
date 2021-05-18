import './Chat.scss'
import { useEffect, useState } from 'react'
import axios from 'axios'
import moment from 'moment-mini'
import Logo from '../assets/logo.png'
import { ReactComponent as DeleteIcon } from "../assets/delete.svg"
import { ReactComponent as PencilIcon } from "../assets/pencil.svg"

const Chat = ({ messages, setMessages }) => {
  const userData = JSON.parse(localStorage.getItem("userData"))
  const [input, setInput] = useState("")
  const [editDetails, setEditDetails] = useState({})

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
          timeStamp: new Date(),
          message: input
        })
        .catch(err => console.error(err))
      setInput("")
    }
  }

  const onDeleteMessage = (id) => {
    axios
      .delete(`${process.env.REACT_APP_BASE_URL}/messages/delete/${id}`)
      .catch(err => console.error(err))
  }

  const onEditClick = (msg) => setEditDetails({
    id: msg._id,
    message: msg.message
  })

  const onEditChange = (e) => {
    if (e.target.value !== '\n') {
      setEditDetails({
        ...editDetails,
        message: e.target.value
      })
    }
  }

  const onEnterEdit = (e) => {
    const key = e.keyCode || e.which

    if (!e.target.value) return

    if (key === 13) {
      axios
        .patch(`${process.env.REACT_APP_BASE_URL}/messages/edit`, {
          id: editDetails.id,
          message: editDetails.message
        })
        .then(res => setEditDetails({}))
        .catch(err => console.error(err))
    }
  }

  return (
    <div className="chat">
      {editDetails?.id && <div className="mask">
        <div className="edit register">
          <textarea
            rows={3}
            autoFocus
            name="register"
            onChange={onEditChange}
            value={editDetails?.message || ""}
            onKeyUp={onEnterEdit}
          />
        </div>
      </div>}
      <div className="header">
        <img src={Logo} alt="Raghuveer Bharadwaj" /> Raghuveer's Chat Room
      </div>
      <div className="chat_body" id="chat_body">
        {messages.map(mess => (
          <div key={mess._id} id={mess._id} className={`message_body ${userData?.userId === mess.userId && 'sent'}`}>
            <svg className="arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 13" width="8" height="13"><path opacity=".13" fill="#0000000" d="M1.533 3.568L8 12.193V1H2.812C1.042 1 .474 2.156 1.533 3.568z"></path><path fill="currentColor" d="M1.533 2.568L8 11.193V0H2.812C1.042 0 .474 1.156 1.533 2.568z"></path></svg>
            <div className="flex-user">
              <small className="sender">
                {mess.name} {mess.edited && <small> &nbsp;(edited)</small>}
              </small>
              {userData?.userId === mess.userId && <big>
                <DeleteIcon onClick={() => onDeleteMessage(mess._id)} />
                <PencilIcon onClick={() => onEditClick(mess)} />
              </big>}
            </div>
            <p className="message">
              {mess.message}
            </p>
            <p className="timestamp">
              {moment(mess.timeStamp).format("DD MMM YYYY, hh:mm A")}
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
