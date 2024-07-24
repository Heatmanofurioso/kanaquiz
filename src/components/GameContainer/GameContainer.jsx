import React, {Component} from 'react';
import ChooseCharacters from '../ChooseCharacters/ChooseCharacters';
import Game from '../Game/Game';
import {sanitizeStage} from '../../data/helperFuncs';

class GameContainer extends Component {
  state = {
    stage: 1,
    isLocked: false,
    decidedGroups: JSON.parse(localStorage.getItem('decidedGroups') || null) || []
  }

  componentWillReceiveProps() {
    if (!this.state.isLocked)
      this.setState({stage: 1});
  }

  startGame = decidedGroups => {
    this.setState({decidedGroups: decidedGroups});
    localStorage.setItem('decidedGroups', JSON.stringify(decidedGroups));
    this.props.handleStartGame();
  }

  stageUp = () => {
    this.setState({stage: this.state.stage + 1});
  }

  lockStage = (stage, forceLock) => {
    stage = sanitizeStage(stage);
    // if(stage<1 || stage>4) stage=1; // don't use this to allow backspace
    if (forceLock)
      this.setState({stage: stage, isLocked: true});
    else
      this.setState({stage: stage, isLocked: !this.state.isLocked});
  }

  render() {
    return (
      <div>
        {this.props.gameState === 'chooseCharacters' &&
          <ChooseCharacters selectedGroups={this.state.decidedGroups}
                            handleStartGame={this.startGame}
                            stage={this.state.stage}
                            isLocked={this.state.isLocked}
                            lockStage={this.lockStage}
          />
        }
        {this.props.gameState === 'game' &&
          <Game decidedGroups={this.state.decidedGroups}
                handleEndGame={this.props.handleEndGame}
                stageUp={this.stageUp}
                stage={this.state.stage}
                isLocked={this.state.isLocked}
                lockStage={this.lockStage}
          />
        }
      </div>
    )
  }
}

export default GameContainer;
