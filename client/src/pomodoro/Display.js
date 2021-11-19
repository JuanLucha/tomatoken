import React from "react";

const Display = ({ time }) => <div>{formatTime(time)}</div>;

// Helpers
function formatTime(time) {
  const minutes = pad2(Math.floor(time / 60));
  const seconds = pad2(Math.floor(time % 60));

  return `${minutes}:${seconds}`;
}

function pad2(num) {
  return num > 9 ? num : `0${num}`;
}

export default Display;
