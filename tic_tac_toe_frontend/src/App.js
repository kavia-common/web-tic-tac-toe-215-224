import React, { useState } from "react";
import "./App.css";

// Color Constants (as per requirements)
const COLORS = {
  primary: "#4A90E2",
  secondary: "#FFFFFF",
  accent: "#F5A623",
};

// Board cell component
function Square({ value, onClick, highlight }) {
  return (
    <button
      className="ttt-square"
      onClick={onClick}
      style={{
        color: value === "X" ? COLORS.primary : value === "O" ? COLORS.accent : COLORS.primary,
        background: highlight
          ? "rgba(245,166,35, 0.1)"
          : COLORS.secondary,
        borderColor: highlight ? COLORS.accent : "var(--border-color)",
      }}
      aria-label={`Tic Tac Toe cell ${value ? value : "empty"}`}
    >
      {value}
    </button>
  );
}

// PUBLIC_INTERFACE
function App() {
  // The 9 cells are numbered 0..8
  const [board, setBoard] = useState(Array(9).fill(""));
  const [xIsNext, setXIsNext] = useState(true); // true: X, false: O
  const [history, setHistory] = useState([]); // for possible future undo/redo/analysis features
  const winnerInfo = calculateWinner(board); // {winner, line} or null
  const boardIsFull = board.every((cell) => !!cell);
  const isTie = !winnerInfo && boardIsFull;

  // PUBLIC_INTERFACE
  function handleClick(idx) {
    // If already decided or filled, do nothing
    if (winnerInfo || board[idx]) return;
    const nextBoard = [...board];
    nextBoard[idx] = xIsNext ? "X" : "O";
    setBoard(nextBoard);
    setXIsNext((prev) => !prev);
    setHistory([...history, board]);
  }

  // PUBLIC_INTERFACE
  function handleReset() {
    setBoard(Array(9).fill(""));
    setXIsNext(true);
    setHistory([]);
  }

  // Dynamic game status message
  let status;
  if (winnerInfo) {
    status = (
      <span>
        <span className="ttt-status-win">Player {winnerInfo.winner} wins!</span>
      </span>
    );
  } else if (isTie) {
    status = <span className="ttt-status-tie">It's a tie!</span>;
  } else {
    status = (
      <span>
        <span className="ttt-status-turn" style={{ color: xIsNext ? COLORS.primary : COLORS.accent }}>
          Player {xIsNext ? "X" : "O"}
        </span>
        <span>’s turn</span>
      </span>
    );
  }

  // Minimal header section
  return (
    <div className="ttt-root">
      <header className="ttt-header">
        <h1 className="ttt-title">Tic Tac Toe</h1>
        <p className="ttt-subtitle">A modern, minimal game for two players</p>
      </header>
      <main className="ttt-main">
        {/* Game status */}
        <div
          className="ttt-status"
          role="status"
          aria-live="polite"
        >
          {status}
        </div>
        {/* Game Board */}
        <section className="ttt-board-container">
          <div className="ttt-board" role="grid" aria-label="Tic Tac Toe board">
            {board.map((cell, idx) => (
              <Square
                key={idx}
                value={cell}
                onClick={() => handleClick(idx)}
                highlight={winnerInfo && winnerInfo.line.includes(idx)}
              />
            ))}
          </div>
        </section>
        {/* Action buttons */}
        <div className="ttt-actions">
          <button className="ttt-btn" onClick={handleReset}>
            Reset Game
          </button>
        </div>
      </main>
      {/* Minimal settings area */}
      <footer className="ttt-footer">
        <span className="ttt-footer-text">
          <span role="img" aria-label="sparkles">✨</span>
          Built with React &mdash; <a href="https://reactjs.org/" target="_blank" rel="noopener noreferrer">React Docs</a>
        </span>
      </footer>
    </div>
  );
}

// PUBLIC_INTERFACE
/**
 * Determines the winner of the tic tac toe game, if any.
 * @param {string[]} squares - Array of board values.
 * @returns {null|{winner: 'X'|'O', line: number[]}}
 */
function calculateWinner(squares) {
  // All possible lines to win
  const lines = [
    [0, 1, 2], // rows
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6], // columns
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8], // diagonals
    [2, 4, 6],
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) {
      return { winner: squares[a], line };
    }
  }
  return null;
}

export default App;
