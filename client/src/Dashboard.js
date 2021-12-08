import React from "react";

import Pomodoro from "./pomodoro/Pomodoro";

const Dashboard = ({
  tomatokens,
  onPomodoroOver,
  userTomatoes,
  renderTomatoes,
  handleAmountToBuy,
  amountToBuy,
  priceToBuy,
  buyTomatokens,
}) => {
  return (
    <>
      <div>Your have {tomatokens} tomatokens</div>
      <Pomodoro onPomodoroOver={onPomodoroOver}></Pomodoro>
      {!userTomatoes && <div>You don't have any NFTomato yet</div>}
      {userTomatoes && <div>Your NFTomatoes are: </div>}
      <div className="tomato-list">{userTomatoes && renderTomatoes(userTomatoes)}</div>
      <h2>Buy Tomatokens!</h2>
      Amount of{" "}
      <span role="img" aria-label="pomodoro">
        🍅
      </span>
      kens: <input type="number" name="amountToBuy" onChange={handleAmountToBuy} value={amountToBuy} />
      <br></br>
      {priceToBuy > 0 && <div className="price-to-buy">Total price in wei: {priceToBuy}</div>}
      <br></br>
      <button type="button" onClick={buyTomatokens}>
        Buy{" "}
        <span role="img" aria-label="pomodoro">
          🍅
        </span>
        kens
      </button>
    </>
  );
};
export default Dashboard;
