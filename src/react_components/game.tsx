import React, { useState } from 'react';
import { useDojo } from "../dojo/useDojo";
import { Entity } from "@dojoengine/recs";
import { useComponentValue } from "@dojoengine/react";
import BoardComponent from './board';
import Leaderboard from './leaderboard';
import Modal from './modal';
import "../App.css";
import { BurnerAccount } from '@dojoengine/create-burner';

interface GameProps {
  account: BurnerAccount;
  entityId: Entity;
}

const Game: React.FC<GameProps> = ({ account, entityId }) => {
  const {
      setup: {
          systemCalls: { move },
          clientComponents: { Board, CharactersInside },
      },
  } = useDojo();

  // get current component values
  const position_block = useComponentValue(Board, entityId);
  const moves = useComponentValue(CharactersInside, entityId);

  const [showModal, setShowModal] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);

  const matrix: string[][] = [
    ['alien2', 'o', 'alien_p', 'o', 'ghost_p'],
    ['o', 'x', 'o', 'x', 'x'],
    ['dino_p', 'o', 'player', 'o', 'o'],
    ['x', 'x', 'x', 'x', 'o'],
    ['dino', 'o', 'o', 'o', 'o'],
    ['o', 'x', 'o', 'x', 'ghost'],
    ['o', 'o', 'alien', 'o', 'alien2_p'],
  ];
  
  const handleModalToggle = () => {
    setShowModal(!showModal);
  };

  const handleEndGame = () => {
    setGameEnded(true);
  };

  return (
    <div className="game-background">
      {gameEnded ? (
        <Leaderboard />
      ) : (
        <div className="game-content">
          <div>
            <div>Player: test</div>
            <div>Round: 1</div>
            <div>Score: 0</div>
            <div className="how-to-play" onClick={handleModalToggle}>
              How to play?
            </div>
          </div>
          <div className="board-content">
            <BoardComponent matrix={matrix} />
          </div>
          <div className="buttons-container">
            <div className="button-container">
              <button className="next-round-button" disabled={true}>Next Round</button>
            </div>
            <div className="button-container">
              <button className="end-game-button" onClick={handleEndGame}>End Game</button>
            </div>
          </div>
        </div>
      )}
      <Modal show={showModal} handleClose={handleModalToggle}>
        <h2>How to Play</h2>
        <p>
          Your goal is to collect all missing characters and bring them to their corresponding planet. Make sure
          not to run out of gas!
        </p>
      </Modal>
    </div>
  );
};

export default Game;
