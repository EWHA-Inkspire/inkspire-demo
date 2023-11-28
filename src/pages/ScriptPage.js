import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import './ScriptPage.css';
import ChatDisplay from "../component/ChatDisplay";
import UserChat from "../component/UserChat";

const ScriptPage = () => {
    const location = useLocation();
    const [scriptInfo, setScriptInfo]= useState(location.state);
    const authToken = localStorage.getItem('authToken');
    const [chatHistory, setChatHistory] = useState([]);

    const createNPC = useCallback(async () => {
        try {
            const response = await axios.post(
                `http://0.0.0.0:8000/scenario/script/${scriptInfo.scriptId}/npc`,
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

    const gameStart = () => {
        try {
            const response = axios.post(`http://127.0.0.1:8000/scenario/play/intro`, {
                player_name: scriptInfo.characterName,
                script_id: scriptInfo.scriptId,
                background: scriptInfo.background,
                genre: scriptInfo.genre,
                town: scriptInfo.town,
                town_detail: scriptInfo.townDetail,
                chapter: scriptInfo.chapter,
            });
    
            const data = response.data;
            if (data && data.data) {
                setChatHistory([...chatHistory, data.data]);
            } else {
                console.error("Invalid data format received from server:", data);
            }
        } catch (error) {
            console.error('Error during game start:', error);
        }
    };   

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

    const getScript = useCallback(async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/scenario/script/${scriptInfo.scriptId}`, {
                headers: {
                    Authorization: `Token ${authToken}`,
                },
            });
            const data = response.data.data;
            console.log(data);
            console.log("목표:", data['goals']);
            console.log("NPC:", data['npcs']);
            const idx = scriptInfo.chapter === 0 ? 1 : scriptInfo.chapter;
            if(data['goals'].length !== 0 && data['npcs'].length !== 0) {
                setScriptInfo({
                    ...scriptInfo,
                    "chapter_goal" : data['goals'][idx].title + " " + data['goals'][idx].content,
                    "final_goal" : data['goals'][0].title + " " + data['goals'][0].content
                })

                console.log("히스토리 길이 ", chatHistory.length);
                if(scriptInfo.chapter <= 1 && chatHistory.length === 2) {
                    // 게임 시작
                    gameStart();
                }
            }

            // goals 필드의 길이가 0이면 createGoal
            if(data['goals'].length === 0) {
                await createGoal();
            }

            // npcs 필드의 길이가 0이면 createNPC
            if(data['npcs'].length === 0) {
                await createNPC();
            }
        } catch (error) {
            console.error('스크립트 조회 중 오류 발생:', error);
        }
    }, [authToken, scriptInfo.scriptId, setChatHistory]);    

    useEffect(() => {
        const fetchData = async () => {
            if (authToken) {
                await getScript();
            }
        };
        fetchData();
    }, [authToken, getScript]);

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