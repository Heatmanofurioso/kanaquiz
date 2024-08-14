import React, {Component} from 'react';
import {kanaDictionary} from '../../data/kanaDictionary';
import {quizSettings} from '../../data/quizSettings';
import {
  arrayContains,
  cartesianProduct,
  findRomajisAtKanaKey,
  getRandomFromArray,
  intersection,
  removeFromArray,
  shuffle
} from '../../data/helperFuncs';
import './Question.scss';

const kana_count = 3;

class Question extends Component<any, any> {
  state = {
    previousQuestion: [],
    previousAnswer: '',
    previousAnswerWasCorrect: false,
    currentAnswer: '',
    currentQuestion: [],
    answerOptions: [],
    stageProgress: 0
  }
  askableKanaKeys: any;
  currentQuestion: any;
  previousQuestion: any;
  previousAnswer: any;
  answerOptions: any;
  allowedAnswers: any;
  // this.setNewQuestion = this.setNewQuestion.bind(this);
  // this.handleAnswer = this.handleAnswer.bind(this);
  // this.handleAnswerChange = this.handleAnswerChange.bind(this);
  // this.handleSubmit = this.handleSubmit.bind(this);
  // }
  previousAnswerWasCorrect: any;
  stageProgress: any;
  private previousAllowedAnswers: any;
  private askableKanas: any;
  private askableRomajis: any;

  constructor(props: any) {
    super(props);
    this.initializeCharacters();
  }

  getRandomKanas(amount: any, include: any, exclude: any) {
    let randomizedKanas = this.askableKanaKeys.slice();

    if (exclude && exclude.length > 0) {
      // we're excluding previous question when deciding a new question
      randomizedKanas = removeFromArray(exclude, randomizedKanas);
    }

    if (include && include.length > 0) {
      // we arrive here when we're deciding answer options (included = currentQuestion)

      // remove included kana
      randomizedKanas = removeFromArray(include, randomizedKanas);
      shuffle(randomizedKanas);

      // cut the size to make looping quicker
      randomizedKanas = randomizedKanas.slice(0, 20);

      // let's remove kanas that have the same answer as included
      let searchFor = findRomajisAtKanaKey(include, kanaDictionary);
      randomizedKanas = randomizedKanas.filter((character: any) => {
        return intersection(searchFor, findRomajisAtKanaKey(character, kanaDictionary));
      });

      // now let's remove "duplicate" kanas (if two kanas have same answers)
      let tempRandomizedKanas = randomizedKanas.slice();
      randomizedKanas = randomizedKanas.filter((r: any) => {
        let dupeFound = false;
        searchFor = findRomajisAtKanaKey(r, kanaDictionary);
        tempRandomizedKanas.shift();
        tempRandomizedKanas.forEach((w: any) => {
          return intersection(findRomajisAtKanaKey(w, kanaDictionary), searchFor) > 0;
        });
        return !dupeFound;
      });

      // alright, let's cut the array and add included to the end
      randomizedKanas = randomizedKanas.slice(0, amount - 1); // -1 so we have room to add included
      randomizedKanas.push(include);
      shuffle(randomizedKanas);
    } else {
      shuffle(randomizedKanas);
      randomizedKanas = randomizedKanas.slice(0, amount);
    }
    console.log('randomizedKanas', randomizedKanas);
    return randomizedKanas;
  }

  setNewQuestion() {
    let numberOfKanas = 1;
    if (this.props.stage === 4) {
      numberOfKanas = kana_count;
    } else if (this.props.stage === 5) {
      numberOfKanas = kana_count + 5;
    }
    this.currentQuestion = this.getRandomKanas(numberOfKanas, false, this.previousQuestion);
    this.setState({currentQuestion: this.currentQuestion});
    this.setAnswerOptions();
    this.setAllowedAnswers();
    // console.log(this.currentQuestion);
  }

  setAnswerOptions() {
    this.answerOptions = this.getRandomKanas(kana_count, this.currentQuestion[0], false);
    this.setState({answerOptions: this.answerOptions});
    // console.log(this.answerOptions);
  }

  setAllowedAnswers() {
    // console.log(this.currentQuestion);
    this.allowedAnswers = [];
    if (this.props.stage === 1 || this.props.stage === 3)
      this.allowedAnswers = findRomajisAtKanaKey(this.currentQuestion, kanaDictionary);
    else if (this.props.stage === 2)
      this.allowedAnswers = this.currentQuestion;
    else if (this.props.stage === 4 || this.props.stage === 5) {
      let tempAllowedAnswers: any = [];

      this.currentQuestion.forEach((key: any) => {
        tempAllowedAnswers.push(findRomajisAtKanaKey(key, kanaDictionary));
      });

      cartesianProduct(tempAllowedAnswers).forEach(answer => {
        this.allowedAnswers.push(answer.join(''));
      });
    }
    // console.log(this.allowedAnswers);
  }

  handleAnswer = (answer: any) => {
    // @ts-ignore
    if (this.props.stage <= 2) document.activeElement.blur(); // reset answer button's :active
    this.previousQuestion = this.currentQuestion;
    this.setState({previousQuestion: this.previousQuestion});
    this.previousAnswer = answer;
    this.setState({previousAnswer: this.previousAnswer});
    this.previousAllowedAnswers = this.allowedAnswers;
    if (this.isInAllowedAnswers(this.previousAnswer)) {
      this.stageProgress = this.stageProgress + 1;
      this.previousAnswerWasCorrect = true;
    } else {
      this.stageProgress = this.stageProgress > 0 ? this.stageProgress - 1 : 0;
      this.previousAnswerWasCorrect = false
    }
    this.setState({
      stageProgress: this.stageProgress,
      previousAnswerWasCorrect: this.previousAnswerWasCorrect
    });
    // @ts-ignore
    if (this.stageProgress >= quizSettings.stageLength[this.props.stage] && !this.props.isLocked) {
      setTimeout(() => {
        this.props.handleStageUp()
      }, 300);
    } else
      this.setNewQuestion();
  }

  initializeCharacters() {
    this.askableKanas = {};
    this.askableKanaKeys = [];
    this.askableRomajis = [];
    this.previousQuestion = '';
    this.previousAnswer = '';
    this.stageProgress = 0;
    this.previousAnswerWasCorrect = false;
    Object.keys(kanaDictionary).forEach(whichKana => {
      // console.log(whichKana); // 'hiragana' or 'katakana'
      Object.keys(kanaDictionary[whichKana]).forEach(groupName => {
        // console.log(groupName); // 'h_group1', ...
        // do we want to include this group?
        if (arrayContains(groupName, this.props.decidedGroups)) {
          // let's merge the group to our askableKanas
          this.askableKanas = Object.assign(this.askableKanas, kanaDictionary[whichKana][groupName]['characters']);
          Object.keys(kanaDictionary[whichKana][groupName]['characters']).forEach(key => {
            // let's add all askable kana keys to array
            this.askableKanaKeys.push(key);
            this.askableRomajis.push(kanaDictionary[whichKana][groupName]['characters'][key][0]);
          });
        }
      });
    });
    console.log(this.askableKanas);
  }

  getAnswerType() {
    if (this.props.stage === 2) return 'kana';
    else return 'romaji';
  }

  getShowableQuestion() {
    if (this.getAnswerType() == 'kana')
      return getRandomFromArray(findRomajisAtKanaKey(this.state.currentQuestion, kanaDictionary));
    else return this.state.currentQuestion;
  }

  getPreviousResult() {
    let resultString: any;
    // console.log(this.previousAnswer);
    if (this.previousQuestion == '')
      resultString = <div className="previous-result none">Let's go! Which character is this?</div>
    else {
      let rightAnswer = (
        this.props.stage === 2 ?
          findRomajisAtKanaKey(this.previousQuestion, kanaDictionary).join('/')
          : this.previousQuestion.join('')
      ) + ' = ' + this.previousAllowedAnswers.join('/ ');

      if (this.state.previousAnswerWasCorrect)
        resultString = (
          <div className="previous-result correct" title="Correct answer!">
            <span className="float-left glyphicon glyphicon-none"></span>{rightAnswer}<span
            className="float-right glyphicon glyphicon-ok"></span>
          </div>
        );
      else
        resultString = (
          <div className="previous-result wrong" title="Wrong answer!">
            <span className="float-left glyphicon glyphicon-none"></span>{rightAnswer}<span
            className="float-right glyphicon glyphicon-remove"></span>
            <br/>
            <span className="previous-answer">(You answered: {this.previousAnswer})</span>
          </div>
        );
    }
    return resultString;
  }

  isInAllowedAnswers(previousAnswer: any) {
    console.log(previousAnswer);
    console.log(this.allowedAnswers);
    return arrayContains(previousAnswer, this.previousAllowedAnswers);
  }

  handleAnswerChange = (e: any) => {
    this.setState({currentAnswer: e.target.value.replace(/\s+/g, '')});
  }

  handleSubmit = (e: any) => {
    e.preventDefault();
    if (this.state.currentAnswer != '') {
      this.handleAnswer(this.state.currentAnswer.toLowerCase());
      this.setState({currentAnswer: ''});
    }
  }

  componentDidMount() {
    this.setNewQuestion();
  }

  render() {
    let btnClass = "btn btn-secondary answer-button";
    if ('ontouchstart' in window)
      btnClass += " no-hover"; // disables hover effect on touch screens
    // @ts-ignore
    let stageProgressPercentage = Math.round((this.state.stageProgress / quizSettings.stageLength[this.props.stage]) * 100) + '%';
    let stageProgressPercentageStyle = {width: stageProgressPercentage}
    // @ts-ignore
    return (
      <div className="text-center question col-12">
        {this.getPreviousResult()}
        <div className="big-character">{this.getShowableQuestion()}</div>
        <div className="answer-container">
          {
            this.props.stage < 3 ?
              this.state.answerOptions.map((answer, idx) => {
                // @ts-ignore
                return <AnswerButton answer={answer}
                                     className={btnClass}
                                     key={idx}
                                     answertype={this.getAnswerType()}
                                     handleAnswer={this.handleAnswer}/>
              })
              : <div className="answer-form-container">
                <form onSubmit={this.handleSubmit}>
                  <input autoFocus className="answer-input" type="text" value={this.state.currentAnswer}
                         onChange={this.handleAnswerChange}/>
                </form>
              </div>
          }
        </div>
        <div className="progress">
          <div className="progress-bar progress-bar-info"
               role="progressbar"
               aria-valuenow={this.state.stageProgress}
               aria-valuemin={0}
               aria-valuemax={quizSettings.stageLength[this.props.stage]}
               style={stageProgressPercentageStyle}
          >
            <span>Stage {this.props.stage} {this.props.isLocked ? ' (Locked)' : ''}</span>
          </div>
        </div>
      </div>
    );
  }

}

class AnswerButton extends Component {
  getShowableAnswer() {
    // @ts-ignore
    if (this.props.answertype === 'romaji') {
      // @ts-ignore
      const possibleAnswers = findRomajisAtKanaKey(this.props.answer, kanaDictionary);
      // get random romajis from the list of array to show as option
      return getRandomFromArray(possibleAnswers);
    } else {
      // @ts-ignore
      return this.props.answer;
    }
  }

  render() {
    return (
      // @ts-ignore
      <button className={this.props.className}
        // @ts-ignore
              onClick={() => this.props.handleAnswer(this.getShowableAnswer())}>{this.getShowableAnswer()}</button>
    );
  }
}

export default Question;
