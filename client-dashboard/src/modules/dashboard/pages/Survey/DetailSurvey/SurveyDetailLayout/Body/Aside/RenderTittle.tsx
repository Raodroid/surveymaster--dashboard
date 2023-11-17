import React, { FC, memo, useMemo } from 'react';

import { SubSurveyFlowElement } from '@/type';
import { useTranslation } from 'react-i18next';
import { useField } from 'formik';
import AddNewBlockElement from '@pages/Survey/components/AddNewBlockElement/AddNewBlockElement';
import { DEFAULT_THEME_COLOR } from '@/enums';
import { useCheckSurveyFormMode } from '@pages/Survey/SurveyForm/util';
import { SurveyDataTreeNode } from '@pages/Survey/SurveyForm/type';
import QuestionBranchIcon from '@pages/Survey/components/QuestionBranchIcon/QuestionBranchIcon';
import styled from 'styled-components/macro';
import InsertBlockButton from '@pages/Survey/components/AddNewBlockElement/InsertBlockButton';

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

  const blockError = (() => {
    const errorChildren = (error as unknown as { children: string })?.children;
    return typeof errorChildren === 'string' ? errorChildren : '';
  })();

  return (
    <>
      <Wrapper
        className={`group rounded-[6px] border p-2 w-fit ${
          record.type === SubSurveyFlowElement.BRANCH ? 'hannah' : ''
        }`}
        style={{
          background: bgColor[record.type],
          borderColor:
            !!error && touched ? DEFAULT_THEME_COLOR.ERROR : 'inherit',
        }}
      >
        <div className={'flex gap-3 items-center'}>
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
            <AddNewBlockElement fieldName={fieldName} type={'icon'} />
          )}
        </div>

        {touched && blockError && (
          <div className={'p-3 rounded ant-form-item-explain-error font-[600]'}>
            {blockError}
          </div>
        )}

        <span className={'group-hover:visible invisible add-icon p-0'}>
          <InsertBlockButton fieldName={fieldName} />
        </span>
      </Wrapper>
    </>
  );
};

export default memo(QuestionBlock);

const Wrapper = styled.div`
  .add-icon {
    position: absolute;
    top: -20px;
    left: -30px;
    z-index: 1;
    height: 20px;
  }
`;
