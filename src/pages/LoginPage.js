import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import axios from 'axios';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const movePage = useNavigate();

  const handleLogin = () => {
    // User JSON 객체 생성
    const data = {
      email: email,
      password: password
    };

    // Axios를 사용하여 POST 요청 보내기
    axios.post('http://0.0.0.0:8000/account/login', data)
        .then((response) => {
            // 인증이 성공한 경우 토큰을 받아옵니다.
            const authToken = response.data.token;
            console.log('로그인 성공: ', response.data);

            // user 식별자 로컬 스토리지에 저장
            localStorage.setItem('authToken', authToken);
            movePage('/main');
        })
        .catch((error) => {
            console.error('로그인 실패:', error);
        })
  };

  const handleSignup = () => {
    movePage('/signup');
  };

  return (
    <div className="login-page">
      <h2>Login</h2>
      <div className="login-form">
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="login-button" onClick={handleLogin}>Login</button>
        <button className="login-button" onClick={handleSignup}>회원가입</button> 
      </div>
    </div>
  );
}

export default LoginPage;