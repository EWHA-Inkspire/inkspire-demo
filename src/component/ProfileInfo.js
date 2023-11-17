import React from 'react';
import { useLocation } from 'react-router-dom';
import CharacterList from './CharacterList';

const ProfileInfo = ({ authToken, profileData, error }) => {
    const movePage = useLocation();

    const handleLogout = () => {
        // 로컬 스토리지에서 인증 토큰 제거
        localStorage.removeItem('authToken');
        // 페이지 이동
        movePage('/');
    };

    return (
        <div className="profile-info">
            <h2>프로필 정보</h2>
            {error ? (
                <p>{error}</p>
            ) : (
                <div>
                    <p>닉네임:&nbsp;&nbsp;{profileData.nickname}</p>
                    <p>이메일:&nbsp;&nbsp;{profileData.email}</p>
                    <CharacterList characters={profileData.characters}/>
                </div>
            )}
            {authToken && (
                <button className="logout-button" onClick={handleLogout}>로그아웃</button>
            )}
        </div>
    );
};

export default ProfileInfo;