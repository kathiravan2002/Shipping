import React from "react";
import Home from "../../shared/components/Home";

function Homepage({isLoggedIn, onLogout}) {
  return (
    <div>
      <Home isLoggedIn={isLoggedIn} onLogout={onLogout} />
    </div>
  );
}

export default Homepage;
