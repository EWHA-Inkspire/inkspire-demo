import { Route, Routes } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
import ScriptPage from './pages/ScriptPage';
import SignupPage from './pages/SignupPage';

function App() {
  return (
    <div>
      <Routes>
        <Route Component={LoginPage} path='/' exact />
        <Route Component={SignupPage} path='/signup' />
        <Route Component={MainPage} path='/main' />
        <Route Component={ScriptPage} path='/script' />
      </Routes>
    </div>
  );
}

export default App;
