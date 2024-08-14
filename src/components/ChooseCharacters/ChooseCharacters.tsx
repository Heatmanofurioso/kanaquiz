import React, {Component} from 'react';
import Switch from 'react-toggle-switch';
import {kanaDictionary} from '../../data/kanaDictionary';
import './ChooseCharacters.scss';
import CharacterGroup from './CharacterGroup';

interface IChooseCharactersProps {
  selectedGroups?: any;
  handleStartGame?: any;
  stage?: any;
  isLocked?: any;
  lockStage?: any;
}

class ChooseCharacters extends Component<IChooseCharactersProps, any> {

  startRef: any;
  state: any = {
    errMsg: '',
    selectedGroups: this.props.selectedGroups,
    showAlternatives: [],
    showSimilars: [],
    startIsVisible: true
  }

  componentDidMount() {
    this.testIsStartVisible();
    window.addEventListener('resize', this.testIsStartVisible);
    window.addEventListener('scroll', this.testIsStartVisible);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.testIsStartVisible);
    window.removeEventListener('scroll', this.testIsStartVisible);
  }

  componentDidUpdate(prevProps: any, prevState: any) {
    this.testIsStartVisible();
  }

  testIsStartVisible = () => {
    if (this.startRef) {
      const rect = this.startRef.getBoundingClientRect();
      if (rect.y > window.innerHeight && this.state.startIsVisible)
        this.setState({startIsVisible: false});
      else if (rect.y <= window.innerHeight && !this.state.startIsVisible)
        this.setState({startIsVisible: true});
    }
  }

  scrollToStart(event: any) {
    if (this.startRef) {
      const rect = this.startRef.getBoundingClientRect();
      const absTop = rect.top + window.scrollY;
      const scrollPos = absTop - window.innerHeight + 50;
      window.scrollTo(0, scrollPos > 0 ? scrollPos : 0);
    }
  }

  getIndex(groupName: any) {
    return this.state.selectedGroups.indexOf(groupName);
  }

  isSelected(groupName: any) {
    return this.getIndex(groupName) > -1;
  }

  removeSelect(groupName: any) {
    if (this.getIndex(groupName) < 0)
      return;
    let newSelectedGroups = this.state.selectedGroups.slice();
    newSelectedGroups.splice(this.getIndex(groupName), 1);
    this.setState({selectedGroups: newSelectedGroups});
  }

  addSelect(groupName: any) {
    this.setState({errMsg: '', selectedGroups: this.state.selectedGroups.concat(groupName)});
  }

  toggleSelect = (groupName: any) => {
    if (this.getIndex(groupName) > -1)
      this.removeSelect(groupName);
    else
      this.addSelect(groupName);
  }

  selectAll(whichKana: any, altOnly = false, similarOnly = false) {
    const thisKana = kanaDictionary[whichKana];
    let newSelectedGroups = this.state.selectedGroups.slice();
    Object.keys(thisKana).forEach(groupName => {
      if (!this.isSelected(groupName) && (
        (altOnly && groupName.endsWith('_a')) ||
        (similarOnly && groupName.endsWith('_s')) ||
        (!altOnly && !similarOnly)
      ))
        newSelectedGroups.push(groupName);
    });
    this.setState({errMsg: '', selectedGroups: newSelectedGroups});
  }

  selectNone(whichKana: any, altOnly = false, similarOnly = false) {
    let newSelectedGroups: any = [];
    this.state.selectedGroups.forEach((groupName:any) => {
      let mustBeRemoved = false;
      Object.keys(kanaDictionary[whichKana]).forEach(removableGroupName => {
        if (removableGroupName === groupName && (
          (altOnly && groupName.endsWith('_a')) ||
          (similarOnly && groupName.endsWith('_s')) ||
          (!altOnly && !similarOnly)
        ))
          mustBeRemoved = true;
      });
      if (!mustBeRemoved)
        newSelectedGroups.push(groupName);
    });
    this.setState({selectedGroups: newSelectedGroups});
  }

  toggleAlternative(whichKana: string, postfix: any) {
    let show: any = postfix == '_a' ? this.state.showAlternatives : this.state.showSimilars;
    const idx = show.indexOf(whichKana);
    if (idx >= 0)
      show.splice(idx, 1);
    else
      show.push(whichKana)
    if (postfix == '_a')
      this.setState({showAlternatives: show});
    if (postfix == '_s')
      this.setState({showSimilars: show});
  }

  getSelectedAlternatives(whichKana: any, postfix: any) {
    return this.state.selectedGroups.filter((groupName: any) => {
      return groupName.startsWith(whichKana == 'hiragana' ? 'h_' : 'k_') &&
        groupName.endsWith(postfix);
    }).length;
  }

  getAmountOfAlternatives(whichKana: any, postfix: any) {
    return Object.keys(kanaDictionary[whichKana]).filter(groupName => {
      return groupName.endsWith(postfix);
    }).length;
  }

  alternativeToggleRow(whichKana: any, postfix: any, show: any) {
    let checkBtn = "glyphicon glyphicon-small glyphicon-"
    let status;
    if (this.getSelectedAlternatives(whichKana, postfix) >= this.getAmountOfAlternatives(whichKana, postfix))
      status = 'check';
    else if (this.getSelectedAlternatives(whichKana, postfix) > 0)
      status = 'check half';
    else
      status = 'unchecked'
    checkBtn += status

    return <div
      key={'alt_toggle_' + whichKana + postfix}
      onClick={() => this.toggleAlternative(whichKana, postfix)}
      className="list-group-item"
    >
      <span
        className={checkBtn}
        onClick={e => {
          if (status == 'check')
            this.selectNone(whichKana, postfix == '_a', postfix == '_s');
          else if (status == 'check half' || status == 'unchecked')
            this.selectAll(whichKana, postfix == '_a', postfix == '_s');
          e.stopPropagation();
        }}
      ></span>
      {
        show ? <span className="toggle-caret">&#9650;</span>
          : <span className="toggle-caret">&#9660;</span>
      }
      {
        postfix == '_a' ? 'Alternative characters (ga · ba · kya..)' :
          'Look-alike characters'
      }
    </div>
  }

  showGroupRows(whichKana: any, showAlternatives: any, showSimilars = false) {
    const thisKana = kanaDictionary[whichKana];
    let rows: any = [];
    Object.keys(thisKana).forEach((groupName, idx) => {
      if (groupName == "h_group11_a" || groupName == "k_group13_a")
        rows.push(this.alternativeToggleRow(whichKana, "_a", showAlternatives));
      if (groupName == "k_group11_s")
        rows.push(this.alternativeToggleRow(whichKana, "_s", showSimilars));

      if ((!groupName.endsWith("a") || showAlternatives) &&
        (!groupName.endsWith("s") || showSimilars)) {
        rows.push(<CharacterGroup
          key={idx}
          groupName={groupName}
          selected={this.isSelected(groupName)}
          characters={thisKana[groupName].characters}
          handleToggleSelect={this.toggleSelect}
        />);
      }
    });

    return rows;
  }

  startGame() {
    if (this.state.selectedGroups.length < 1) {
      this.setState({errMsg: 'Choose at least one group!'});
      return;
    }
    this.props.handleStartGame(this.state.selectedGroups);
  }

  makeDivs() {
    return Object.keys(kanaDictionary).map((kana: any) => {
      return (<div className="col-sm-6">
        <div className="card">
          <div className="card-header">{kana}</div>
          <div className="p-5 selection-areas">
            {this.showGroupRows(kana, this.state.showAlternatives.indexOf(kana) >= 0, this.state.showSimilars.indexOf(kana) >= 0)}
          </div>
          <div className="card-footer text-center">
            <a href="#" onClick={() => this.selectAll(kana)}>All</a> &nbsp;&middot;&nbsp; <a
            href="#"
            onClick={() => this.selectNone(kana)}>None</a>
            &nbsp;&middot;&nbsp; <a href="#" onClick={() => this.selectAll(kana, true)}>All alternative</a>
            &nbsp;&middot;&nbsp; <a href="#" onClick={() => this.selectNone(kana, true)}>No alternative</a>
          </div>
        </div>
      </div>);
    });
  }

  render() {
    return (
      <div className="choose-characters">
        <div className="">
          <div className="col-12">
            <div className="card">
              <div className="p-2 welcome">
                <h4>Welcome to Kanji Pro!</h4>
                <p>Please choose the groups of characters that you'd like to be studying.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="">
          {this.makeDivs()}
          <div className="col-sm-3 col-12 float-right">
            <span className="float-right lock">
              <div className="form-check">
                {
                  this.props.isLocked &&
                <input  type="number" min="1" max="5"
                        onChange={(e) => this.props.lockStage(e.target.value, true)}
                        value={this.props.stage}/>
                }
                <label className="form-check-label" htmlFor="flexRadioCheckedDisabled">
                  Lock to stage&nbsp;
                </label>
              </div>


              <Switch className="form-switch-sm" onClick={() => this.props.lockStage(1)}
                      on={this.props.isLocked}/></span>
          </div>
          <div className="col-sm-offset-3 col-sm-6 col-12 text-center start-button-div">
            {
              this.state.errMsg != '' &&
              <div className="error-message">{this.state.errMsg}</div>
            }
            <button ref={c => this.startRef = c} className="btn btn-danger startgame-button"
                    onClick={() => this.startGame()}>Start the Quiz!
            </button>
          </div>
          <div className="down-arrow"
               style={{display: this.state.startIsVisible ? 'none' : 'block'}}
               onClick={(e: any) => this.scrollToStart(e)}
          >
            Start
          </div>
        </div>
      </div>
    );
  }
}

export default ChooseCharacters;
