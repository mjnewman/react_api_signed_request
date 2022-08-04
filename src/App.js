import React, { Component } from 'react';
import Web3 from 'web3';


class App extends Component {
  
  state = { web3: null, accounts: null };

  componentDidMount = async () => {
    try {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        this.setState({ web3 });
      }
    } catch (error) {
      console.error(error);
    }
  };

  buttonClick = async () => {
    const { web3 } = this.state;
    try {
      const { web3 } = this.state;
      await window.ethereum.enable();
      const accounts = await web3.eth.getAccounts();

      this.setState({ web3, accounts });
    } catch (error) {
      alert('Failed to load web3 or accounts.');
      console.error(error);
    }
  };

  doCheckIn = async () => {
    const { web3, accounts } = this.state;
    try {
      var url = '/api/user/';
      var message = 'Sign this message to check in.';
      var signature = await web3.eth.personal.sign(message, accounts[0])

      console.log(accounts[0])
      console.log(message)
      console.log(signature)
      
      const options = {
        method: 'POST',
        body: JSON.stringify({ message: message, wallet: accounts[0], signature: signature })
      };
      
      const response = await fetch(url,options)
      const json = await response.json()
      console.log(json)
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const self = this;
    return (
      <div>
        {!this.state.web3 &&
          <div>
            <h2>No Wallet Detected</h2>
            <p>Please enable a wallet such as Metamask</p>
          </div>
        }
         {!this.state.accounts && this.state.web3 &&
            <div>
              <h3>Connect your wallet to get started</h3>
              <button onClick={this.buttonClick}>
                Connect Your Wallet
              </button>
            </div>
          }
          {this.state.accounts && !this.state.leaderboard &&
            <div>
              <h3>Get user data</h3>
              <button onClick={(e) => this.doCheckIn()}>
                  Get User Data
              </button>
            </div>
          }
        </div>
    );
  }
}

export default App;
