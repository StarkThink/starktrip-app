import React, { useState, useEffect } from 'react';
import { useDojo } from "../dojo/useDojo";
import { Entity } from "@dojoengine/recs";
import { Direction } from "../utils";
import { useComponentValue } from "@dojoengine/react";
import Player from './player';
import "../App.css";
import { BurnerAccount } from '@dojoengine/create-burner';
import Game from './game';
import gifImage from '../assets/countdown.gif';
import './components.css';

interface RoundProps {
  account: BurnerAccount;
  entityId: Entity;
}

const Round: React.FC<RoundProps> = ({ account, entityId }) => {
  const [showGif, setShowGif] = useState(true);
  
  const {
      setup: {
          systemCalls: { move },
          clientComponents: { Board, CharactersInside },
      },
  } = useDojo();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowGif(false);
    }, 2000); // 2 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="image-container">
      {showGif && (
        <div>
            <div className="round-title">
                Round 1
            </div>
            <div className="gif-container">
                <img src={gifImage} alt="Loading animation" />
            </div>
        </div>
      )}
      {!showGif && (
        <div>
            <Game account={account} entityId={entityId} />
        </div>
      )}
    </div>
  );
};

export default Round;
