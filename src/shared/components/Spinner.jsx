// import React from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faSpinner } from "@fortawesome/free-solid-svg-icons";

// const Spinner = () => {
//   return (
//     <div className="flex justify-center items-center   text-violet-600 mt-72">
//       <FontAwesomeIcon icon={faSpinner} spin size="4x" />
//     </div>
//   );
// };

// export default Spinner;

import { MoonLoader } from "react-spinners";
const Spinner = () => {
  return (
    <>
      <div className="relative flex justify-center items-center">
        <h1 className="text-4xl font-semibold absolute top-60">TCZ Courier</h1>
        <div className="mt-72 relative">
          <MoonLoader size={80} color="#7c3aed" speedMultiplier={0.5} />
           <img src="/assets/images/tczlogo.jpeg" alt="tczlogo" className="w-[110px] h-[110px]  absolute -top-1 -left-1 -z-10"/>
         
            <h1 className="text-2xl font-semibold text-violet-600 ">Loading...</h1>
          
        </div>
      </div>
      {/* <div className="relative">
        <img src="/assets/images/tczlogo.jpeg" alt="tczlogo" className="w-[110px] h-[110px] absolute left-1/2 "/>
      </div> */}
    </>
  );
};

export default Spinner; 