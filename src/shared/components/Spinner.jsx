import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const Spinner = () => {
  return (
    <div className="flex justify-center items-center   text-violet-600 mt-72">
      <FontAwesomeIcon icon={faSpinner} spin size="4x" />
    </div>
  );
};

export default Spinner;