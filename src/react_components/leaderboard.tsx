import React, { useState } from 'react';
import './components.css';
import App from '../App';

const Leaderboard = () => {
  const [playAgain, setPlayAgain] = useState(false);

  const handlePlayAgain = () => {
    setPlayAgain(true);
  }

  return (
    <div>
      {!playAgain ? 
          (<div className='leaderboard-wrapper'>
            <h1>Leaderboard</h1>
          <div className="leaderboard-scores">
            <p>1. test - 100</p>
            <p>2. test2 - 90</p>
            <p>3. test3 - 80</p>
            <p>4. test4 - 70</p>
            <p>5. test5 - 60</p>
          </div>
          <div className='button-play-again-content'>
            <button className="button-play-again" onClick={handlePlayAgain}>Play Again</button>
          </div>
        </div>)
        :
          (<App />)
      }
    </div>

  );
};

export default Leaderboard;
