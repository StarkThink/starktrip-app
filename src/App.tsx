import { Entity } from "@dojoengine/recs";
import { useEffect, useState } from "react";
import "./App.css";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { useDojo } from "./dojo/useDojo";
import Round  from "./react_components/Round";
import gifImage from './assets/starktrip.gif';
import { GAME_ID } from "./constants/localStorage";

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

    const [clipboardStatus, setClipboardStatus] = useState({
        message: "",
        isError: false,
    });

    const executeCreateGame = (username: string) => {
        console.log("Creating game...");
        createGame(account.account, username).then((newGameId) => {
          if (newGameId) {
            setGameId(newGameId);
            localStorage.setItem(GAME_ID, newGameId.toString());
            console.log(`game ${newGameId} created`);
          } else {
            setError(true);
          }
        });
    };

    const handlePlayClick = () => {
        if (playerName === '') {
            setClipboardStatus({ message: "Player name is required", isError: true });
            return;
        }
        let username = (document.getElementById("playerName") as HTMLInputElement)?.value ?? "Unknown Player";
        executeCreateGame(username);
        if (error) {
            console.log("Error creating game");
        }
        setStartGame(true);
    };

    useEffect(() => {
        if (clipboardStatus.message) {
            const timer = setTimeout(() => {
                setClipboardStatus({ message: "", isError: false });
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [clipboardStatus.message]);

    if (startGame) {
        const entityId = getEntityIdFromKeys([
            BigInt(account?.account.address),
        ]) as Entity;
        return <Round account={account} gameId={gameId} entityId={entityId} />;
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
                    <div className="error-container">
                        {clipboardStatus.isError && (
                            <div className="player-name-error">{clipboardStatus.message}</div>
                        )}
                    </div>
                </div>
                <div className="centered-button">
                    <button onClick={handlePlayClick} className="pixel-art-button">Start</button>
                </div>
            </div>
        </div>
    );
}

export default App;
