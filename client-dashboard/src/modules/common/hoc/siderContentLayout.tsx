import React from 'react';
import styled from 'styled-components';

function siderContentLayout(WrappedComponent) {
  return props => (
    <SiderContentLayoutStyled>
      <div className="cover cover-top" />
      <WrappedComponent {...props} />
      <div className="cover cover-bottom" />
    </SiderContentLayoutStyled>
  );
}

export default siderContentLayout;

const SiderContentLayoutStyled = styled.div`
  width: 100%;
  position: relative;
  padding: 8px 0;
  height: 100%;

  .cover {
    background: white;
    width: 100%;
    height: 8px;
    position: absolute;
  }

  .cover-top {
    border-top-right-radius: 16px;
    border-top-left-radius: 16px;
    top: 00px;
  }

  .cover-bottom {
    border-bottom-right-radius: 16px;
    border-bottom-left-radius: 16px;
    bottom: 0;
  }
`;
