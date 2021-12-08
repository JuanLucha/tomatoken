import React, { Component } from "react";
import getWeb3 from "./getWeb3";

import TomatokenContract from "./contracts/Tomatoken.json";
import Store from "./Store";
import Menu from "./Menu";
import Dashboard from "./Dashboard";

import "./App.css";
import Screens from "./screens";

const ItemKeys = {
  Tomatokens: 80,
};

class App extends Component {
  web3;
  accounts;
  networkId;
  deployedNetwork;
  instance;
  tomatokenPrice;

  state = {
    tomatokensCount: 0,
    loaded: false,
    amountToBuy: 0,
    priceToBuy: 0,
    NFTomatoes: [],
    userTomatoes: [],
    isInitialized: false,
    screen: Screens.Dashboard,
  };

  componentDidMount = async () => {
    try {
      // Get network provider and instance.
      this.web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();

      this.initializeDapp();

      this.setState({ loaded: true });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(`Failed to load web3, accounts, or contract. Check console for details.`);
      console.error(error);
    }
  };

  initializeDapp = async () => {
    try {
      // Check blockchain account changed
      if (window.ethereum) {
        window.ethereum.on("chainChanged", async () => {
          if (!this.state.isInitialized) await this.initializeDapp();
        });
        window.ethereum.on("accountsChanged", async () => {
          this.web3.eth.getAccounts((error, accounts) => {
            this.setAccount(accounts[0]);
          });
        });
      }

      // Get the contract instance.
      this.networkId = await this.web3.eth.net.getId();
      this.deployedNetwork = TomatokenContract.networks[this.networkId];
      this.instance = new this.web3.eth.Contract(
        TomatokenContract.abi,
        this.deployedNetwork && this.deployedNetwork.address
      );
      this.tomatokenPrice = await this.instance.methods.TOMATOKEN_PRICE_IN_WEI().call();

      // Load inventories
      this.loadUserInventory();
      this.loadStore();
      this.updateBalance(this.accounts[0]);

      // Setting up the events
      this.instance.events.TomatokenBought().on("data", (data) => this.updateBalance(this.accounts[0]));
      this.instance.events.NFTomatoBought().on("data", (data) => {
        this.loadUserInventory();
        this.loadStore();
      });
      this.instance.events.TomatokenRewarded().on("data", (data) => this.updateBalance(this.accounts[0]));
      this.setState({ isInitialized: true });
    } catch (error) {}
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
    this.instance.methods
      .buyNFTomato(tomatoId)
      .send({ from: this.accounts[0], value: this.web3.utils.toWei("1", "ether") });
  };

  buyTomatokens = () => {
    this.instance.methods.buyTokens().send({ from: this.accounts[0], value: this.state.priceToBuy });
  };

  onPomodoroOver = () => {
    this.instance.methods.rewardTomatoken().send({ from: this.accounts[0] });
  };

  processNFTomatoes = async (tomatoes) => {
    const nftUrl = await this.instance.methods.uri(0).call();

    return Promise.all(
      tomatoes
        .filter((tomato) => parseInt(tomato.amount) === 1)
        .map(async (tomato) => {
          const tomatoUrl = nftUrl.replace(`{id}`, tomato.assetId);
          const tomatoData = await (await fetch(tomatoUrl)).json();
          return {
            id: tomato.assetId,
            name: tomatoData.name,
            image: tomatoData.image,
            attributes: tomatoData.attributes,
          };
        })
    );
  };

  loadUserInventory = async () => {
    const nft = await this.instance.methods.getInventoryOf(this.accounts[0]).call();
    if (nft) {
      const result = await this.processNFTomatoes(nft);
      this.setState({ userTomatoes: result });
    }
  };

  loadStore = async () => {
    const nft = await this.instance.methods.getInventoryOf(this.instance.options.address).call();
    if (nft) {
      const result = await this.processNFTomatoes(nft);
      this.setState({ NFTomatoes: result });
    }
  };

  renderTomatoes = (tomatoes = [], buyButton = false) => {
    return tomatoes.map((tomato) => (
      <div className="tomato" key={tomato.id}>
        <img src={tomato.image} />
        <div>{tomato.name}</div>
        {buyButton && <button onClick={() => this.handleNFTomato(tomato.id)}>buy</button>}
      </div>
    ));
  };

  setScreen = (screen) => {
    this.setState({ screen: screen });
  };

  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="app">
        <div className="tomato-head"></div>
        <div className="tomato-container">
          <h1>Tomatoken</h1>
          {!this.state.isInitialized && <div>Please, connect to the correct network in Metamask</div>}
          {this.state.isInitialized && (
            <div>
              <Menu setScreen={this.setScreen}></Menu>
              {this.state.screen === Screens.Dashboard && (
                <Dashboard
                  tomatokens={this.state.tomatokensCount}
                  onPomodoroOver={this.onPomodoroOver}
                  userTomatoes={this.state.userTomatoes}
                  renderTomatoes={this.renderTomatoes}
                  handleAmountToBuy={this.handleAmountToBuy}
                  amountToBuy={this.state.amountToBuy}
                  priceToBuy={this.state.priceToBuy}
                  buyTomatokens={this.buyTomatokens}
                ></Dashboard>
              )}
              {this.state.screen === Screens.Store && (
                <Store NFTomatoes={this.state.NFTomatoes} renderTomatoes={this.renderTomatoes}></Store>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default App;
