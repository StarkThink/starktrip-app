import React, { useState, useEffect } from 'react';
import { useDojo } from "../dojo/useDojo";
import { Entity } from "@dojoengine/recs";
import BoardComponent from './board';
import Leaderboard from './leaderboard';
import Modal from './modal';
import "../App.css";
import { BurnerAccount } from '@dojoengine/create-burner';
import { getGame } from '../dojo/utils/getGame';
import { decodeString } from '../dojo/utils/decodeString';
import { getMap } from '../dojo/utils/getMap';
import { getSpaceship } from '../dojo/utils/getSpaceship';
import { GAME_ID } from '../constants/localStorage';
import gifImage from '../assets/countdown.gif';
import './components.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface GameProps {
  account: BurnerAccount;
  entityId: Entity;
  gameId: number;
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const Game: React.FC<GameProps> = ({ account, entityId, gameId }) => {
  const {
      setup: {
          systemCalls: { create_round, end_game },
          clientComponents: { Board, Tile, Game, Spaceship },
      },
  } = useDojo();

  // get current component values
  const game = getGame(gameId, Game) ?? { player_name: 'Unknown Player', round: 1, score: 0 };
  const map = getMap(gameId, Tile, Board);
  const spaceship = getSpaceship(gameId, Spaceship) ?? { pos_x: 0, pos_y: 0 };

  const matrix = map.matrix;

  const [showModal, setShowModal] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [showRound, setShowRound] = useState(true); // initially show round animation

  const handleModalToggle = () => {
    setShowModal(!showModal);
  };

  const handleEndGame = async () => {
    await end_game(account.account, gameId);
    setGameEnded(true);
  };

  const handleBoardValueChange = async (gameActive: boolean, gameWin: boolean) => {
    if (gameWin) {
      // Assuming create_round is an async function or a function that returns a promise
      await create_round(account.account, gameId);
      toast.success('You won the game! 🚀', {
        position: "top-center",
        autoClose: false,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      await sleep(2000);
      setShowRound(true);
    } else {
      toast.error('Game Over :(', {
        position: "top-center",
        autoClose: false,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setGameEnded(true);
    }
  };

  useEffect(() => {
    if (showRound) {
      const timer = setTimeout(() => {
        setShowRound(false);
      }, 2000); // 2 seconds

      return () => clearTimeout(timer);
    }
  }, [showRound]);

  return (
    <div className="image-container">
      {gameEnded ? (
        <Leaderboard />
      ) : (
        <div className="game-content">
          {showRound ? (
            <div className="image-container">
              <div className="round-title">
                Round {game.round}
              </div>
              <div className="gif-container">
                <img src={gifImage} alt="Loading animation" />
              </div>
            </div>
          ) : (
            <>
              <div className="board-header">
                <div>
                  <p>Player: {decodeString(game.player_name)}</p>
                  <p>Round: {game.round}</p>
                  <p>Score: {game.score}</p>
                  <p className="how-to-play" onClick={handleModalToggle}>
                    How to play?
                  </p>
                </div>
                <div className="buttons-container">
                  <div className="button-container">
                    <button className="end-game-button" onClick={handleEndGame}>End Game</button>
                  </div>
                </div>
              </div>
              <div className="board-content">
                <BoardComponent
                  matrix={matrix}
                  player_x={spaceship.pos_x}
                  player_y={spaceship.pos_y}
                  account={account}
                  game_id={gameId}
                  initialGas={map.max_movements}
                  onValueChange={handleBoardValueChange}
                />
              </div>
            </>
          )}
        </div>
      )}
      <Modal show={showModal} handleClose={handleModalToggle}>
        <h2>How to Play</h2>
        <p>
          Your goal is to collect all missing characters and bring them to their corresponding planet. Make sure
          not to run out of gas!
        </p>
      </Modal>
      <ToastContainer 
          position="top-center"
          limit={1}
          autoClose={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          theme="light"
        />
    </div>
  );
};

export default Game;
