import React, { useState, useEffect } from 'react';
import { useDojo } from "../dojo/useDojo";
import { Entity } from "@dojoengine/recs";
import { Direction } from "../utils";
import { useComponentValue } from "@dojoengine/react";
import Player from './player';
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
          clientComponents: { Position, Moves },
      },
  } = useDojo();

   // get current component values
  const position_block = useComponentValue(Position, entityId);
  const moves = useComponentValue(Moves, entityId);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
        switch (event.key) {
          case 'ArrowUp':
            move(account.account, Direction.Up);
            break;
          case 'ArrowDown':
            move(account.account, Direction.Down);
            break;
          case 'ArrowLeft':
            move(account.account, Direction.Left);
            break;
          case 'ArrowRight':
            move(account.account, Direction.Right);
            break;
          default:
            break;  
        }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div>
        <div className="score">
          Moves: {moves?.remaining ?? 0}
        </div>
        <div style={{ width: '100vw', height: '100vh', backgroundColor: 'black', position: 'relative' }}>
          <Player x={position_block?.vec.x ?? 0 } y={position_block?.vec.y ?? 0 } />
        </div>
    </div>
  );
};

export default Game;
