import React from "react";

const Rank = ({ entries, name }) => {
  return (
    <div>
      <div className="white f3">
        {`${name}, you are current entry count is...`}
      </div>
      <div className="white f1">{entries}</div>
    </div>
  );
};

export default Rank;
