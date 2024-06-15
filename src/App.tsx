import { Entity } from "@dojoengine/recs";
import { useEffect, useState } from "react";
import "./App.css";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { useDojo } from "./dojo/useDojo";
import Round  from "./react_components/Round";
import gifImage from './assets/starktrip.gif';

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
        return <Round account={account} entityId={entityId} />;
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

                </div>
                <div className="centered-button">
                    <button onClick={handlePlayClick} className="pixel-art-button">Start</button>
                </div>
            </div>
        </div>
    );
}

export default App;
