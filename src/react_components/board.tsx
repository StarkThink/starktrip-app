import React from 'react';
import './components.css';

interface BoardProps {
  matrix: string[][];
}

const Board: React.FC<BoardProps> = ({ matrix }) => {
  return (
    <div className="board">
      {matrix.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((cell, cellIndex) => (
            <div
              key={cellIndex}
              className={`cell ${cell === 'x' ? 'wall' : 'path'}`}
            ></div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Board;
