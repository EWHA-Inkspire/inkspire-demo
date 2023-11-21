import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import './ScriptPage.css';
import ChatDisplay from "../component/ChatDisplay";
import UserChat from "../component/UserChat";

const ScriptPage = () => {
    const location = useLocation();
    const [scriptInfo, setScriptInfo] = useState(location.state);
    const authToken = localStorage.getItem('authToken');
    const [chatHistory, setChatHistory] = useState([]);

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
        // npc 조회
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
                console.log("NPC 정보: ",data.data);
            }
        })
        .catch ((error) => {
            console.error('NPC 조회 중 오류 발생:', error);
        });
    }, [authToken, scriptInfo.scriptId, createNPC]);

    const createGoal = useCallback(() => {
        // 목표 생성
        axios.post(`http://127.0.0.1:8000/scenario/script/${scriptInfo.scriptId}/${scriptInfo.chapter}/goal`, {}, {
            headers: {
                Authorization: `Token ${authToken}`
            }
        })
        .then((response) => {
            console.log('목표 생성 요청 결과:', response.data);
        })
        .catch ((error) => {
            console.error('목표 생성 요청 중 오류 발생:', error);
        });
    }, [authToken, scriptInfo.scriptId, scriptInfo.chapter]);

    const getGoal = useCallback(() => {
        // 목표 조회
        axios.get(`http://127.0.0.1:8000/scenario/script/${scriptInfo.scriptId}/${scriptInfo.chapter}/goal`, {
            headers: {
                Authorization: `Token ${authToken}`
            }
        })
        .then((response) => {
            const data = response.data;
            // 목표 데이터가 없는 경우에만 목표 생성 요청
            if (data.data.length === 0) {
                createGoal();
            } else {
                console.log("챕터 목표 정보: ",data.data);
            }
        })
        .catch ((error) => {
            console.error('목표 조회 중 오류 발생:', error);
        });
    }, [authToken, scriptInfo.scriptId, scriptInfo.chapter, createGoal]);

    const getScript = useCallback(() => {
        // npc 조회
        axios.get(`http://127.0.0.1:8000/scenario/script/${scriptInfo.scriptId}`, {
            headers: {
                Authorization: `Token ${authToken}`
            }
        })
        .then((response) => {
            const data = response.data;
            console.log(data.data);
        })
        .catch ((error) => {
            console.error('목표 조회 중 오류 발생:', error);
        });
    }, [authToken, scriptInfo.scriptId]);

    useEffect(() => {
        if (authToken) {
            getNPC();
            getGoal();
            getScript();
        }
    }, [authToken, getNPC, createNPC, getGoal, createGoal, getScript, scriptInfo.scriptId, scriptInfo.chapter]);

    return (
        <div className="ScriptPage">
            <h1>스크립트 페이지</h1>
            <ChatDisplay
                authToken={authToken}
                scriptInfo={scriptInfo}
                chatHistory={chatHistory}
                setChatHistory={setChatHistory} />
            <UserChat
                authToken={authToken}
                scriptInfo={scriptInfo}
                chatHistory={chatHistory}
                setChatHistory={setChatHistory} />
        </div>
    );
};

export default ScriptPage;