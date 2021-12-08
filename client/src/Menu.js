import React from "react";

import Screens from "./screens";

const Menu = ({ setScreen }) => {
  return (
    <>
      <div className="menu">
        <div className="menu-option" onClick={() => setScreen(Screens.Dashboard)}>
          Dashboard
        </div>
        <div className="menu-option" onClick={() => setScreen(Screens.Store)}>
          Store
        </div>
      </div>
    </>
  );
};

export default Menu;
