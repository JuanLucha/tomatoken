import React, { Component } from "react";
import getWeb3 from "./getWeb3";

import TomatokenContract from "./contracts/Tomatoken.json";
import Pomodoro from "./pomodoro/Pomodoro";

import "./App.css";

const ItemKeys = {
  Tomatokens: 8,
};

class App extends Component {
  web3;
  accounts;
  networkId;
  deployedNetwork;
  instance;
  tomatokenPrice;

  state = { tomatokensCount: 0, loaded: false, amountToBuy: 0, priceToBuy: 0, NFTomatoes: []};

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
      this.tomatokenPrice = await this.instance.methods.TOMATOKEN_PRICE_IN_WEI().call();
      const nft = await this.instance.methods.getInventoryOf(this.instance.options.address).call();
      const nftUrl = await this.instance.methods.uri(0).call();
      if (nft)  Promise.all(nft.filter(tomato => parseInt(tomato.amount) === 1).map(async(tomato) => {
        const tomatoUrl = nftUrl.replace(`{id}`, tomato.assetId)
        const tomatoData = await (await fetch(tomatoUrl)).json()
        return {id: tomato.assetId, name: tomatoData.name, image: tomatoData.image, attributes: tomatoData.attributes}
      }))
      .then((result) => {
        this.setState({NFTomatoes: result})
        })

      this.updateBalance(this.accounts[0]);

      // Check blockchain account changed
      if (window.ethereum) {
        window.ethereum.on("accountsChanged", () => {
          this.web3.eth.getAccounts((error, accounts) => {
            this.setAccount(accounts[0]);
          });
        });
      }

      this.instance.events.TomatokenBought().on("data", (data) => this.updateBalance(this.accounts[0]));
      this.instance.events.NFTomatoBought().on("data", (data) => console.log("tomato bought", data));
      this.instance.events.TomatokenRewarded().on("data", (data) => this.updateBalance(this.accounts[0]));
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
    this.setState({ tomatokensCount: tomatokensCount.toString() });
  };

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  };

  handleAmountToBuy = (event) => {
    this.handleInputChange(event);
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    this.setState({ priceToBuy: value * this.tomatokenPrice });
  };

  handleNFTomato = (tomatoId) => {
    this.instance.methods.buyNFTomato(tomatoId).send({from: this.accounts[0], value: this.web3.utils.toWei('1', 'ether')})
  };

  buyTomatokens = () => {
    this.instance.methods.buyTokens().send({ from: this.accounts[0], value: this.state.priceToBuy });
  };

  onPomodoroOver = () => {
    this.instance.methods.rewardTomatoken().send({ from: this.accounts[0] });
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
        <Pomodoro onPomodoroOver={this.onPomodoroOver}></Pomodoro>
        <h2>Buy Tomatokens!</h2>
        Amount of{" "}
        <span role="img" aria-label="pomodoro">
          🍅
        </span>
        kens:{" "}
        <input type="number" name="amountToBuy" onChange={this.handleAmountToBuy} value={this.state.amountToBuy} />
        <br></br>
        {this.state.priceToBuy > 0 && `Total price in wei: ${this.state.priceToBuy}`}
        <br></br>
        <button type="button" onClick={this.buyTomatokens}>
          Buy{" "}
          <span role="img" aria-label="pomodoro">
            🍅
          </span>
          kens
        </button>
        <h2>Buy NFTomatoes! (only 1 ETH each!)</h2>
        {this.state.NFTomatoes && this.state.NFTomatoes.map(tomato => <div key={tomato.id} onClick={() => this.handleNFTomato(tomato.id)}>
          <img src={tomato.image} />
          <div>{tomato.name}</div>
        </div>)}
      </div>
    );
  }
}

export default App;
