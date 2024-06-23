import { Entity } from "@dojoengine/recs";
import { useEffect, useState } from "react";
import "./App.css";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { useDojo } from "./dojo/useDojo";
import Round  from "./react_components/Round";
import Game  from "./react_components/game";
import gifImage from './assets/starktrip.gif';
import { GAME_ID } from "./constants/localStorage";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App: React.FC = () => {
    const {
        setup: {
            systemCalls: { createGame },
            clientComponents: { Board, CharactersInside },
        },
        account,
    } = useDojo();
    const [startGame, setStartGame] = useState(false);
    const [gameId, setGameId] = useState<number>(
        Number(localStorage.getItem(GAME_ID)) ?? 0
      );
    const [error, setError] = useState(false);

    const [playerName, setPlayerName] = useState('');

    const executeCreateGame = (username: string) => {
        createGame(account.account, username).then((newGameId) => {
          if (newGameId) {
            setGameId(newGameId);
            localStorage.setItem(GAME_ID, newGameId.toString());
          } else {
            setError(true);
          }
        });
    };

    const handlePlayClick = () => {
        if (playerName === '') {
            toast.error('Player name is required', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            return;
        }
        executeCreateGame(playerName);
        if (error) {
            console.log("Error creating game");
        }
        setStartGame(true);
    };

    if (startGame) {
        const entityId = getEntityIdFromKeys([
            BigInt(account?.account.address),
        ]) as Entity;
        return <Game account={account} gameId={gameId} entityId={entityId} />;
    }

    return (
        <div className="image-container">
            <div className="account-container">
                <div className="logo-img">
                    <img src={gifImage} alt="Loading animation" />
                </div>
                <div>
                    <div className="account-player">
                        <label htmlFor="playerName">Player Name</label>
                        <input 
                            type="text" 
                            id="playerName" 
                            name="playerName" 
                            value={playerName} 
                            onChange={e => setPlayerName(e.target.value)} 
                        />
                    </div>
                </div>
                <div className="centered-button">
                    <button onClick={handlePlayClick} className="pixel-art-button">Start</button>
                    <ToastContainer 
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
            </div>
        </div>
    );
}

export default App;
