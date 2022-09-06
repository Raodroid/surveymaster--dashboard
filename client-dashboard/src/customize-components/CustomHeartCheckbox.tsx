import React from 'react';
import { CheckboxProps } from 'antd/es/checkbox';
import templateVariable from 'app/template-variables.module.scss';

const HeartOutlined = (props: { onClick?; text?: string }) => {
  const { onClick, text } = props;
  return (
    <div
      onClick={onClick}
      style={{ display: 'flex', alignItems: 'center', paddingTop: '6px' }}
    >
      <svg
        width="16px"
        height="12px"
        viewBox="0 0 16 12"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        style={{ cursor: 'pointer' }}
      >
        <g
          id="Design"
          stroke="none"
          strokeWidth="1"
          fill="none"
          fillRule="evenodd"
        >
          <g id="Artboard" transform="translate(-100.000000, -390.000000)">
            <g id="Icon" transform="translate(100.000000, 388.000000)">
              <rect id="Rectangle" x="0" y="0" width="16" height="16" />
              <path
                d="M13.8818303,3.21186766 C12.3914355,1.82980451 10.0623067,1.86351337 8.61282588,3.31299423 L8.23570226,3.69011785 C8.1055275,3.82029261 7.8944725,3.82029261 7.76429774,3.69011785 L7.38717412,3.31299423 C5.90318181,1.82900192 3.49715489,1.82900192 2.01316259,3.31299423 C0.529170277,4.79698654 0.529170277,7.20301346 2.01316259,8.68700577 L6.49150553,13.1653487 L6.58561236,13.2535202 C7.4508626,14.0005904 8.71719136,13.9566518 9.50849447,13.1653487 L13.9868374,8.68700577 C15.4708297,7.20301346 15.4708297,4.79698654 13.9868374,3.31299423 L13.8818303,3.21186766 Z M12.8554666,4.44436508 C13.71462,5.30351852 13.71462,6.69648148 12.8554666,7.55563492 L8.37712362,12.0339779 C8.17942195,12.2316795 7.86251554,12.2426754 7.65267044,12.0616665 L7.6017185,12.0135833 L3.14453344,7.55563492 C2.28537999,6.69648148 2.28537999,5.30351852 3.14453344,4.44436508 C4.00368688,3.58521164 5.39664983,3.58521164 6.25580327,4.44436508 L7.52859548,5.71715729 C7.78894501,5.97750682 8.21105499,5.97750682 8.47140452,5.71715729 L9.74419673,4.44436508 C10.6033502,3.58521164 11.9963131,3.58521164 12.8554666,4.44436508 Z"
                id="Shape"
                fill={templateVariable.primary_color}
              />
            </g>
          </g>
        </g>
      </svg>
      <span
        style={{
          marginLeft: 5,
          color: ' #292929',
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        {text}
      </span>
    </div>
  );
};

const HeartFilled = (props: { onClick?; text?: string }) => {
  const { onClick, text } = props;
  return (
    <div
      onClick={onClick}
      style={{ display: 'flex', alignItems: 'center', paddingTop: '6px' }}
    >
      <svg
        width="16px"
        height="12px"
        viewBox="0 0 16 12"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        style={{ cursor: 'pointer' }}
      >
        <g
          id="Design"
          stroke="none"
          strokeWidth="1"
          fill="none"
          fillRule="evenodd"
        >
          <g id="Artboard" transform="translate(-132.000000, -390.000000)">
            <g
              id="Icon-/-Star-/-Filled-Copy"
              transform="translate(132.000000, 388.000000)"
            >
              <rect id="Rectangle" x="0" y="0" width="16" height="16" />
              <path
                d="M13.8818303,3.21186766 C12.3914355,1.82980451 10.0623067,1.86351337 8.61282588,3.31299423 L8.23570226,3.69011785 C8.1055275,3.82029261 7.8944725,3.82029261 7.76429774,3.69011785 L7.38717412,3.31299423 C5.90318181,1.82900192 3.49715489,1.82900192 2.01316259,3.31299423 C0.529170277,4.79698654 0.529170277,7.20301346 2.01316259,8.68700577 L6.49150553,13.1653487 L6.58561236,13.2535202 C7.4508626,14.0005904 8.71719136,13.9566518 9.50849447,13.1653487 L13.9868374,8.68700577 C15.4708297,7.20301346 15.4708297,4.79698654 13.9868374,3.31299423 L13.8818303,3.21186766 Z"
                id="Shape"
                fill={templateVariable.primary_color}
              />
            </g>
          </g>
        </g>
      </svg>
      <span
        style={{
          marginLeft: 5,
          color: ' #292929',
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        {text}
      </span>
    </div>
  );
};
const CustomHeartCheckbox = (props: CheckboxProps & { text?: string }) => {
  const { checked, onChange, text } = props;

  return checked ? (
    <HeartFilled onClick={onChange} text={text} />
  ) : (
    <HeartOutlined onClick={onChange} text={text} />
  );
};

export default CustomHeartCheckbox;
