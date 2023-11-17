import React from 'react';
import { useNavigate } from 'react-router-dom';

const CharacterList = ({ characters }) => {
    const movePage = useNavigate();
    
    // 클릭된 캐릭터의 세부 정보를 표시하는 함수
    const handleCharacterClick = (character) => {
        console.log('선택된 캐릭터:', character);

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

    return (
        <div>
            <h4>캐릭터 목록</h4>
            {characters.map((character, index) => (
                <button className="character-button" key={index} onClick={() => handleCharacterClick(character)}>
                    {character.name}
                </button>
            ))}
        </div>
    );
};

export default CharacterList;