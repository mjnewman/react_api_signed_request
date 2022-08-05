import React, { Component } from 'react';
import Web3 from 'web3';

class App extends Component {
  
  state = { 
    web3: null,
    accounts: null,
    contract: window.contract,
    sig: null,
    api: window.api,
    msg: window.message,
    poap: null,
    user: null,
    email: null,
    address1: null,
    address2: null,
    city: null,
    state: null,
    postcode: null,
    country: null,
    product: null,
    clamied: null
  };

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

  doWalletConnect = async () => {
    const { web3, contract, poap, sig, api, msg, user, claimed } = this.state;
    try {
      await window.ethereum.enable();
      const accounts = await web3.eth.getAccounts();
      
      const instance = new web3.eth.Contract(
        [{"inputs":[{"internalType": "address","name": "owner","type": "address"}],"name": "balanceOf","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"}],
        contract,
      );

      const nftCount = await instance.methods.balanceOf(accounts[0]).call()
      console.log('balanceOf :: ', nftCount);
      const hasNft = nftCount > 0 ? true : false;
      
      if (hasNft) {
        console.log('hasNft')
        try {
          var url = api + 'api/user/';
          var signature = await web3.eth.personal.sign(msg, accounts[0])
    
          console.log(accounts[0])
          console.log(msg)
          console.log(signature)
          
          const options = {
            method: 'POST',
            body: JSON.stringify({ message: msg, wallet: accounts[0], signature: signature })
          };
          
          const response = await fetch(url, options)
          const json = await response.json()
          console.log(json)
          
          this.setState({sig: signature, user: json, claimed: json.product})
        } catch (error) {
          console.log(error);
        }
      }      

      this.setState({ web3, accounts, poap: hasNft });
    } catch (error) {
      alert('Failed to load web3 or accounts.');
      console.error(error);
    }
  };

  doCheckIn = async () => {
    const { web3, accounts, sig, api, msg, user } = this.state;
    
    try {
      var url = api + 'api/user/';
      var signature = await web3.eth.personal.sign(msg, accounts[0])

      console.log(accounts[0])
      console.log(msg)
      console.log(signature)
      
      const options = {
        method: 'POST',
        body: JSON.stringify({ message: msg, wallet: accounts[0], signature: signature })
      };
      
      const response = await fetch(url, options)
      const json = await response.json()
      console.log(json)

      this.setState({sig: signature, user: json})
    } catch (error) {
      console.log(error);
    }
  };

  doClaim = async () => {
    const { accounts, sig, api, msg, email, address1, address2, city, state, postcode, country, product } = this.state;
    try {
      var url = api + 'api/claim/';
      
      const options = {
        method: 'POST',
        body: JSON.stringify(
          { 
            message: msg, 
            wallet: accounts[0], 
            signature: sig,
            email: email,
            address1: address1,
            address2: address2,
            city: city,
            state: state,
            postcode: postcode,
            country: country,
            product: product
          }
        )
      };
      
      const response = await fetch(url,options)
      const json = await response.json()
      console.log(json)
      if (json.success) {
        this.setState({claimed: true})
      } else {
        alert(json.message);
      }

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
            <button onClick={this.doWalletConnect}>
              Connect Your Wallet
            </button>
          </div>
        }
        {this.state.poap === false &&
          <div>
            <h2>No POAP Detected</h2>
            <p>Please Claim Your POAP</p>
          </div>
        }
        {this.state.poap && this.state.accounts && !this.state.user && !this.state.leaderboard &&
          <div>
            <h3>Declined Signed Request</h3>
            <button onClick={(e) => this.doCheckIn()}>
              Please Check In
            </button>
          </div>
        }
        {this.state.poap && this.state.user && !this.state.claimed &&
          <div>
            <h3>Claim your merch {this.state.user.firstname}!</h3>
            <input type="text" placeholder="Email" onChange={e => this.setState({email: e.target.value})} /><br/>
            <input type="text" placeholder="Address 1" onChange={e => this.setState({address1: e.target.value})} /><br/>
            <input type="text" placeholder="Address 2" onChange={e => this.setState({address2: e.target.value})} /><br/>
            <input type="text" placeholder="City" onChange={e => this.setState({city: e.target.value})} /><br/>
            <input type="text" placeholder="State" onChange={e => this.setState({state: e.target.value})} /><br/>
            <input type="text" placeholder="Postcode" onChange={e => this.setState({postcode: e.target.value})} /><br/>
            <input type="text" placeholder="Country" onChange={e => this.setState({country: e.target.value})} /><br/>
            <input type="text" placeholder="Product" onChange={e => this.setState({product: e.target.value})} /><br/>
            <button onClick={(e) => this.doClaim()}>
              Claim Merch
            </button>
          </div>
        }
        {this.state.claimed &&
          <div>
            <h3>Merch claimed!</h3>
          </div>
        }
      </div>
    );
  }
}

export default App;
