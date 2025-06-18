import {
  createContext,
  Dispatch,
  Key,
  ReactElement,
  SetStateAction,
  useCallback,
  useState,
} from 'react';
import { SurveyDataTreeNode } from '@pages/Survey/SurveyForm/type';

const INIT_BLOCK_SORT = 0;

interface ISurveyTreeContext {
  handleFocusBlock: (value: SurveyDataTreeNode | undefined) => void;
  handleExpendTree: (expendKeys: Key[]) => void;
  setSurveyTreeContext: Dispatch<SetStateAction<ISurveyTreeContext>>;
  tree: {
    focusBlock?: SurveyDataTreeNode;
    expendKeys: Key[];
    maxBlockSort: number;
  };
}

const intValue: ISurveyTreeContext = {
  tree: {
    expendKeys: [],
    maxBlockSort: INIT_BLOCK_SORT,
  },
  handleFocusBlock: (value: SurveyDataTreeNode | undefined) => {},
  handleExpendTree: (value: Key[]) => {},
  setSurveyTreeContext: () => {},
};

export const SurveyTreeContext = createContext<ISurveyTreeContext>(intValue);

const SurveyTreeProvider = (props: { children?: ReactElement }) => {
  const [context, setContext] = useState<ISurveyTreeContext>(intValue);

  const handleFocusBlock = useCallback(
    (node: SurveyDataTreeNode | undefined) => {
      setContext(s => ({ ...s, tree: { ...s.tree, focusBlock: node } }));
    },
    [],
  );
  const handleExpendTree = useCallback((expandedKeysValue: Key[]) => {
    setContext(s => ({
      ...s,
      tree: { ...s.tree, expendKeys: expandedKeysValue },
    }));
  }, []);

  return (
    <SurveyTreeContext.Provider
      value={{
        ...context,
        setSurveyTreeContext: setContext,
        handleFocusBlock,
        handleExpendTree,
      }}
    >
      {props.children}
    </SurveyTreeContext.Provider>
  );
};

export { SurveyTreeProvider };
