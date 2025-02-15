import React from "react";
import Home from "../../shared/components/Home";
import { useNavigate } from "react-router-dom";

function Homepage( ) {
  
  const navigate = useNavigate();
  const scrolltotop = () => {

    window.scrollTo({ top: 0, behavior: 'smooth' })

  }

  return (
    <div>
      <Home navigate={navigate} scrolltotop={scrolltotop} />
    </div>
  );
}

export default Homepage;
