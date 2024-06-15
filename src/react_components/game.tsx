import React, { useState, useEffect } from 'react';
import { useDojo } from "../dojo/useDojo";
import { Entity } from "@dojoengine/recs";
import { Direction } from "../utils";
import { useComponentValue } from "@dojoengine/react";
import Board from './board';
import Player from './player';
import "../App.css";
import { BurnerAccount } from '@dojoengine/create-burner';
import Modal from './modal';

interface GameProps {
  account: BurnerAccount;
  entityId: Entity;
}

const Game: React.FC<GameProps> = ({ account, entityId }) => {
  const {
      setup: {
          systemCalls: { move },
          clientComponents: { Position, Moves },
      },
  } = useDojo();

   // get current component values
  const position_block = useComponentValue(Position, entityId);
  const moves = useComponentValue(Moves, entityId);

  const [showModal, setShowModal] = useState(false);

  const matrix: string[][] = [
    ['o', 'o', 'o', 'o', 'o'],
    ['o', 'x', 'o', 'x', 'x'],
    ['o', 'o', 'o', 'o', 'o'],
    ['x', 'x', 'x', 'x', 'o'],
    ['o', 'o', 'o', 'o', 'o'],
    ['o', 'x', 'o', 'x', 'o'],
    ['o', 'o', 'o', 'o', 'o'],
  ];

  const handleModalToggle = () => {
    setShowModal(!showModal);
  };

  return (
    <div className="game-background">
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
          <Board matrix={matrix} />
        </div>
        <div className="buttons-container">
          <div className="button-container">
              <button className="next-round-button" disabled={true}>Next Round</button>
          </div>
          <div className="button-container">
              <button className="end-game-button">End Game</button>
          </div>
        </div>
      </div>
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
