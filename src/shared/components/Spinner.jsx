import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const Spinner = () => {
  return (
    <div className="flex justify-center items-center h-screen text-violet-600">
      <FontAwesomeIcon icon={faSpinner} spin size="5x" />
    </div>
  );
};

export default Spinner;