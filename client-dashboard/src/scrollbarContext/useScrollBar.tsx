import {
  createContext,
  ReactElement,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

interface IMyScrollbarContext {
  currentScrollTop: number;
  setCurrentScrollTop: any;
  ref: any;
}

const intValue: IMyScrollbarContext = {
  currentScrollTop: 0,
  setCurrentScrollTop: () => {},
  ref: null,
};

const ScrollbarContext = createContext<IMyScrollbarContext>(intValue);

const ScrollbarProvider = (props: { children?: ReactElement }) => {
  const [currentScrollTop, setCurrentScrollTop] = useState(0);
  const handleScroll = useCallback(e => {
    setCurrentScrollTop(e.target.scrollTop);
  }, []);

  const hanh = useRef(null);

  return (
    <ScrollbarContext.Provider
      value={{ currentScrollTop, setCurrentScrollTop, ref: hanh }}
    >
      <Scrollbars
        onScroll={handleScroll}
        ref={hanh}
        className="scroll-bars-hanh"
        autoHide
      >
        {props?.children}
      </Scrollbars>
    </ScrollbarContext.Provider>
  );
};

const useScrollbarContext = () => {
  const { currentScrollTop, ref } = useContext(ScrollbarContext);

  const scrollToTop = useCallback(
    (positionY: number) => {
      if (!ref || !ref.current) return;
      const x = ref.current as any;
      if (x.view?.scrollTop) {
        x.view?.scroll({
          top: positionY,
          left: 0,
          behavior: 'smooth',
        });
      }
    },
    [ref],
  );

  return {
    currentScrollTop,
    scrollToTop,
  };
};

export { ScrollbarProvider, useScrollbarContext };
