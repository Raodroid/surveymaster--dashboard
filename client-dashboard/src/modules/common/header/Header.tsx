import React from 'react';
import { Layout } from 'antd';
import { LeftCircleOutlined } from '@ant-design/icons';
import { MenuIcon } from 'icons/Menu';
import { useDispatch } from 'react-redux';
import { HeaderGroupButton, MobileHeaderWrapper } from './style';
import { BellIcon } from 'icons/Menu';
import { UserAction } from 'redux/user';
// import CurrentUser from 'modules/user/current-user/CurrentUser';
import { MenuBtn } from '../styles';
import { useMobile } from 'utils';

const { Header } = Layout;

interface HeaderProps {
  subTitle?: string;
  mainTitle: string;
  backFunc?: () => void;
  child?: JSX.Element | string;
  child1?: JSX.Element | string;
  statusTag?: JSX.Element | string;
}

const HeaderCustom: React.FC<HeaderProps> = props => {
  const { subTitle, mainTitle, backFunc, child, child1, statusTag } = props;
  const dispatch = useDispatch();
  const { isMobile } = useMobile();

  return (
    <Header>
      {isMobile ? (
        <>
          <MobileHeaderWrapper>
            <div className="row01">
              <MenuBtn
                onClick={() => {
                  dispatch(UserAction.toggleDrawerVisible({ visible: true }));
                }}
              >
                <MenuIcon />
              </MenuBtn>
              <div className="col01">
                {/* {backFunc && (
                  <div className="back-icon" onClick={backFunc}>
                    <LeftCircleOutlined />
                  </div>
                )} */}
                <div className="title-wrapper">
                  {subTitle && <p className="sub-title">{subTitle}</p>}
                  <p className="main-title">{mainTitle}</p>
                  {statusTag && <div className="status-tag">{statusTag}</div>}
                </div>
              </div>
              <div className="col02">
                <div className="col noti">
                  <BellIcon fill="#bec5ca" />
                </div>
              </div>
            </div>
          </MobileHeaderWrapper>
          {child1 && <HeaderGroupButton>{child1}</HeaderGroupButton>}
        </>
      ) : (
        <>
          <div className="row-1">
            <div className="header-col-1">
              <div
                style={{
                  display: 'flex',
                  flexFlow: 'row',
                  alignItems: 'center',
                }}
              >
                {backFunc && (
                  <div className="back-icon" onClick={backFunc}>
                    <LeftCircleOutlined />
                  </div>
                )}
                <div>
                  {subTitle && <p className="sub-title">{subTitle}</p>}
                  <p className="main-title">
                    {mainTitle}
                    &nbsp;
                    {statusTag}
                  </p>
                </div>
              </div>
            </div>
            <div className="header-col-2">
              {child1 && <div className="header-group-button">{child1}</div>}
              {/*<div className="col current-user">*/}
              {/*  <CurrentUser />*/}
              {/*</div>*/}
              <div className="col noti" />
            </div>
          </div>
        </>
      )}
      <div className="row-2">{child}</div>
    </Header>
  );
};

export default HeaderCustom;
