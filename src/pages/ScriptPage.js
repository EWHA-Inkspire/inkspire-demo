import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import './ScriptPage.css';

const ScriptPage = () => {
    const location = useLocation();
    const [scriptInfo, setScriptInfo] = useState({ ...location.state });
    const [chatHistory, setChatHistory] = useState([]);
    const [userInput, setUserInput] = useState("");
    
    const sendMessage = async () => {
        try {
            // 사용자 입력을 서버로 전송
            const response = await axios.post(
                `http://127.0.0.1:8000/scenario/${scriptInfo.characterId}/script/${scriptInfo.scriptId}/chat`,
                { message: userInput },
                { headers: { Authorization: `Token ${localStorage.getItem('authToken')}` } }
            );

            // 서버에서 받은 응답을 채팅 히스토리에 추가
            setChatHistory((prevHistory) => [...prevHistory, response.data.message]);

            // 사용자 입력 초기화
            setUserInput("");
        } catch (error) {
            console.error("채팅 메시지 전송 중 오류 발생:", error);
        }
    };

    useEffect(() => {
        // 페이지 로드 시 초기 대화를 가져옴
        const fetchInitialChat = async () => {
            try {
                const response = await axios.get(
                    `http://127.0.0.1:8000/scenario/${scriptInfo.characterId}/script/${scriptInfo.scriptId}/chat`,
                    { headers: { Authorization: `Token ${localStorage.getItem('authToken')}` } }
                );

                setChatHistory(response.data.messages);
            } catch (error) {
                console.error("초기 채팅 내역을 불러오는 중 오류 발생:", error);
            }
        };

        fetchInitialChat();
    }, [scriptInfo.characterId, scriptInfo.scriptId]);

    return (
        <div className="ScriptPage">
            <h1>채팅 페이지</h1>
            <div className="chat-container">
                {chatHistory.map((message, index) => (
                    <div key={index} className={message.type === "user" ? "user-message" : "model-message"}>
                        {message.content}
                    </div>
                ))}
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
