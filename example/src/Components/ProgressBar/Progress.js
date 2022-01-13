import React from 'react'
import "./Progress.css";

const Progress = () => {
  return (
    <div className="progressContainer">
      <div className="progressBar">
        <div className="step1"></div>
        <div className="step2"></div>
      </div>
      <span className="stepLabel"> Step 2/2</span>
    </div>
  );
};

export default Progress;
