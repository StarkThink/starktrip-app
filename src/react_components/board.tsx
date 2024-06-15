import React, { useState, useEffect } from 'react';
import './components.css';
import alienCharacter from '../assets/characters/alien.gif';
import ghostCharacter from '../assets/characters/ghost.gif';
import alien2Character from '../assets/characters/alien2.png';
import dinoCharacter from '../assets/characters/dinosaur.gif';
import alienPlanet from '../assets/planets/alien.png';
import ghostPlanet from '../assets/planets/ghost.png';
import alien2Planet from '../assets/planets/alien2.png';
import dinoPlanet from '../assets/planets/dino.png';
import pathGif from '../assets/path.gif';
import spaceshipGif from '../assets/spaceship.gif';

interface BoardProps {
  matrix: string[][];
  path: [number, number][];
}

const getCellClass = (cell: string): string => {
    if (cell === 'x') {
        return 'wall';
    } else if (cell != 'o') {
        return 'gif-cell';
    } else {
        return 'path';
    }
};

const Board: React.FC<BoardProps> = ({ matrix, path }) => {
  const [playerPosition, setPlayerPosition] = useState<[number, number] | null>(null);


  return (
    <div className="board">
      {matrix.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((cell, cellIndex) => (
            <div
              key={cellIndex}
              className={`cell ${getCellClass(cell)}`}
            >
                {cell === 'alien' && <img src={alienCharacter} alt="gif" className="gif-image" />}
                {cell === 'o' && <img src={pathGif} alt="gif" className="gif-image" />}
                {cell === 'player' && <img src={spaceshipGif} alt="gif" className="gif-image" />}
                {cell === 'ghost' && <img src={ghostCharacter} alt="gif" className="gif-image" />}
                {cell === 'dino' && <img src={dinoCharacter} alt="gif" className="gif-image" />}
                {cell === 'alien2' && <img src={alien2Character} alt="gif" className="gif-image" />}

                {cell === 'alien_p' && <img src={alienPlanet} alt="gif" className="gif-image" />}
                {cell === 'ghost_p' && <img src={ghostPlanet} alt="gif" className="gif-image" />}
                {cell === 'dino_p' && <img src={dinoPlanet} alt="gif" className="gif-image" />}
                {cell === 'alien2_p' && <img src={alien2Planet} alt="gif" className="gif-image" />}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Board;
