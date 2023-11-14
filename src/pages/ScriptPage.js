import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import './ScriptPage.css';

const ScriptPage = () => {
    const location = useLocation();
    const [scriptInfo, setScriptInfo] = useState({ ...location.state });
    const [chatHistory, setChatHistory] = useState([]);
    const [userInput, setUserInput] = useState("");

    useEffect(() => {
        const fetchInitialChat = async () => {
            try {
                const response = await axios.get(
                    `http://127.0.0.1:8000/scenario/script/${scriptInfo.scriptId}/chat`,
                    { headers: { Authorization: `Token ${localStorage.getItem('authToken')}` } }
                );
                const data = response.data;
                if (data && data.data && Array.isArray(data.data)) {
                    setChatHistory(data.data);
                }
            } catch (error) {
                console.error("초기 채팅 내역을 불러오는 중 오류 발생:", error);
            }
        };

        fetchInitialChat();
    }, [scriptInfo.scriptId]);

    const renderMessages = () => {
        return chatHistory.map((message) => (
            <div
                key={message.gpt_id}
                className={message.role === "assistant" ? "model-message" : "user-message"}
            >
                {message.query.split('.').map((sentence, index, sentences) => (
                    <span key={index}>
                        {sentence.trim()}
                        {index !== sentences.length - 1 ? <>.<br /><br /></> : null}
                    </span>
                ))}
            </div>
        ));
    };
    
    const sendMessage = async () => {
        try {
            const response = await axios.post(
                `http://127.0.0.1:8000/scenario/script/${scriptInfo.scriptId}/chat`,
                { message: userInput },
            );
            const newMessage = response.data.data[0]; // Assuming single message response
            setChatHistory([...chatHistory, newMessage]);
            setUserInput("");
        } catch (error) {
            console.error("채팅 메시지 전송 중 오류 발생:", error);
        }
    };

    return (
        <div className="ScriptPage">
            <h1>채팅 페이지</h1>
            <div className="chat-container">
                {renderMessages()}
            </div>
            <div className="user-input">
                <input
                    type="text"
                    placeholder="메시지를 입력하세요"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                />
                <button onClick={sendMessage}>전송</button>
            </div>
        </div>
    );
};

export default ScriptPage;