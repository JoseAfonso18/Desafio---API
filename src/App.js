import React, { useState } from 'react';
import CryptoList from './components/CryptoList';
import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={darkMode ? 'App dark-mode' : 'App'}>
      <button className="toggle-btn" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? 'Modo Claro' : 'Modo Escuro'}
      </button>
      <CryptoList />
    </div>
  );
}

export default App;
