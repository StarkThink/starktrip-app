import React from 'react';
import './components.css';

const Leaderboard: React.FC = () => {
  return (
    <div className='leaderboard-wrapper'>
      <h1>Leaderboard</h1>
      <div className="leaderboard-scores">
        <p>1. test - 100</p>
        <p>2. test2 - 90</p>
        <p>3. test3 - 80</p>
        <p>4. test4 - 70</p>
        <p>5. test5 - 60</p>
      </div>
      <div className='button-play-again-content'>
        <button className="button-play-again">Play Again</button>
      </div>
    </div>
  );
};

export default Leaderboard;
