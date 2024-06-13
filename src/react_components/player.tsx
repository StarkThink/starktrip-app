import React from 'react';

interface PlayerProps {
  x: number;
  y: number;
}

const Player: React.FC<PlayerProps> = ({ x, y }) => {
  return (
    <div
      style={{
        width: '50px',
        height: '50px',
        backgroundColor: 'white',
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`
      }}
    />
  );
};

export default Player;
