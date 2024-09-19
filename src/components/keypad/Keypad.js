import React from 'react';
import './Keypad.scss';

const Keypad = ({ onKeyPress }) => {
  return (
    <div className="keypad">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, '.'].map((key) => (
        <button key={key} onClick={() => onKeyPress(key)}>
          {key}
        </button>
      ))}
    </div>
  );
};

export default Keypad;
