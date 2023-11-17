import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import './MainPage.css';
import ProfileInfo from '../component/ProfileInfo';
import ScriptInfo from '../component/ScriptInfo';

function MainPage() {
    const authToken = localStorage.getItem('authToken');
    const [error, setError] = useState(null);
    const [profileData, setProfileData] = useState({
        'nickname' : '',
        'email' : '',
        'characters' : []
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

    useEffect(() => {
        if (authToken) {
            loadProfile();
        }
    }, [authToken, loadProfile]);

    return (
        <div className="main-page">
            <h1>Main Page</h1>
            {authToken ? (
                <ProfileInfo
                    authToken={authToken}
                    profileData={profileData}
                    error={error} />
            ) : (
                <p>프로필 정보를 불러오려면 먼저 로그인하세요.</p>
            )}

            <ScriptInfo
                authToken={authToken}
                loadProfile={loadProfile} />
        </div>
    );
}

export default MainPage;