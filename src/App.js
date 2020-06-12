import React, { Component } from 'react';
import ReactFullpage from '@fullpage/react-fullpage';
import './App.css';

class App extends Component {
  render() {
    return (
      <ReactFullpage
        //fullpage options
        licenseKey = {'YOUR_KEY_HERE'}
        scrollingSpeed = {1000} /* Options here */
        render={({ state, fullpageApi }) => {
          return (
            <ReactFullpage.Wrapper>
              <div className="section">
                <div className="Wallet">
                  <header className="Wallet-Header">
                    <img alt="kwigbo" src="./favicon/apple-touch-icon.png" />
                  </header>
                </div>
              </div>
            </ReactFullpage.Wrapper>
          )
        }}
      />
    )
  }
}

export default App;
