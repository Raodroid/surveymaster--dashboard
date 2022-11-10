import React, { FC, ReactNode } from 'react';
import styled, { css } from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft } from 'icons/';
import templateVariable from '../../../app/template-variables.module.scss';

const BreadcrumbWrapper = styled.div<{ isMobile?: boolean }>`
  display: flex;
  align-items: ${p => (p.isMobile ? 'flex-start' : 'center')};
  justify-content: space-between;
  padding: 1.5rem 0;
  border-top: 1px solid ${templateVariable.border_color};
  flex-direction: ${p => (p.isMobile ? 'column' : 'row')};

  ${p =>
    p.isMobile &&
    css`
      padding: 0;
      .left-breadcrumb,
      .right-breadcrumb {
        padding: 12px 0;
      }
      .left-breadcrumb {
        width: 100%;
        border-bottom: 1px solid ${templateVariable.border_color};
      }
    `}

  .breadcrumb-item {
    display: inline-flex;
    align-items: center;
    a,
    svg {
      margin-right: 1rem;
    }
    a {
      color: ${templateVariable.text_primary_color};
      font-weight: 600;
      :last-child {
        color: ${templateVariable.text_primary_color};
      }
      :hover {
        color: #00000073;
      }
    }
    span {
      color: ${templateVariable.primary_color};
      &:first-child {
        font-weight: 600;
        margin-right: 5px;
      }
    }
  }
  .right-breadcrumb {
    a {
      color: ${templateVariable.primary_color};
    }
    svg {
      transform: rotate(-90deg);
      /* margin-left: 5px; */
      path {
        fill: ${templateVariable.primary_color};
      }
    }
  }
`;

export interface IBreadcrumb {
  routes: IBreadcrumbItem[];
  rightEndBreadcrumbComponent?: string | ReactNode | Element;
  isMobile?: boolean;
}
export interface IBreadcrumbItem {
  name: string;
  name1?: string;
  href: string;
}

const StyledBreadcrumb: FC<IBreadcrumb> = props => {
  const { routes, rightEndBreadcrumbComponent, isMobile } = props;
  const navigator = useNavigate();

  const handleClick = () => {
    navigator(routes[routes.length - 2].href);
  };
  return (
    <BreadcrumbWrapper isMobile={isMobile} className="breadcrumb">
      <div className={'left-breadcrumb'}>
        {isMobile && (
          <div
            className={'breadcrumb-item'}
            key={routes[routes.length - 2].href}
            onClick={handleClick}
          >
            <ArrowLeft />
            <Link
              to={routes[routes.length - 2].href}
              aria-label="Breadcrumb link"
            >
              {routes[routes.length - 2].name}
            </Link>
          </div>
        )}
        {!isMobile &&
          routes.map((route, idx, array) => {
            return (
              <div
                className={'breadcrumb-item'}
                key={route.href + idx.toString()}
              >
                {idx === array.length - 1 ? (
                  <>
                    <span>{route.name}</span>
                    <span>{route.name1}</span>
                  </>
                ) : (
                  <Link to={route.href} aria-label="Route name">
                    {route.name}
                  </Link>
                )}
                {idx !== array.length - 1 && <ArrowRight />}
              </div>
            );
          })}
      </div>
      <div className={'right-breadcrumb'}>
        {rightEndBreadcrumbComponent as ReactNode}
      </div>{' '}
    </BreadcrumbWrapper>
  );
};

export default StyledBreadcrumb;
