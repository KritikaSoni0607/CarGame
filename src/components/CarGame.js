import React, { useState, useEffect, useRef } from "react";
import "./CarGame.css";
import carImg from "../assets/car.png";
import obstacleImg from "../assets/obstacle.png";

export default function CarGame({ goHome }) {
  const [carPos, setCarPos] = useState(150);
  const [obstacles, setObstacles] = useState([{ id: 1, x: 150, y: -100 }]);
  const [finishLineY, setFinishLineY] = useState(-1500);
  const [gameOver, setGameOver] = useState(false);
  const [hasWon, setHasWon] = useState(false); // 🆕 Added
  const moveInterval = useRef(null);
  const carRef = useRef(null);
  const roadRef = useRef(null);

  const startMoving = (dir) => {
    moveInterval.current = setInterval(() => {
      setCarPos((prev) => {
        const next = dir === "left" ? prev - 10 : prev + 10;
        return Math.max(50, Math.min(next, 250));
      });
    }, 50);
  };

  const stopMoving = () => {
    clearInterval(moveInterval.current);
  };

  const resetGame = () => {
    setCarPos(150);
    setObstacles([{ id: 1, x: 150, y: -100 }]);
    setFinishLineY(-1500);
    setGameOver(false);
    setHasWon(false); // 🆕 Reset win state
  };

  // Move obstacles and finish line
  useEffect(() => {
    if (gameOver || hasWon) return;

    const speed = finishLineY > -300 ? 20 : 10;
    const gameInterval = setInterval(() => {
      setObstacles((obs) => obs.map((o) => ({ ...o, y: o.y + speed })));
      setFinishLineY((prev) => prev + speed);
    }, 100);
    return () => clearInterval(gameInterval);
  }, [gameOver, hasWon, finishLineY]);

  // Spawn obstacles
  useEffect(() => {
    if (gameOver || hasWon) return;
    const addObs = setInterval(() => {
      const x = [50, 150, 250][Math.floor(Math.random() * 3)];
      setObstacles((prev) => [...prev, { id: Date.now(), x, y: -100 }]);
    }, 2000);
    return () => clearInterval(addObs);
  }, [gameOver, hasWon]);

  // Collision check
  useEffect(() => {
    if (gameOver || hasWon) return;

    const checkCollision = () => {
      const roadRect = roadRef.current?.getBoundingClientRect();
      const carRect = carRef.current?.getBoundingClientRect();
      const buffer = 15;

      if (!roadRect || !carRect) return;

      obstacles.forEach((obs) => {
        const obsX = roadRect.left + obs.x;
        const obsY = roadRect.top + obs.y;

        const obsRect = {
          top: obsY + buffer,
          left: obsX + buffer,
          right: obsX + 70 - buffer,
          bottom: obsY + 100 - buffer,
        };

        if (
          carRect.top < obsRect.bottom &&
          carRect.bottom > obsRect.top &&
          carRect.left < obsRect.right &&
          carRect.right > obsRect.left
        ) {
          setGameOver(true);
        }
      });
    };

    checkCollision();
  }, [obstacles, carPos, gameOver, hasWon]);

  // 🆕 Check for win
  useEffect(() => {
    if (gameOver || hasWon) return;

    const roadRect = roadRef.current?.getBoundingClientRect();
    const carRect = carRef.current?.getBoundingClientRect();

    if (roadRect && carRect) {
      const finishAbsY = roadRect.top + finishLineY;

      if (finishAbsY >= carRect.top) {
        setHasWon(true);
      }
    }
  }, [finishLineY, gameOver, hasWon]);

  return (
    <div className="game-wrapper">
      {gameOver && (
        <div className="game-over-screen">
          <h2>💥 Game Over</h2>
          <div className="game-over-buttons">
            <button onClick={resetGame}>🔁 Restart</button>
            <button onClick={goHome}>🏠 Home</button>
          </div>
        </div>
      )}

      {hasWon && (
        <div className="game-over-screen">
          <h2>🎉 You Won!</h2>
          <div className="game-over-buttons">
            <button onClick={resetGame}>🔁 Play Again</button>
            <button onClick={goHome}>🏠 Home</button>
          </div>
        </div>
      )}

      <div className="road" ref={roadRef}>
        <div className="finish-line" style={{ top: finishLineY }}></div>

        {obstacles.map((obs) => (
          <img
            key={obs.id}
            src={obstacleImg}
            className="obstacle"
            style={{ top: obs.y, left: obs.x }}
            alt="obstacle"
          />
        ))}

        <img
          ref={carRef}
          src={carImg}
          alt="car"
          className="car"
          style={{ left: carPos }}
        />
      </div>

      <div className="controls">
        <button
          onMouseDown={() => startMoving("left")}
          onMouseUp={stopMoving}
          onTouchStart={() => startMoving("left")}
          onTouchEnd={stopMoving}
        >
          ⬅️
        </button>
        <button
          onMouseDown={() => startMoving("right")}
          onMouseUp={stopMoving}
          onTouchStart={() => startMoving("right")}
          onTouchEnd={stopMoving}
        >
          ➡️
        </button>
      </div>
    </div>
  );
}
