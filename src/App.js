import { Route, Routes } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
import ScriptPage from './pages/ScriptPage';

function App() {
  return (
    <div>
      <Routes>
        <Route Component={LoginPage} path='/' exact />
        <Route Component={MainPage} path='/main' />
        <Route Component={ScriptPage} path='/script' />
      </Routes>
    </div>
  );
}

export default App;
