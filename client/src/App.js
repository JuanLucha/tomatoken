import React, { Component } from "react";
import TomatokenContract from "./contracts/Tomatoken.json";
import getWeb3 from "./getWeb3";

import "./App.css";

const ItemKeys = {
  Tomatokens: 0,
};

class App extends Component {
  web3;
  accounts;
  networkId;
  deployedNetwork;
  instance;

  state = { tomatokensCount: 0, loaded: false };

  componentDidMount = async () => {
    try {
      // Get network provider and instance.
      this.web3 = await getWeb3();
      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();

      // Get the contract instance.
      this.networkId = await this.web3.eth.net.getId();
      this.deployedNetwork = TomatokenContract.networks[this.networkId];
      this.instance = new this.web3.eth.Contract(
        TomatokenContract.abi,
        this.deployedNetwork && this.deployedNetwork.address
      );

      this.updateBalance(this.accounts[0]);

      // Check blockchain account changed
      if (window.ethereum) {
        window.ethereum.on("accountsChanged", () => {
          this.web3.eth.getAccounts((error, accounts) => {
            this.setAccount(accounts[0]);
          });
        });
      }
      this.setState({ loaded: true });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(`Failed to load web3, accounts, or contract. Check console for details.`);
      console.error(error);
    }
  };

  setAccount = (account) => {
    this.updateBalance(account);
  };

  updateBalance = async (account) => {
    const tomatokensCount = await this.instance.methods.balanceOf(account, ItemKeys.Tomatokens).call();
    this.setState({ tomatokensCount: tomatokensCount });
  };
  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Tomatoken</h1>
        <p>Tomatoken site</p>
        <div>Your have {this.state.tomatokensCount} tomatokens</div>
      </div>
    );
  }
}

export default App;
