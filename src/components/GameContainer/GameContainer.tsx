import React, { useState, useEffect } from 'react';
import ChooseCharacters from '../ChooseCharacters/ChooseCharacters';
import Game from '../Game/Game';
import { sanitizeStage } from '../../data/helperFuncs';

const GameContainer = (props: any) => {
  const [stage, setStage] = useState(1);
  const [isLocked, setIsLocked] = useState(false);
  const [decidedGroups, setDecidedGroups] = useState(
    JSON.parse(localStorage.getItem('decidedGroups') || '[]') || []
  );

  useEffect(() => {
    if (!isLocked) {
      setStage(1);
    }
  }, [props.gameState, isLocked]);

  const startGame = (decidedGroups: any) => {
    setDecidedGroups(decidedGroups);
    localStorage.setItem('decidedGroups', JSON.stringify(decidedGroups));
    props.handleStartGame();
  };

  const stageUp = () => {
    setStage((prevStage) => prevStage + 1);
  };

  const lockStage = (stage: any, forceLock: any) => {
    const sanitizedStage = sanitizeStage(stage);
    if (forceLock) {
      setStage(sanitizedStage);
      setIsLocked(true);
    } else {
      setStage(sanitizedStage);
      setIsLocked((prevIsLocked) => !prevIsLocked);
    }
  };

  return (
    <div>
      {props.gameState === 'chooseCharacters' && (
        <ChooseCharacters
          selectedGroups={decidedGroups}
          handleStartGame={startGame}
          stage={stage}
          isLocked={isLocked}
          lockStage={lockStage}
        />
      )}
      {props.gameState === 'game' && (
        <Game
          decidedGroups={decidedGroups}
          handleEndGame={props.handleEndGame}
          stageUp={stageUp}
          stage={stage}
          isLocked={isLocked}
          lockStage={lockStage}
        />
      )}
    </div>
  );
};

export default GameContainer;
