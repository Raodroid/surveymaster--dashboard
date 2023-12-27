import { FC, memo, useCallback, useMemo } from 'react';

import {
  ActionThreeDropDownType,
  IMenuItem,
  SubSurveyFlowElement,
} from '@/type';
import { useTranslation } from 'react-i18next';
import { useField } from 'formik';
import { DEFAULT_THEME_COLOR } from '@/enums';
import { useCheckSurveyFormMode } from '@pages/Survey/SurveyForm/util';
import { SurveyDataTreeNode } from '@pages/Survey/SurveyForm/type';
import styled from 'styled-components/macro';
import {
  AddNewBlockElement,
  InsertBlockButton,
  QuestionBranchIcon,
  useSurveyBlockAction,
  useSurveyFormContext,
} from '@pages/Survey';
import { ThreeDotsDropdown } from '@/customize-components';
import { DuplicateIcon, PenFilled, TrashOutlined } from '@/icons';
import { keysAction, useSelectTableRecord } from '@/hooks';

const Wrapper = styled.div`
  .add-icon {
    position: absolute;
    top: -20px;
    left: -30px;
    z-index: 1;
    height: 20px;
  }
`;

const bgColor: Record<SubSurveyFlowElement, string> = {
  [SubSurveyFlowElement.END_SURVEY]: '#1CA62D20',
  [SubSurveyFlowElement.BRANCH]: '#C820FF20',
  [SubSurveyFlowElement.BLOCK]: '#2B36BA20',
  [SubSurveyFlowElement.EMBEDDED_DATA]: '#00AEC720',
};

const QuestionBlock: FC<{ record: SurveyDataTreeNode }> = props => {
  const { t } = useTranslation();
  const { record } = props;
  const fieldName = record.fieldName;
  const { isEditMode } = useCheckSurveyFormMode();
  const { setSurveyFormContext } = useSurveyFormContext();

  const { handleDuplicateBlock, handleRemoveBlock } =
    useSurveyBlockAction(record);

  const [{ value }, { error, touched }] =
    useField<SurveyDataTreeNode>(fieldName);

  const childrenLength = useMemo<number>(() => {
    switch (record.type) {
      case SubSurveyFlowElement.BLOCK:
        return record?.surveyQuestions?.length || 0;
      case SubSurveyFlowElement.BRANCH:
        return record?.branchLogics?.length || 0;
      case SubSurveyFlowElement.EMBEDDED_DATA:
        return record?.listEmbeddedData?.length || 0;
      default:
        return 0;
    }
  }, [record]);

  const blockError = useMemo(() => {
    const errorChildren = (error as unknown as { children: string })?.children;
    return typeof errorChildren === 'string' ? errorChildren : '';
  }, [error]);

  const handleRename = useCallback(
    (record: SurveyDataTreeNode) => {
      setSurveyFormContext(oldState => ({
        ...oldState,
        tree: {
          ...oldState.tree,
          focusBlock: record,
        },
      }));
    },
    [setSurveyFormContext],
  );

  const tableActions = useMemo<keysAction<SurveyDataTreeNode>>(
    () => [
      {
        key: ACTION.RENAME,
        action: handleRename,
      },
      {
        key: ACTION.DUPLICATE,
        action: handleDuplicateBlock,
      },
      {
        key: ACTION.DELETE,
        action: handleRemoveBlock,
      },
    ],
    [handleDuplicateBlock, handleRemoveBlock, handleRename],
  );

  const { handleSelect } =
    useSelectTableRecord<SurveyDataTreeNode>(tableActions);

  return (
    <>
      <Wrapper
        className={`rounded-[6px] border p-2 w-fit`}
        style={{
          background: bgColor[record.type],
          borderColor:
            !!error && touched ? DEFAULT_THEME_COLOR.ERROR : 'inherit',
        }}
      >
        <div className={'group/block flex gap-3 items-center'}>
          <QuestionBranchIcon type={record?.type} />
          <span className={'font-semibold'}>
            {record?.type === SubSurveyFlowElement.BLOCK
              ? value?.blockDescription
              : t(`common.${record?.type}`)}
          </span>

          {record?.type !== SubSurveyFlowElement.END_SURVEY && (
            <span
              className={
                'px-[8px] rounded-[1rem] bg-[#23256714] text-[12px] font-semibold'
              }
            >
              {childrenLength}
            </span>
          )}
          {isEditMode && record.type === SubSurveyFlowElement.BRANCH && (
            <div
              className={
                'ease-in-out transition invisible w-0 opacity-0 group-hover/block:w-auto group-hover/block:opacity-100 group-hover/block:visible'
              }
            >
              <AddNewBlockElement fieldName={fieldName} type={'icon'} />
            </div>
          )}
          {isEditMode && (
            <ActionThreeDropDown record={record} handleSelect={handleSelect} />
          )}
        </div>

        {touched && blockError && (
          <div className={'p-3 rounded ant-form-item-explain-error font-[600]'}>
            {blockError}
          </div>
        )}

        {isEditMode && (
          <span className={'group/node add-icon p-0'}>
            <span className={'invisible group-hover/node:visible'}>
              <InsertBlockButton fieldName={fieldName} />
            </span>
          </span>
        )}
      </Wrapper>
    </>
  );
};

export default memo(QuestionBlock);

const ACTION = {
  DELETE: 'DELETE',
  RENAME: 'RENAME',
  DUPLICATE: 'DUPLICATE',
} as const;

const ActionThreeDropDown: FC<
  ActionThreeDropDownType<SurveyDataTreeNode>
> = props => {
  const { record, handleSelect } = props;
  const { t } = useTranslation();

  const items = useMemo<IMenuItem[]>(() => {
    const base: IMenuItem[] = [
      {
        key: ACTION.DUPLICATE,
        icon: <DuplicateIcon className="text-primary" />,
        label: <label className={''}> {t('common.duplicate')}</label>,
      },
      {
        key: ACTION.DELETE,
        icon: <TrashOutlined className="text-primary" />,
        label: <label className={''}> {t('common.delete')}</label>,
      },
    ];
    if (record.type === SubSurveyFlowElement.BLOCK) {
      base.unshift({
        key: ACTION.RENAME,
        icon: <PenFilled className="text-primary" />,
        label: <label className={''}> {t('common.rename')}</label>,
      });
    }
    return base;
  }, [record.type, t]);

  return (
    <ThreeDotsDropdown
      onChooseItem={key => handleSelect({ key, record })}
      items={items}
      className={'px-3'}
      size={'small'}
    />
  );
};
