import React, { Component } from 'react';
import './App.css';
import Nav from './View/Nav'
import Footer from './View/Footer'

class App extends Component {
  render() {
    return (
      <div id="Wrapper">
        <header id="Site-Header">
          <div id="Header-Content">
            <img id="Header-Icon" alt="kwigbo" src="./favicon/kwigbo-80X80.png" />
          </div>
        </header>
        <div id="Content">
          <Nav />
          <div id="Push"></div>
        </div>
        <Footer />
      </div>
    )
  }
}

export default App;
