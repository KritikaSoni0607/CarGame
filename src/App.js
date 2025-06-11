import React, { useState } from "react";
import CarGame from "./components/CarGame";
import "./App.css";

function App() {
  const [started, setStarted] = useState(false);

  return (
    <div className="app-container">
  {!started ? (
    <div className="home-screen">
      <div className="home-box">
        <h1 className="game-title">🏎️ HyperSpeed Racer</h1>
        <button className="start-button" onClick={() => setStarted(true)}>
          Start Game
        </button>
      </div>
    </div>
  ) : (
    <CarGame goHome={() => setStarted(false)} />
  )}
</div>

      
  );
}

export default App;
