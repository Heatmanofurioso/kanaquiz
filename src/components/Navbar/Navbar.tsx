import React, { Component } from 'react';
import './Navbar.scss';

class Navbar extends Component<any, any> {
  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
        <div className="container">
          <a className="navbar-brand" href="#">Kanji Pro</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              {this.props.gameState === 'game' ? (
                <li className="nav-item">
                  <a className="nav-link" href="#" onClick={this.props.handleEndGame}>
                    <i className="fas fa-arrow-left"></i> Back to menu
                  </a>
                </li>
              ) : (
                <li className="nav-item active">
                  <span className="navbar-text">Kanji Pro</span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

export default Navbar;
