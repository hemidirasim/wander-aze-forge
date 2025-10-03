import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => {
  return (
    <svg 
      version="1.1" 
      id="Layer_1" 
      xmlns="http://www.w3.org/2000/svg" 
      xmlnsXlink="http://www.w3.org/1999/xlink" 
      x="0px" 
      y="0px"
      viewBox="0 0 500 500" 
      style={{ enableBackground: 'new 0 0 500 500' }} 
      xmlSpace="preserve"
      className={className}
    >
      <style type="text/css">
        {`
          .st0{font-family:'GillSansMT';}
          .st1{font-size:166.1998px;}
          .st2{fill:none;stroke:#F7941D;stroke-width:12;stroke-miterlimit:10;}
          .st3{fill:#6D6E71;}
          .st4{font-family:'BerlinSansFB-Reg';}
          .st5{font-size:51.5801px;}
        `}
      </style>
      <text transform="matrix(1 0 0 1 13.313 300.8859)" className="st0 st1">outtour</text>
      <path className="st2" d="M17.55,184.88c11.64-16.46,21.58-20.31,28.73-20.57c8.89-0.32,13.57,4.29,34.49,12.94
        c12.72,5.26,15.35,4.2,18.23,3.49c8.01-1.98,11.81-6.39,26.06-16.85c2.87-2.1,4.13-7.59,7.51-7.9c4.98-0.47,8.6,4.71,13.04,3.98
        c3.82-0.63,2.17-9.63,6.76-12.61c3.79-2.46,9.33,0.86,19.28-0.85c0.47-0.08,0.95-0.16,1.46-0.24c9.45-1.55,17.86-6.95,23.25-14.86
        c6.37-9.35,12.73-18.69,19.1-28.04c2.36-2.01,6.08-4.55,11.01-5.45c10.08-1.84,19.89,9.38,27.28,14.63c0,0,15.92,7.16,52.68,30.01
        c15.11,9.39,20.31,13.63,26.49,12.46c9.9-1.87,11.68-12.39,23.64-15.58c6.67-1.78,12.88-0.33,25.3,2.58
        c18.23,4.27,18.93,7.88,35.19,11.29c11.09,2.33,11.23,0.75,26.66,3.86c8.81,1.78,12.39,3.02,21.56,4.71
        c9.02,1.66,16.5,2.47,21.47,2.89"/>
      <text transform="matrix(1 0 0 1 17.5483 379.422)" className="st3 st4 st5">AZERBAIJAN</text>
    </svg>
  );
};

export default Logo;
