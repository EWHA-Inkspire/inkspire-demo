import React from 'react';
import { useNavigate } from 'react-router-dom';
import Character from './Character';

const ProfileInfo = ({ authToken, profileData, error }) => {
    const movePage = useNavigate();

    const handleLogout = () => {
        // 로컬 스토리지에서 인증 토큰 제거
        localStorage.removeItem('authToken');
        // 페이지 이동
        movePage('/');
    };

    return (
        <div>
            <div className="profile-info">
                <h2>프로필 정보</h2>
                {error ? (
                    <p>{error}</p>
                ) : (
                    <div>
                        <p>닉네임:&nbsp;&nbsp;{profileData.nickname}</p>
                        <p>이메일:&nbsp;&nbsp;{profileData.email}</p>
                        <h4>캐릭터 목록</h4>
                        {profileData.characters.map((character, index) => (
                            <div key={index}>
                                <Character character={character} authToken={authToken}/>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {authToken && (
                <button className="logout-button" onClick={handleLogout}>로그아웃</button>
            )}
        </div>
    );
};

export default ProfileInfo;