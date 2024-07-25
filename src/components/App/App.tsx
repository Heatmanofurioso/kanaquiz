import React, {Component} from 'react';
import './App.scss';
import Navbar from '../Navbar/Navbar';
import GameContainer from '../GameContainer/GameContainer';

const options = {};

class App extends Component<any, any> {
    state = {gameState: 'chooseCharacters'};

    startGame = () => {
        this.setState({gameState: 'game'});
    }

    endGame = () => {
        this.setState({gameState: 'chooseCharacters'});
    }

    componentWillUpdate(nextProps: any, nextState: any) {
        // This is primarily for demo site purposes. Hides #footer when game is on.
        if (document.getElementById('footer')) {
            if (nextState.gameState == 'chooseCharacters')
                { // @ts-ignore
                  document.getElementById('footer').style.display = "block";
                }
            else
                { // @ts-ignore
                  document.getElementById('footer').style.display = "none";
                }
        }
    }

    componentWillMount() {
        if (document.getElementById('footer'))
            { // @ts-ignore
              document.getElementById('footer').style.display = "block";
            }
    }

    render() {
        return (
            <div>
                <Navbar
                    gameState={this.state.gameState}
                    handleEndGame={this.endGame}
                />
                <div className="outercontainer">
                    <div className="container game">
                        <GameContainer
                            gameState={this.state.gameState}
                            handleStartGame={this.startGame}
                            handleEndGame={this.endGame}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export default App;
