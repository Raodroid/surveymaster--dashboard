import {FC, SVGAttributes} from 'react';

export const CloseIcon: FC<SVGAttributes<HTMLOrSVGElement>> = props => {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M10.192 0.34375L5.94897 4.58575L1.70697 0.34375L0.292969 1.75775L4.53497 5.99975L0.292969 10.2418L1.70697 11.6558L5.94897 7.41375L10.192 11.6558L11.606 10.2418L7.36397 5.99975L11.606 1.75775L10.192 0.34375Z"
        fill="currentColor"
      />
    </svg>
  );
};
