import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignupPage.css';
import axios from 'axios';

function SignupPage() {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const movePage = useNavigate();

  const handleSignup = () => {
    // User JSON 객체 생성
    const data = {
      nickname: nickname,
      email: email,
      password: password
    };

    // Axios를 사용하여 POST 요청 보내기
    axios.post('http://0.0.0.0:8000/account/signup', data)
        .then((response) => {
            console.log('회원가입 성공: ', response.data);
            movePage('/');
        })
        .catch((error) => {
            console.error('회원가입 실패:', error);
        })
  };

  return (
    <div className="signup-page">
      <h2>Signup</h2>
      <div className="signup-form">
        <input
          type="text"
          placeholder="Nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
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
        <button onClick={handleSignup}>Signup</button>
      </div>
    </div>
  );
}

export default SignupPage;