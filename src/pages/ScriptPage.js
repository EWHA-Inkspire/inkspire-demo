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

    const createNPC = useCallback(async () => {
        try {
            const response = await axios.post(
                `http://127.0.0.1:8000/scenario/script/${scriptInfo.scriptId}/npc`,
                {},
                {
                    headers: {
                        Authorization: `Token ${authToken}`,
                    },
                }
            );
            console.log('NPC 생성 요청 결과:', response.data);
        } catch (error) {
            console.error('NPC 생성 요청 중 오류 발생:', error);
        }
    }, [authToken, scriptInfo.scriptId]);

    const getNPC = useCallback(async () => {
        try {
            const response = await axios.get(
                `http://127.0.0.1:8000/scenario/script/${scriptInfo.scriptId}/npc`,
                {
                    headers: {
                        Authorization: `Token ${authToken}`,
                    },
                }
            );
            const data = response.data;
            if (data.data.length === 0) {
                await createNPC();
            } else {
                console.log('NPC 정보: ', data.data);
            }
        } catch (error) {
            console.error('NPC 조회 중 오류 발생:', error);
        }
    }, [authToken, scriptInfo.scriptId, createNPC]);

    const createGoal = useCallback(async () => {
        try {
            const response = await axios.post(
                `http://127.0.0.1:8000/scenario/script/${scriptInfo.scriptId}/${scriptInfo.chapter}/goal`,
                {},
                {
                    headers: {
                        Authorization: `Token ${authToken}`,
                    },
                }
            );
            console.log('목표 생성 요청 결과:', response.data);
        } catch (error) {
            console.error('목표 생성 요청 중 오류 발생:', error);
        }
    }, [authToken, scriptInfo.scriptId, scriptInfo.chapter]);
    
    const getGoal = useCallback(async () => {
        try {
            const response = await axios.get(
                `http://127.0.0.1:8000/scenario/script/${scriptInfo.scriptId}/${scriptInfo.chapter}/goal`,
                {
                    headers: {
                        Authorization: `Token ${authToken}`,
                    },
                }
            );
            const data = response.data;
            if (data.data.length === 0) {
                await createGoal();
            } else {
                console.log('챕터 목표 정보: ', data.data);
            }
        } catch (error) {
            console.error('목표 조회 중 오류 발생:', error);
        }
    }, [authToken, scriptInfo.scriptId, scriptInfo.chapter, createGoal]);

    const getScript = useCallback(async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/scenario/script/${scriptInfo.scriptId}`, {
                headers: {
                    Authorization: `Token ${authToken}`,
                },
            });
            const data = response.data;
            console.log(data.data);
        } catch (error) {
            console.error('목표 조회 중 오류 발생:', error);
        }
    }, [authToken, scriptInfo.scriptId]);    

    useEffect(() => {
        const fetchData = async () => {
            if (authToken) {
                await getNPC();
                await getGoal();
                await getScript();
            }
        };
        fetchData();
    }, [authToken, getNPC, getGoal, getScript]);

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