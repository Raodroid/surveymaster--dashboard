import React from 'react';
import templateVariable from '../app/template-variables.module.scss';

const unActiveColor = templateVariable.text_primary_color;
const activeColor = templateVariable.primary_color;

export const LogoIcon = props => {
  const { style, className, isActive } = props;
  return (
    <svg
      width="165px"
      height="28px"
      viewBox="0 0 165 28"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ ...style }}
    >
      <title>Survey master logo</title>
      <g
        id="UI-design"
        stroke="none"
        strokeWidth="1"
        fill="none"
        fillRule="evenodd"
      >
        <g id="Assets" transform="translate(-45.000000, -390.000000)">
          <g id="Logo" transform="translate(45.000000, 390.000000)">
            <text
              id="SurveyMaster"
              fontFamily="OpenSans-Bold, Open Sans"
              fontSize="16"
              fontWeight="bold"
              line-spacing="20"
            >
              <tspan x="40" y="21" fill="#232567">
                SURVEY
              </tspan>
              <tspan x="100.8125" y="21" fill="#DA2E9A">
                MASTER
              </tspan>
            </text>
            <g id="Icon">
              <rect
                id="Rectangle"
                fill="#DA2E9A"
                x="0"
                y="1"
                width="20"
                height="20"
                rx="9"
              ></rect>
              <path
                d="M14.5,12 L26.5,12 C27.3284271,12 28,12.6715729 28,13.5 C28,14.3284271 27.3284271,15 26.5,15 L14.5,15 C13.6715729,15 13,14.3284271 13,13.5 C13,12.6715729 13.6715729,12 14.5,12 Z M14.5,18 L26.5,18 C27.3284271,18 28,18.6715729 28,19.5 C28,20.3284271 27.3284271,21 26.5,21 L14.5,21 C13.6715729,21 13,20.3284271 13,19.5 C13,18.6715729 13.6715729,18 14.5,18 Z M14.5,24 L26.5,24 C27.3284271,24 28,24.6715729 28,25.5 C28,26.3284271 27.3284271,27 26.5,27 L14.5,27 C13.6715729,27 13,26.3284271 13,25.5 C13,24.6715729 13.6715729,24 14.5,24 Z"
                id="Combined-Shape"
                fill="#25216A"
              ></path>
              <path
                d="M13.5551847,20.6321165 L13.5263908,20.6411271 C13.2042386,20.3660039 13,19.9568532 13,19.5 C13,18.6715729 13.6715729,18 14.5,18 L17.7077409,18.0006464 C16.6086201,19.2284443 15.1773504,20.1526853 13.5551847,20.6321165 Z M20,12 C20,13.0521223 19.8194632,14.0620779 19.4876786,15.000578 L14.5,15 C13.6715729,15 13,14.3284271 13,13.5 C13,12.6715729 13.6715729,12 14.5,12 L20,12 Z"
                id="Combined-Shape"
                fill="#FFFFFF"
              ></path>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
};
