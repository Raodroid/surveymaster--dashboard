import {CSSProperties, FC, HTMLAttributes, ReactNode} from 'react';
import styled from 'styled-components/macro';

interface ICustomSkeleton {
  width?: number;
  height?: number;
  className?: string;
  wrapper?: Element | ReactNode | string;
  loading?: boolean;
  style?: CSSProperties;
  count?: number;
}

const CustomSkeleton: FC<ICustomSkeleton> = props => {
  const { wrapper, loading, count = 1, className, ...rest } = props;
  return loading ? (
    <>
      {[...Array(count)].map((item, idx) => (
        <CustomSkeletonWrapper
          key={idx}
          {...rest}
          className={`custom-skeleton ${className}`}
        />
      ))}
    </>
  ) : (
    <>{wrapper}</>
  );
};

export default CustomSkeleton;

const CustomSkeletonWrapper = styled.div<
  HTMLAttributes<Element> & { width?: number; height?: number }
>`
  border-radius: 4px;
  background: #ebebeb;
  overflow: hidden;
  position: relative;
  display: inline-flex;
  height: ${p => (typeof p.height === 'number' ? `${p.height}px` : 'auto')};
  width: ${p => (typeof p.width === 'number' ? `${p.width}px` : 'auto')};

  &:after {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transform: translateX(-100%);
    background-image: linear-gradient(
      -90deg,
      #ebebeb 0%,
      #c0baba 50%,
      #ebebeb 100%
    );
    animation: shimmer 2s infinite;
    content: '';
  }

  @keyframes shimmer {
    100% {
      transform: translateX(100%);
    }
  }
`;
