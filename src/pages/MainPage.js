import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './MainPage.css';

function MainPage() {
    const [error, setError] = useState(null);
    const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));
    const movePage = useNavigate();

    const [profileData, setProfileData] = useState({
        'nickname' : '',
        'email' : '',
        'characters' : []
    });
    const [characterData, setCharacterData] = useState({
        name: ''
    });
    const [scriptData, setScriptData] = useState({
        background: '',
        genre: '',
    });

    const loadProfile = useCallback(() => {
        // 서버에서 프로필 정보 불러오기
        axios.get('http://127.0.0.1:8000/account/user/profile', {
            headers: {
                Authorization: `Token ${authToken}`
            }
        })
        .then((response) => {
            const data = response.data.data;
            setProfileData({
                'nickname' : data.nickname,
                'email' : data.email,
                'characters' : data.characters
            });
            setError(null);
            console.log(data);
        })
        .catch((error) => {
            setError('프로필 정보를 불러오는 데 실패했습니다');
            console.error('프로필 정보를 불러오는 데 실패했습니다:', error);
        });
    }, [authToken]);

    const characterSubmit = () => {
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

            // 입력 폼 초기화
            setCharacterData({
                name: ''
            });

            setScriptData({
                background: '',
                genre: ''
            });

            loadProfile();
        })
        .catch((error) => {
            console.error('스크립트 정보 제출 중 오류 발생:', error);
        });
    };

    // 캐릭터 정보 & 스크립트 기본 배경 설정
    const handleSubmit = () => {
        // 스크립트에 속하는 캐릭터 생성
        characterSubmit();
    };

    // 클릭된 캐릭터의 세부 정보를 표시하는 함수
    const handleCharacterClick = (character) => {
        console.log('선택된 캐릭터:', character);
        // 여기에서 선택된 캐릭터에 대한 세부 정보를 표시하거나 추가적인 동작을 수행할 수 있습니다.
        movePage('/script', {
            state: {
                characterId: `${character.character_id}`,
                characterName: `${character.name}`,
                scriptId: `${character.script.script_id}`,
                background: `${character.script.background}`,
                genre: `${character.script.genre}`,
            }
        });
    };

    useEffect(() => {
        if (authToken) {
            loadProfile();
        }
    }, [authToken, loadProfile]);

    return (
        <div className="main-page">
            <h1>Main Page</h1>
            {authToken ? (
                <div className="profile-info">
                    <h2>프로필 정보</h2>
                    {error ? (
                        <p>{error}</p>
                    ) : (
                        <div>
                            <p>닉네임:&nbsp;&nbsp;{profileData.nickname}</p>
                            <p>이메일:&nbsp;&nbsp;{profileData.email}</p> 
                            <div>
                                <h4>캐릭터 목록</h4>
                                {profileData.characters.map((character, index) => (
                                    <button key={index} onClick={() => handleCharacterClick(character)}>
                                        {character.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <p>프로필 정보를 불러오려면 먼저 로그인하세요.</p>
            )}

            <div className="player-input">
                <h2>캐릭터 정보 입력</h2>
                <input
                    type="text"
                    placeholder="캐릭터 이름"
                    value={characterData.name}
                    onChange={(e) => setCharacterData({ ...characterData, name: e.target.value })}
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
        </div>
    );
}

export default MainPage;