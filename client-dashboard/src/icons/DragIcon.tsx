import {FC, SVGAttributes} from 'react';

export const DragIcon: FC<SVGAttributes<HTMLOrSVGElement>> = props => {
  return (
    <svg
      width="12px"
      height="8px"
      viewBox="0 0 12 8"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>16px - Drag - Violet@1.5x</title>
      <g
        id="UI-design"
        stroke="none"
        strokeWidth="1"
        fill="none"
        fillRule="evenodd"
      >
        <g id="Assets" transform="translate(-158.000000, -156.000000)">
          <g
            id="16px---Drag---Violet"
            transform="translate(156.000000, 152.000000)"
          >
            <rect id="Rectangle" x="0" y="0" width="16" height="16"></rect>
            <path
              d="M4,4 L12,4 C12.7363797,4 13.3333333,4.59695367 13.3333333,5.33333333 C13.3333333,6.069713 12.7363797,6.66666667 12,6.66666667 L4,6.66666667 C3.26362033,6.66666667 2.66666667,6.069713 2.66666667,5.33333333 C2.66666667,4.59695367 3.26362033,4 4,4 Z M4,9.33333333 L12,9.33333333 C12.7363797,9.33333333 13.3333333,9.930287 13.3333333,10.6666667 C13.3333333,11.4030463 12.7363797,12 12,12 L4,12 C3.26362033,12 2.66666667,11.4030463 2.66666667,10.6666667 C2.66666667,9.930287 3.26362033,9.33333333 4,9.33333333 Z"
              id="Combined-Shape"
              fill="currentColor"
            ></path>
          </g>
        </g>
      </g>
    </svg>
  );
};
