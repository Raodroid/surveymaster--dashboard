import {FC, SVGAttributes} from 'react';

export const ArrowRight: FC<SVGAttributes<HTMLOrSVGElement>> = props => {
  const { style, className } = props;
  return (
    <svg
      className={className}
      style={{ ...style, transform: 'rotate(-90deg)' }}
      width="12px"
      height="6px"
      viewBox="0 0 12 6"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g
        id="Design"
        stroke="none"
        strokeWidth="1"
        fill="none"
        fillRule="evenodd"
      >
        <g id="Artboard" transform="translate(-418.000000, -393.000000)">
          <g
            id="Icon-/-Chevron-/-Down"
            transform="translate(416.000000, 388.000000)"
          >
            <rect id="Rectangle" x="0" y="0" width="16" height="16" />
            <path
              d="M13.2740865,5.58506675 C13.542455,5.89816338 13.5265042,6.35898243 13.2504428,6.65281224 L13.1873143,6.71310513 L8.95450852,10.3412243 C8.43577089,10.7858566 7.68401969,10.8105584 7.13939166,10.4153297 L7.04552049,10.3412243 L2.81271474,6.71310513 C2.47725406,6.42556741 2.43840483,5.92052742 2.72594256,5.58506675 C2.99431109,5.27197012 3.45214827,5.21725501 3.78474243,5.44513002 L3.85398094,5.49829456 L8.0000145,9.05169985 L12.1460481,5.49829456 C12.4591447,5.22992602 12.9199638,5.24587678 13.2137936,5.52193825 L13.2740865,5.58506675 Z"
              id="Shape"
              fill="currentColor"
            />
          </g>
        </g>
      </g>
    </svg>
  );
};
