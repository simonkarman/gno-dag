import React from 'react';
import key from './assets/key.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={key} className="App-logo" alt="logo" />
        <p>
          GNO Dag 2023, coming soon!
        </p>
        <p className="App-small-text">
          Kan je niet wachten? Kijk dan nog eens terug naar wat we vorig jaar gedaan hebben: ga nu naar <a href="https://gno-dag-2022.karman.dev">GNO Dag 2022</a>.
        </p>
      </header>
    </div>
  );
}

export default App;
