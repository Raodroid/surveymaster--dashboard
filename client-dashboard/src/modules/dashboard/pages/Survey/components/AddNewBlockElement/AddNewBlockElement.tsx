import { FC, memo, useCallback } from 'react';
import { useField, useFormikContext } from 'formik';
import { EmptyString, SubSurveyFlowElement } from '@/type';
import { useCheckSurveyFormMode } from '@pages/Survey/SurveyForm/util';
import {
  IEditSurveyFormValues,
  rootSurveyFlowElementFieldName,
  SurveyDataTreeNode,
} from '@pages/Survey/SurveyForm/type';
import {
  calcLevelNodeByFieldName,
  genBlockSort,
  genDefaultBlockDescription,
  useSurveyTreeContext,
} from '@pages/Survey';
import _uniq from 'lodash/uniq';
import { AddElementBtn } from './components/AddElementBtn';
import { AddElementIconBtn } from './components/AddElementIconBtn';

const defaultNode: SurveyDataTreeNode = {
  blockSort: 0,
  sort: Math.random(),
  type: SubSurveyFlowElement.BRANCH,
  blockDescription: '',
  surveyQuestions: [],
  endMessageId: '',
  branchLogics: [],
  listEmbeddedData: [],
  children: [],
  key: '',
  title: '',
  fieldName: '',
};

const isRootPath = (
  fieldName: string,
  input: Array<EmptyString<SurveyDataTreeNode>> | SurveyDataTreeNode,
): input is Array<EmptyString<SurveyDataTreeNode>> => {
  return fieldName === rootSurveyFlowElementFieldName;
};

const mapContent: Record<'button' | 'icon', typeof AddElementBtn> = {
  button: AddElementBtn,
  icon: AddElementIconBtn,
};

const AddNewBlockElement: FC<{
  fieldName: string;
  type: 'button' | 'icon';
}> = props => {
  const { fieldName, type } = props;
  const { tree, setSurveyTreeContext } = useSurveyTreeContext();

  const { isEditMode } = useCheckSurveyFormMode();

  const { values } = useFormikContext<IEditSurveyFormValues>();

  const [{ value }, , { setValue }] = useField<
    Array<EmptyString<SurveyDataTreeNode>> | SurveyDataTreeNode
  >(fieldName);

  const genKey = useCallback(
    (
      currentFieldName: string,
      nextBLockSort: number,
    ): {
      blockSort: number;
      fieldName: string;
      key: string;
      blockDescription: string;
    } => {
      if (isRootPath(currentFieldName, value)) {
        const blockIndex = values?.version?.surveyFlowElements?.length || 0;
        const fieldName = rootSurveyFlowElementFieldName + `[${blockIndex}]`;
        const blockDescription = genDefaultBlockDescription(fieldName);
        return {
          blockSort: nextBLockSort,
          fieldName,
          key: fieldName,
          blockDescription,
        };
      }
      const nodeLevel = calcLevelNodeByFieldName(currentFieldName);

      if (!nodeLevel)
        return {
          blockSort: nextBLockSort,
          fieldName: `${rootSurveyFlowElementFieldName}.children[0]`,
          key: `${rootSurveyFlowElementFieldName}.children[0]`,
          blockDescription: `Block 1`,
        };

      // const preFix = nodeLevel?.map(i => Number(i.match(/[0-9]/g)?.[0]) + 1).join('');

      // const blockIndex = Number(preFix + (value?.children || []).length);
      const fieldName =
        currentFieldName + `.children[${(value?.children || []).length}]`;

      const blockDescription = genDefaultBlockDescription(fieldName);

      return {
        blockSort: nextBLockSort,
        fieldName,
        key: fieldName,
        blockDescription: blockDescription || '',
      };
    },
    [value, values?.version?.surveyFlowElements?.length],
  );

  const handleAddElement = useCallback(
    (type: SubSurveyFlowElement) => {
      const nextBLockSort = genBlockSort(tree.maxBlockSort);

      const newBlockValue: SurveyDataTreeNode = {
        ...defaultNode,
        type,
        ...genKey(fieldName, nextBLockSort),
      };

      if (isRootPath(fieldName, value)) {
        setValue([...value, newBlockValue]);

        setSurveyTreeContext(oldState => ({
          ...oldState,
          tree: {
            ...oldState.tree,
            focusBlock: newBlockValue,
            maxBlockSort: nextBLockSort,
          },
        }));
        return;
      }

      setValue({
        ...value,
        children: [...(value?.children || []), newBlockValue],
      });

      //auto expend parent root branch and focus on new block
      setSurveyTreeContext(oldState => ({
        ...oldState,
        tree: {
          ...oldState.tree,
          expendKeys: _uniq([...oldState.tree.expendKeys, fieldName]),
          focusBlock: newBlockValue,
          maxBlockSort: nextBLockSort,
        },
      }));
    },
    [
      fieldName,
      genKey,
      setSurveyTreeContext,
      setValue,
      tree.maxBlockSort,
      value,
    ],
  );

  if (!isEditMode) return null;

  const Content = memo(mapContent[type]);

  return <Content handleAddElement={handleAddElement} />;
};

export default memo(AddNewBlockElement);

export { defaultNode, isRootPath };
