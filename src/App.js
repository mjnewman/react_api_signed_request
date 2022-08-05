import React, { Component } from 'react';
import Web3 from 'web3';

import { Container, Row, Col, Card, Button, Table } from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';

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

    // {!this.state.accounts && this.state.web3 &&
    //   <button onClick={this.doWalletConnect} className="btn btn-lg btn-secondary fw-bold">Learn more</button>
    // }
    return (
      <div>

        <header>
          <div className="collapse bg-dark">
              <div className="container">
                  <div className="row">
                      <div className="col-sm-8 col-md-7 py-4">
                          <h4 className="text-white">Welcome!</h4>
                          <p className="text-muted">Connect your wallet to immerse yourself into web3</p>
                      </div>
                  </div>
              </div>
          </div>
          <div className="navbar navbar-dark bg-dark sticky-top">
              <div className="container">
                  <span className="navbar-brand d-flex align-items-center">
                      <img src="media/logo.png" className="logo"/>
                  </span>
                  <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarHeader" aria-controls="navbarHeader" aria-expanded="false" aria-label="Toggle navigation">
                      <span className="navbar-toggler-icon"></span>
                  </button>
              </div>
          </div>
        </header>

        <section className="py-5 text-center cover">
            <div className="container">
              <div className="row py-lg-5">
                  <div className="col-lg-6 col-md-8 mx-auto">
                      <h1 className="">Welcome!</h1>
                      <p className="lead">Connect your wallet to immerse yourself into web3</p>
                      {!this.state.accounts && this.state.web3 &&
                        <p>
                            <button onClick={this.doWalletConnect} className="btn btn-primary my-2">Connect Your Wallet</button>
                        </p>
                      }
                  </div>
              </div>
            </div>
        </section>
        
        <section className="py-5">
          <div className="container">
              <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3 justify-content-center">
                  <div className="col my-5">
                      <h2 className="">Chose your ideal activity</h2>
                      <h3 className="">To unlock access to cool merch!</h3>
                  </div>
              </div>
              <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3 justify-content-center">
                  <div className="col">
                      <div className="card shadow-sm">
                          <svg className="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false"><rect width="100%" height="100%" fill="#55595c"/></svg>
                          <div className="card-body text-center">
                              <p className="card-text text-muted">Beach Day</p>
                          </div>
                      </div>
                  </div>
                  <div className="col">
                      <div className="card shadow-sm">
                          <svg className="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false"><rect width="100%" height="100%" fill="#55595c"/></svg>
                          <div className="card-body text-center">
                              <p className="card-text text-muted">Beach Day</p>
                          </div>
                      </div>
                  </div>
                  <div className="col">
                      <div className="card shadow-sm">
                          <svg className="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false"><rect width="100%" height="100%" fill="#55595c"/></svg>
                          <div className="card-body text-center">
                              <p className="card-text text-muted">Beach Day</p>
                          </div>
                      </div>
                  </div>
                  <div className="col">
                      <div className="card shadow-sm">
                          <svg className="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false"><rect width="100%" height="100%" fill="#55595c"/></svg>
                          <div className="card-body text-center">
                              <p className="card-text text-muted">Beach Day</p>
                          </div>
                      </div>
                  </div>
                  <div className="col">
                      <div className="card shadow-sm">
                          <svg className="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false"><rect width="100%" height="100%" fill="#55595c"/></svg>
                          <div className="card-body text-center">
                              <p className="card-text text-muted">Beach Day</p>
                          </div>
                      </div>
                  </div>
              </div>
          </div>

          <div className="container">
              <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3 justify-content-center">
                  <div className="col my-5">
                      <h2 className="">Awesome!</h2>
                      <p className="">You just got a beach towel!</p>
                      <p className="">Fill out the information below to claim your gift</p>
                  </div>
              </div>
              <div className="row row-cols-md-2 g-3 justify-content-center">
                  <div className="col my-5 mx-5">
                      <div className="my-3">
                          <input type="text" className="form-control" placeholder="First Name"/>
                      </div>
                      <div className="my-4">
                          <input type="text" className="form-control" placeholder="Last Name"/>
                      </div>
                      <div className="my-4">
                          <input type="email" className="form-control" placeholder="Email Address"/>
                      </div>
                      <div className="my-4">
                          <input type="text" className="form-control" placeholder="Address 1"/>
                      </div>
                      <div className="my-4">
                          <input type="text" className="form-control" placeholder="Address 2"/>
                      </div>
                      <div className="my-4">
                          <input type="text" className="form-control" placeholder="City"/>
                      </div>
                      <div className="my-4">
                          <input type="text" className="form-control" placeholder="State"/>
                      </div>
                      <div className="my-4">
                          <input type="text" className="form-control" placeholder="ZIP / Postal Code"/>
                      </div>
                      <div className="my-4">
                          <input type="text" className="form-control" placeholder="Country"/>
                      </div>
                      <button type="submit" className="btn btn-primary">Submit</button>
                  </div>
              </div>
          </div>
      </section>

        <footer className="text-muted py-3">
            <div className="container">
                Album example is &copy; Bootstrap, but please download and customize it for yourself!
            </div>
        </footer>
      </div>
    );
  }
}

export default App;
