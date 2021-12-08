import React from "react";

const Store = ({ NFTomatoes, renderTomatoes }) => {
  return (
    <>
      <h2>Buy NFTomatoes! (only 1 ETH each!)</h2>
      <div className="tomato-list">{NFTomatoes && renderTomatoes(NFTomatoes, true)}</div>
    </>
  );
};

export default Store;
