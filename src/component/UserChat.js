// UserInput.js
import React, { useState } from 'react';
import axios from 'axios';

const UserChat = ({ authToken, scriptInfo, chatHistory, setChatHistory }) => {
    const [userInput, setUserInput] = useState("");

    const sendMessage = async () => {
        try {
            const response = await axios.post(
                `http://127.0.0.1:8000/scenario/script/${scriptInfo.scriptId}/chat`,
                {}, {
                    headers: {
                        Authorization: `Token ${authToken}`
                    }
                }
            );
            const newMessage = response.data.data[0]; // Assuming single message response
            setChatHistory([...chatHistory, newMessage]);
            setUserInput("");
        } catch (error) {
            console.error("채팅 메시지 전송 중 오류 발생:", error);
        }
    };

    return (
        <div className="user-input">
            <input
                type="text"
                placeholder="메시지를 입력하세요"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
            />
            <button onClick={sendMessage}>전송</button>
        </div>
    );
};

export default UserChat;