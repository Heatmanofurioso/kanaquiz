import React, {Component} from 'react';
import ShowStage from './ShowStage';
import Question from './Question';

interface IGameProps {
  mapOptions?: any;
  stageUp?: any;
  lockStage?: any;
  handleEndGame?: any;
  stage?: any;
  isLocked?: any;
  decidedGroups?: any;
}

class Game extends Component<IGameProps, any> {
  state = {showScreen: 'stage'}

  componentDidMount() {
    this.setState({showScreen: 'stage'});
  }

  stageUp = () => {
    this.props.stageUp();
    this.setState({showScreen: 'stage'});
  }

  lockStage = (stage: any) => {
    this.setState({showScreen: 'question'});
    this.props.lockStage(stage);
  }

  showQuestion = () => {
    this.setState({showScreen: 'question'})
  }

  render() {
    return (
      <div>
        {
          this.state.showScreen === 'stage' &&
          <ShowStage lockStage={this.lockStage} handleShowQuestion={this.showQuestion}
                     handleEndGame={this.props.handleEndGame} stage={this.props.stage}/>
        }
        {
          this.state.showScreen === 'question' &&
          <Question isLocked={this.props.isLocked} handleStageUp={this.stageUp} stage={this.props.stage}
                    decidedGroups={this.props.decidedGroups}/>
        }
      </div>
    );
  }
}

export default Game;
