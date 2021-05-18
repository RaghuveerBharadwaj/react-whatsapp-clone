import { useEffect, useState } from 'react'
import _ from 'lodash'
import Pusher from 'pusher-js'
import './App.css'
import Chat from './chat/Chat'
import Register from './register/Register'

function App() {

  const [user, setUser] = useState({})
  const [messages, setMessages] = useState([])

  useEffect(() => {
    const userData = localStorage.getItem("userData")
    if (!userData) {
      localStorage.setItem("userData", JSON.stringify(user))
    } else {
      setUser(JSON.parse(userData))
    }

    const pusher = new Pusher(process.env.REACT_APP_PUSHER, {
      cluster: 'ap2'
    })

    const channel = pusher.subscribe('messages')
    channel.bind('inserted', dataInserted)
    channel.bind('deleted', dataDeleted)
    channel.bind('updated', dataUpdated)
    return () => {
      channel.unbind()
    }
  }, [])

  const dataInserted = (data) => {
    setMessages(msgs => _.cloneDeep([..._.cloneDeep(msgs), data]))
    const divElement = document.getElementById("chat_body")
    if (divElement) {
      divElement.scrollTo({
        top: divElement.scrollHeight,
        behavior: 'smooth'
      })
    }
  }

  const dataDeleted = (id) => setMessages(msgs => _.cloneDeep(msgs).filter(msg => id !== msg._id))

  const dataUpdated = (data) => {
    setMessages(msgs => _.cloneDeep(msgs).map(msg => {
      if (data.documentKey._id === msg._id) {
        msg.message = data.updateDescription.updatedFields.message
        msg.edited = true
      }
      return msg
    }))
  }

  return (
    <div className="app">
      {user?.userId ? <Chat
        messages={messages}
        setMessages={setMessages}
      /> : <Register />}
    </div>
  )
}

export default App
