import { FC, SVGAttributes } from 'react';

export const SearchIcon: FC<SVGAttributes<HTMLOrSVGElement>> = props => {
  const { style, className } = props;
  return (
    <svg
      style={style}
      className={className}
      width="16px"
      height="16px"
      viewBox="0 0 16 16"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>16px - Search - Pink@1.5x</title>
      <g
        id="UI-design"
        stroke="none"
        strokeWidth="1"
        fill="none"
        fillRule="evenodd"
      >
        <g id="Assets" transform="translate(-156.000000, -116.000000)">
          <g
            id="16px---Search---Pink"
            transform="translate(156.000000, 116.000000)"
          >
            <rect id="Rectangle" x="0" y="0" width="16" height="16" />
            <path
              d="M6.83333333,0.166666667 C10.5152317,0.166666667 13.5,3.151435 13.5,6.83333333 C13.5,8.43440054 12.9356011,9.90364532 11.9949084,11.0529625 L15.6380712,14.6952621 C15.8984207,14.9556117 15.8984207,15.3777217 15.6380712,15.6380712 C15.3977485,15.8783938 15.0195945,15.8968802 14.758067,15.6935303 L14.6952621,15.6380712 L11.0529625,11.9949084 C9.90364532,12.9356011 8.43440054,13.5 6.83333333,13.5 C3.151435,13.5 0.166666667,10.5152317 0.166666667,6.83333333 C0.166666667,3.151435 3.151435,0.166666667 6.83333333,0.166666667 Z M6.83333333,1.5 C3.88781467,1.5 1.5,3.88781467 1.5,6.83333333 C1.5,9.778852 3.88781467,12.1666667 6.83333333,12.1666667 C9.778852,12.1666667 12.1666667,9.778852 12.1666667,6.83333333 C12.1666667,3.88781467 9.778852,1.5 6.83333333,1.5 Z"
              id="Combined-Shape"
              fill="currentColor"
            />
          </g>
        </g>
      </g>
    </svg>
  );
};
