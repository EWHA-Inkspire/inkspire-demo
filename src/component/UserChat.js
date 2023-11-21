// UserInput.js
import React, { useState } from 'react';
import axios from 'axios';

const UserChat = ({ authToken, scriptInfo, chatHistory, setChatHistory }) => {
    const [userInput, setUserInput] = useState("");

    const sendMessage = async () => {
        try {
            const response = await axios.post(
                `http://127.0.0.1:8000/scenario/script/${scriptInfo.scriptId}/play`,
                {
                    history: chatHistory,
                    query: userInput
                },
                {
                    headers: {
                        Authorization: `Token ${authToken}`
                    }
                }
            );
            
            const responseData = response.data.data;
            
            if (Array.isArray(responseData) && responseData.length > 0) {
                setChatHistory([...chatHistory, ...responseData]);
                setUserInput("");
            } else {
                console.error("Invalid or empty response data:", responseData);
            }
        } catch (error) {
            console.error("Error sending chat message:", error);
        }
    };

    return (
        <div className="user-input">
            <input
                type="text"
                placeholder="Enter your message"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default UserChat;