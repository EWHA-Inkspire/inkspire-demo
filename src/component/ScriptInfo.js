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
    const handleSubmit = () => {
        // 입력된 캐릭터 정보를 서버로 전송
        axios.post('http://127.0.0.1:8000/account/character', characterData, {
            headers: {
                Authorization: `Token ${authToken}`
            }
        })
        .then((response) => {
            // 서버에서 응답 처리
            const data = response.data.data;
            console.log('캐릭터 정보가 성공적으로 제출되었습니다:', data);

            // 캐릭터 아이디 정보 저장
            const characterId = data.character_id;

            // 스크립트 생성 
            scriptSubmit(characterId);
        })
        .catch((error) => {
            console.error('캐릭터, 스크립트 정보 제출 중 오류 발생:', error);
        });
    };

    const scriptSubmit = (id) => {
        // 입력된 스크립트 정보 서버로 보냄
        axios.post(`http://127.0.0.1:8000/scenario/${id}/script`, scriptData, {
            headers: {
                Authorization: `Token ${authToken}`
            }
        })
        .then((response) => {
            // 서버에서 응답 처리
            const data = response.data.data;
            console.log('스크립트 정보가 성공적으로 제출되었습니다:', data);

            gptSubmit(data);
        })
        .catch((error) => {
            console.error('스크립트 정보 제출 중 오류 발생:', error);
        });
    };

    const gptSubmit = (data) => {
        const script_id = data.script_id;
        const town = data.town;
        const town_detail = data.town_detail;

        console.log(town);
        console.log(town_detail);

        // 입력된 정보 서버로 전송
        axios.post(`http://127.0.0.1:8000/scenario/script/${script_id}/chat`, {
            role : 'assistant',
            query : `안녕하세요 ${characterData.name}님. 지금부터 당신을 ${town}에 초대합니다.`
        }, {
            headers: {
                Authorization: `Token ${authToken}`
            }
        })
        .catch((error) => {
            console.error('gpt 정보 제출 중 오류 발생:', error);
        });

        // 입력된 정보 서버로 전송
        axios.post(`http://127.0.0.1:8000/scenario/script/${script_id}/chat`, {
            role: 'assistant',
            query: town_detail
        }, {
            headers: {
                Authorization: `Token ${authToken}`
            }
        })
        .then((response) => {
            // 서버에서 응답 처리
            const data = response.data.data;
            console.log('gpt 정보가 성공적으로 제출되었습니다.:', data);
            
            // 입력 폼 초기화
            setCharacterData({
                name: ''
            });

            setScriptData({
                characterName: '',
                background: '',
                genre: ''
            });

            loadProfile();
        })
        .catch((error) => {
            console.error('gpt 정보 제출 중 오류 발생:', error);
        });
    }
    
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