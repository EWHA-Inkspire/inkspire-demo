import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import './ScriptPage.css';

const ScriptPage = () => {
    const location = useLocation();
    const authToken = localStorage.getItem('authToken');
    const [scriptInfo, setScriptInfo] = useState({ ...location.state });
    const [chatHistory, setChatHistory] = useState([]);
    const [userInput, setUserInput] = useState("");


    const fetchInitialChat = useCallback(() => {
        // 서버에서 이전 채팅 기록 불러오기
        axios.get(`http://127.0.0.1:8000/scenario/script/${scriptInfo.scriptId}/chat`, {
            headers: {
                Authorization: `Token ${authToken}`
            }
        })
        .then((response) => {
            const data = response.data;
            if(data && data.data && Array.isArray(data.data)) {
                setChatHistory(data.data);
                console.log(data.data);
            }
        })
        .catch((error) => {
            console.error("초기 채팅 내역을 불러오는 중 오류 발생:", error);
        });
    }, [authToken, scriptInfo.scriptId]);

    const createNPC = useCallback(() => {
        // npc 생성
        axios.post(`http://127.0.0.1:8000/scenario/script/${scriptInfo.scriptId}/npc`, {}, {
            headers: {
                Authorization: `Token ${authToken}`
            }
        })
        .then((response) => {
            console.log('NPC 생성 요청 결과:', response.data);
        })
        .catch ((error) => {
            console.error('NPC 생성 요청 중 오류 발생:', error);
        });
    }, [authToken, scriptInfo.scriptId]);

    const getNPC = useCallback(() => {
        // npc 생성
        axios.get(`http://127.0.0.1:8000/scenario/script/${scriptInfo.scriptId}/npc`, {
            headers: {
                Authorization: `Token ${authToken}`
            }
        })
        .then((response) => {
            const data = response.data;
            // NPC 데이터가 없는 경우에만 NPC 생성 요청
            if (data.data.length === 0) {
                createNPC();
            } else {
                console.log(data.data);
            }
        })
        .catch ((error) => {
            console.error('NPC 조회 중 오류 발생:', error);
        });
    }, [authToken, scriptInfo.scriptId, createNPC]);

    useEffect(() => {
        if (authToken) {
            fetchInitialChat();
            getNPC();
        }
    }, [authToken, fetchInitialChat, getNPC, createNPC]);

    const renderMessages = () => {
        return chatHistory.map((message, index) => (
            <div key={index} className={message.role === "assistant" ? "model-message" : "user-message"}>
                {message.query.split('\n').map((line, lineIndex) => (
                    <span key={lineIndex}>
                        {line}
                        <br />
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
            <h1>스크립트 페이지</h1>
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