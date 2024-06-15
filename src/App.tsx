import { Entity } from "@dojoengine/recs";
import { useEffect, useState } from "react";
import "./App.css";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { useDojo } from "./dojo/useDojo";
import Game  from "./react_components/game";
import gifImage from './assets/starktrip.gif'; // Adjust the path as necessary

const App: React.FC = () => {
    const {
        setup: {
            systemCalls: { spawn },
            clientComponents: { Position, Moves },
        },
        account,
    } = useDojo();
    const [startGame, setStartGame] = useState(false);

    const [clipboardStatus, setClipboardStatus] = useState({
        message: "",
        isError: false,
    });
    const handleRestoreBurners = async () => {
        try {
            await account?.applyFromClipboard();
            setClipboardStatus({
                message: "Burners restored successfully!",
                isError: false,
            });
        } catch (error) {
            setClipboardStatus({
                message: `Failed to restore burners from clipboard`,
                isError: true,
            });
        }
    };

    const handlePlayClick = () => {
        spawn(account.account);
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
        return <Game account={account} entityId={entityId} />;
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
                        <input type="text" id="playerName" name="playerName" />
                    </div>
                    <div className="account-address">
                        <label htmlFor="playerName">Account</label>
                        <div className="account-display">{account.account.address}</div>
                    </div>
                    <div className="account-buttons">
                        <button onClick={() => account?.create()}>
                            {account?.isDeploying ? "Deploying Burner" : "Create Burner"}
                        </button>
                        {account && account?.list().length > 0 && (
                            <button onClick={async () => await account?.copyToClipboard()}>
                                Save Burners to Clipboard
                            </button>
                        )}
                        <button onClick={handleRestoreBurners}>
                            Restore Burners from Clipboard
                        </button>
                        {clipboardStatus.message && (
                            <div className={clipboardStatus.isError ? "error" : "success"}>
                                {clipboardStatus.message}
                            </div>
                        )}
                    </div>
                </div>
                <div className="centered-button">
                    <button onClick={handlePlayClick} className="pixel-art-button">Start</button>
                </div>
            </div>
        </div>
    );
    /*

            <div className="card">
                <div>{`burners deployed: ${account.count}`}</div>
                <div>
                    select signer:{" "}
                    <select
                        value={account ? account.account.address : ""}
                        onChange={(e) => account.select(e.target.value)}
                    >
                        {account?.list().map((account, index) => {
                            return (
                                <option value={account.address} key={index}>
                                    {account.address}
                                </option>
                            );
                        })}
                    </select>
                </div>
                <div>
                    <button onClick={() => account.clear()}>
                        Clear burners
                    </button>
                    <p>
                        You will need to Authorise the contracts before you can
                        use a burner. See readme.
                    </p>
                </div>
            </div>

            <div className="card">
                <button onClick={() => spawn(account.account)}>Spawn</button>
                <div>
                    Moves Left: {moves ? `${moves.remaining}` : "Need to Spawn"}
                </div>
                <div>
                    Position:{" "}
                    {position
                        ? `${position.vec.x}, ${position.vec.y}`
                        : "Need to Spawn"}
                </div>

                <div>{moves && moves.last_direction}</div>
            </div>

            <div className="card">
                <div>
                    <button
                        onClick={() =>
                            position && position.vec.y > 0
                                ? move(account.account, Direction.Up)
                                : console.log("Reach the borders of the world.")
                        }
                    >
                        Move Up
                    </button>
                </div>
                <div>
                    <button
                        onClick={() =>
                            position && position.vec.x > 0
                                ? move(account.account, Direction.Left)
                                : console.log("Reach the borders of the world.")
                        }
                    >
                        Move Left
                    </button>
                    <button
                        onClick={() => move(account.account, Direction.Right)}
                    >
                        Move Right
                    </button>
                </div>
                <div>
                    <button
                        onClick={() => move(account.account, Direction.Down)}
                    >
                        Move Down
                    </button>
                </div>
            </div>
        </div>
    );*/
}

export default App;
