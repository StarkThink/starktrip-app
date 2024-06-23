import React, { useState, useEffect, useRef } from 'react';
import './components.css';
import alienCharacter from '../assets/characters/alien.gif';
import ghostCharacter from '../assets/characters/ghost.gif';
import alien2Character from '../assets/characters/alien2.png';
import dinoCharacter from '../assets/characters/dinosaur.gif';
import robotCharacter from '../assets/characters/robot.gif';
import robotPlanet from '../assets/planets/robot.png';
import lazybearCharacter from '../assets/characters/lazybear.gif';
import lazybearPlanet from '../assets/planets/earth.png';
import alienPlanet from '../assets/planets/alien.png';
import ghostPlanet from '../assets/planets/ghost.png';
import alien2Planet from '../assets/planets/alien2.png';
import dinoPlanet from '../assets/planets/dino.png';
import pathGif from '../assets/path.gif';
import spaceshipGif from '../assets/spaceship.gif';
import { useDojo } from "../dojo/useDojo";
import { BurnerAccount } from '@dojoengine/create-burner';
import { getCharactersInside } from '../dojo/utils/getCharactersInside';

interface BoardProps {
  matrix: string[][];
  player_x: number;
  player_y: number;
  account: BurnerAccount;
  game_id: number;
  initialGas: number;
  onValueChange: (gameActive: boolean, gameWin: boolean) => void;
}

const getCellClass = (cell: string): string => {
  if (cell === 'wall') {
    return 'wall';
  } else if (cell !== 'empty') {
    return 'gif-cell';
  } else {
    return 'path';
  }
};

const isValidMove = (matrix: string[][], [x, y]: [number, number]): boolean => {
  return x >= 0 && x < matrix.length && y >= 0 && y < matrix[0].length && matrix[x][y] !== 'wall';
};

const findPath = (matrix: string[][], start: [number, number], end: [number, number]): [number, number][] | null => {
  const directions = [
    [-1, 0], // up
    [1, 0],  // down
    [0, -1], // left
    [0, 1],  // right
  ];
  const queue: [[number, number], [number, number][]][] = [[[start[0], start[1]], [start]]];
  const visited = new Set<string>();
  visited.add(start.toString());

  while (queue.length > 0) {
    const [[x, y], path] = queue.shift()!;
    if (x === end[0] && y === end[1]) {
      return path;
    }
    for (const [dx, dy] of directions) {
      const newX = x + dx;
      const newY = y + dy;
      if (isValidMove(matrix, [newX, newY]) && !visited.has([newX, newY].toString())) {
        visited.add([newX, newY].toString());
        queue.push([[newX, newY], path.concat([[newX, newY]])]);
      }
    }
  }

  return null;
};

const findInitialPlayerPosition = (matrix: string[][]): [number, number] | null => {
  for (let x = 0; x < matrix.length; x++) {
    for (let y = 0; y < matrix[x].length; y++) {
      if (matrix[x][y] === 'player') {
        return [x, y];
      }
    }
  }
  return null;
};

const Board: React.FC<BoardProps> = ({ matrix, player_x, player_y, account, game_id, initialGas, onValueChange }) => {
  const {
      setup: {
          systemCalls: { move },
          clientComponents: { CharactersInside },
      },
  } = useDojo();
  const [playerPosition, setPlayerPosition] = useState<[number, number] | null>([player_x, player_y]);
  const [direction, setDirection] = useState<string>('up');
  const [path, setPath] = useState<[number, number][]>([]);
  const [collectedCharacters, setCollectedCharacters] = useState<string[]>([]);
  const [remainingGas, setRemainingGas] = useState(initialGas);
  const [gameActive, setGameActive] = useState(true);

  useEffect(() => {
    if (path.length > 0) {
      const movePlayer = async () => {
        for (let i = 0; i < path.length; i++) {
            if (!gameActive) break;
            const [x, y] = path[i];
            let index = i - 1;
            if (index < 0) index = 0;
            const [prevX, prevY] = path[index];
            if (x < prevX) setDirection('up');
            else if (x > prevX) setDirection('down');
            else if (y < prevY) setDirection('left');
            else if (y > prevY) setDirection('right');

            const cellContent = matrix[x][y];
            if (cellContent !== 'blank' && cellContent !== 'empty' && cellContent !== 'player' && !cellContent.includes('_p')) {
                setCollectedCharacters(prev => [...prev, cellContent]);
                matrix[x][y] = 'empty'; // Remove character from the matrix
            }

          if (i > 0) {
            let moveEvents = await move(
              account.account, game_id, x, y
            ) ?? { 
                move: {pos_x: 0, pos_y: 0, remaining_gas: 0, len_characters_inside: 0}, 
                gameOver: false,
                game_win: {round: 0, score: 0}
              };

            setPlayerPosition([moveEvents.move.pos_x, moveEvents.move.pos_y]);
            setRemainingGas(moveEvents.move.remaining_gas);
            if (moveEvents.gameOver) {
              setGameActive(false);
              onValueChange(false, false);
              break;
            }

            if (moveEvents.game_win.round > 0) {
              setGameActive(false);
              onValueChange(false, true);
              break;
            }

            let characters = getCharactersInside(game_id, moveEvents.move.len_characters_inside, CharactersInside);
            setCollectedCharacters(characters);

          }
          await new Promise(resolve => setTimeout(resolve, 10)); // Move delay
        }
      };
      movePlayer();
    }
  }, [path]);

  const handleCellClick = (rowIndex: number, cellIndex: number) => {
    if (!gameActive) {
       return
    }
    if (playerPosition) {
      const newPath = findPath(matrix, playerPosition, [rowIndex, cellIndex]);
      if (newPath) {
        setPath(newPath);
      }
    }
  };

  return (
      <div className="board-container">
        <div className="board">
          {matrix.map((row, rowIndex) => (
            <div key={rowIndex} className="row">
              {row.map((cell, cellIndex) => (
                <div
                  key={cellIndex}
                  className={`cell ${getCellClass(cell)}`}
                  onClick={() => handleCellClick(rowIndex, cellIndex)}
                >
                  {playerPosition && playerPosition[0] === rowIndex && playerPosition[1] === cellIndex ? (
                    <img src={spaceshipGif} alt="player" className={`gif-image spaceship-${direction}`} />
                  ) : (
                    <>
                      {cell === 'alien' && <img src={alienCharacter} alt="gif" className="gif-image" />}
                      {(cell === 'empty' || cell === 'player')&& <img src={pathGif} alt="gif" className="gif-image" />}
                      {cell === 'ghost' && <img src={ghostCharacter} alt="gif" className="gif-image" />}
                      {cell === 'dino' && <img src={dinoCharacter} alt="gif" className="gif-image" />}
                      {cell === 'alien2' && <img src={alien2Character} alt="gif" className="gif-image" />}
                      {cell === 'lazybear' && <img src={lazybearCharacter} alt="gif" className="gif-image" />}
                      {cell === 'robot' && <img src={robotCharacter} alt="gif" className="gif-image" />}

                      {cell === 'alien_p' && <img src={alienPlanet} alt="gif" className="gif-image" />}
                      {cell === 'ghost_p' && <img src={ghostPlanet} alt="gif" className="gif-image" />}
                      {cell === 'dino_p' && <img src={dinoPlanet} alt="gif" className="gif-image" />}
                      {cell === 'alien2_p' && <img src={alien2Planet} alt="gif" className="gif-image" />}
                      {cell === 'lazybear_p' && <img src={lazybearPlanet} alt="gif" className="gif-image" />}
                      {cell === 'robot_p' && <img src={robotPlanet} alt="gif" className="gif-image" />}
                    </>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="collected-characters-container">
          <div>
            <p>Gas ⛽ {remainingGas} / {initialGas}</p>
          </div>
          <div>
              Inside 🚀:
          </div>
          <div className="collected-characters">
              {collectedCharacters.map((character, index) => {
              let characterSrc;
              switch (character) {
                  case 'alien':
                  characterSrc = alienCharacter;
                  break;
                  case 'ghost':
                  characterSrc = ghostCharacter;
                  break;
                  case 'dino':
                  characterSrc = dinoCharacter;
                  break;
                  case 'alien2':
                  characterSrc = alien2Character;
                  break;
                  case 'robot':
                  characterSrc = robotCharacter;
                  break;
                  case 'lazybear':
                  characterSrc = lazybearCharacter;
                  break;
                  default:
                  characterSrc = null;
              }
              return characterSrc ? <img key={index} src={characterSrc} alt={character} className="collected-gif" /> : null;
              })}
          </div>
        </div>
      </div>
  );
};

export default Board;
