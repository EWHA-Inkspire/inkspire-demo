import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CharacterList = ({ characters, authToken }) => {
    const movePage = useNavigate();
    const [selectedCharacter, setSelectedCharacter] = useState(null);
    const [chapterNumber, setChapterNumber] = useState([]);
    const [isScriptOpen, setIsScriptOpen] = useState(false);

    const handleCharacterClick = (character) => {
        console.log('선택된 캐릭터:', character);
        if (selectedCharacter && selectedCharacter.character_id === character.character_id) {
            setSelectedCharacter(null);
            setIsScriptOpen(false); // 캐릭터 정보가 숨겨지면 스크립트도 닫기
        } else {
            setSelectedCharacter(character);
            const scriptId = character.script.script_id;
            fetchChapterNumber(scriptId);
            setIsScriptOpen(true); // 캐릭터 정보가 나타나면 스크립트도 열기
        }
        toggleScript()
    };

    const fetchChapterNumber = async (scriptId) => {
        axios.get(`http://0.0.0.0:8000/scenario/script/${scriptId}/0/goal`, {
                headers: {
                    Authorization: `Token ${authToken}`
                }
            })
            .then((response) => {
                const data = response.data.data;
                console.log(data);
                let chapters = data.map(item => item.chapter); // 각 JSON 객체의 chapter를 추출하여 배열로 저장
                if(chapters.length !== 5) {
                    // 5 제외시키기
                    chapters = chapters.filter(chapter => chapter !== 5);
                }
                // chapters 정렬
                chapters.sort((a, b) => a - b);
                setChapterNumber(chapters); // chapterNumber 상태 업데이트
            })
            .catch((error) => {
                console.error("목표 정보 조회 중 오류 발생:", error);
            });
    };

    const toggleScript = () => {
        setIsScriptOpen(!isScriptOpen); // 스크립트 상태를 토글하여 열거나 닫기
    };

    const displayScriptInfo = () => {
        if (selectedCharacter) {
            const { character_id, name, script } = selectedCharacter;
            return (
                <div>
                    {chapterNumber.length !== 0 ? (
                        <div className={`profile-info`}>
                            {chapterNumber.map((chapter, index) => (
                                <button className="script-button" key={index} onClick={() => movePage(`/script`, {
                                    state: {
                                        characterId: `${character_id}`,
                                        characterName: `${name}`,
                                        scriptId: `${script.script_id}`,
                                        background: `${script.background}`,
                                        genre: `${script.genre}`,
                                        chapter: chapter
                                    }
                                })}>
                                    CHAPTER {chapter}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <button className="script-button" onClick={() => movePage('/script', {
                            state: {
                                characterId: `${character_id}`,
                                characterName: `${name}`,
                                scriptId: `${script.script_id}`,
                                background: `${script.background}`,
                                genre: `${script.genre}`,
                                chapter: 0
                            }
                        })}>
                            INTRO
                        </button>
                    )}
                </div>
            );
        }
        return null;
    };

    return (
        <div>
            <h4>캐릭터 목록</h4>
            {characters.map((character, index) => (
                <div key={index}>
                    <div>
                        <div className="triangle-toggle" onClick={() => handleCharacterClick(character)}>
                            {isScriptOpen ? '▼' : '▶'} {/* 열려있으면 ▼, 닫혀있으면 ▶ */}
                            <div className="character" >
                                {character.name}
                            </div>
                        </div>
                        {displayScriptInfo()}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CharacterList;