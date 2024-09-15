import { useEffect, useState } from "react";
import "./App.css";
import socket from './server';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ChatPage from "./page/ChatPages/ChatPage.jsx';";
import RoomListPage from "./page/RoomListPages/RoomListPage";

function App() {
const [user, setUser] = useState(null);
const [message, setMessage] = useState('');
const [messageList, setMessageList] = 
useState([])
const [rooms, setRooms] = useState([]);

console.log("message list", messageList);
  useEffect(() =>{
    socket.on("rooms", (res) => {
      setRooms(res);
    })

    socket.on('message' , (message) =>{
      setMessageList((prevState) => prevState.concat(message));
    })
    askUserName();
},[])
  const askUserName=()=> {
    const userName = prompt('당신의 이름을 입력하세요');
    console.log('user', userName);

    socket.emit("login", userName, (res) => {
      if(res?.ok){
        setUser(res.data)
      }
    })
  };
  const sendMessage = (event)=> {
    event.preventDefault()
    socket.emit("sendMessage", message, (res) => {
      console.log("sendMessage res", res);
    })
  }

  return (
    <BrowserRouter>
    <Routes>
      <Route exact path="/" element={<RoomListPage rooms={rooms}/>} />
      <Route exact path="/room/:id" element={<ChatPage user={user} />}/>
    </Routes>
      {/* <div className="App">
        <MessageContainer messageList={messageList} user={user}/>
        <InputField message={message} setMessage={setMessage} sendMessage={sendMessage} />
      </div> */}
    </BrowserRouter>
  );
}

export default App;
