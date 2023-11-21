import React, { useCallback, useEffect } from 'react';
import axios from 'axios';

const ChatDisplay = ({ authToken, scriptInfo, chatHistory, setChatHistory }) => {
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
                console.log("gpt 정보: ", data.data);
            }
        })
        .catch((error) => {
            console.error("초기 채팅 내역을 불러오는 중 오류 발생:", error);
        });
    }, [authToken, scriptInfo.scriptId, setChatHistory]);

    useEffect(() => {
        if (authToken) {
            fetchInitialChat();
        }
    }, [authToken, fetchInitialChat]);

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

    return (
        <div className="chat-container">
            {renderMessages()}
        </div>
    );
};

export default ChatDisplay;