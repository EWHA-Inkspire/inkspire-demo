import React, { useState } from 'react';
import axios from 'axios';

const ScriptInfo = ({ authToken, loadProfile }) => {
    const [scriptData, setScriptData] = useState([{
        background: '',
        genre: '',
    }]);
    const [characterData, setCharacterData] = useState({
        name: ''
    });

    // 캐릭터 정보 & 스크립트 기본 배경 설정
    const handleSubmit = async () => {
        try {
            const characterResponse = await axios.post('http://127.0.0.1:8000/account/character', characterData, {
                headers: {
                    Authorization: `Token ${authToken}`
                }
            });

            const characterResult = characterResponse.data.data;
            console.log('캐릭터 정보가 성공적으로 제출되었습니다:', characterResult);

            const characterId = characterResult.character_id;

            await scriptSubmit(characterId);
        } catch (error) {
            console.error('캐릭터, 스크립트 정보 제출 중 오류 발생:', error);
        }
    };

    const scriptSubmit = async (id) => {
        try {
            const scriptResponse = await axios.post(`http://127.0.0.1:8000/scenario/${id}/script`, scriptData, {
                headers: {
                    Authorization: `Token ${authToken}`
                }
            });
    
            const scriptResult = scriptResponse.data.data;
            console.log('스크립트 정보가 성공적으로 제출되었습니다:', scriptResult);
    
            await gptSubmit(scriptResult);
        } catch (error) {
            console.error('스크립트 정보 제출 중 오류 발생:', error);
        }
    };

    const gptSubmit = async (data) => {
        try {
            const script_id = data.script_id;
            const town = data.town;
            const town_detail = data.town_detail;
    
            console.log(town);
            console.log(town_detail);
    
            await axios.post(`http://127.0.0.1:8000/scenario/script/${script_id}/chat`, {
                role: 'assistant',
                content: `안녕하세요 ${characterData.name}님. 지금부터 당신을 ${town}에 초대합니다.`,
                chapter: 1
            }, {
                headers: {
                    Authorization: `Token ${authToken}`
                }
            });
    
            const secondChatResponse = await axios.post(`http://127.0.0.1:8000/scenario/script/${script_id}/chat`, {
                role: 'assistant',
                content: town_detail,
                chapter: 1
            }, {
                headers: {
                    Authorization: `Token ${authToken}`
                }
            });
    
            const secondChatResult = secondChatResponse.data.data;
            console.log('gpt 정보가 성공적으로 제출되었습니다.:', secondChatResult);
    
            setCharacterData({ name: '' });
            setScriptData({ characterName: '', background: '', genre: '' });
    
            loadProfile();
        } catch (error) {
            console.error('gpt 정보 제출 중 오류 발생:', error);
        }
    };
    
    return (
        <div className="player-input">
            <h2>캐릭터 정보 입력</h2>
            <input
                type="text"
                placeholder="캐릭터 이름"
                value={characterData.name}
                onChange={(e) => {
                    setCharacterData({ ...characterData, name: e.target.value })
                    setScriptData({...scriptData, characterName: e.target.value })
                }}
            />
            <input
                type="text"
                placeholder="배경"
                value={scriptData.background}
                onChange={(e) => setScriptData({ ...scriptData, background: e.target.value })}
            />
            <input
                type="text"
                placeholder="장르"
                value={scriptData.genre}
                onChange={(e) => setScriptData({ ...scriptData, genre: e.target.value })}
            />
            <button onClick={handleSubmit}>캐릭터 / 스크립트 생성</button>
        </div>
    );
};

export default ScriptInfo;