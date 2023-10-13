import React, { FC, useState } from 'react';
import { Button, Collapse, Tooltip } from 'antd';
import { INPUT_TYPES } from '@/modules/common/input/type';
import { ControlledInput } from '../../../../../../../../../../../common';
import { FileIconOutlined, TrashOutlined } from '@/icons';
import { useTranslation } from 'react-i18next';
import SurveyQuestions from '../SurveyQuestion/SurveyQuestions';
import { SubSurveyFlowElement, SubSurveyFlowElementDto } from '@/type';
import { objectKeys } from '@/utils';
import { useField } from 'formik';

const { Panel } = Collapse;

const QuestionBlockCollapse: FC<{
  index: number;
}> = props => {
  const { t } = useTranslation();
  const { index } = props;
  const [{ value }, , { setValue }] = useField<SubSurveyFlowElementDto[]>(
    'version.surveyFlowElements',
  );

  const [activeKey, setActiveKey] = useState<number[]>([]);

  const toggleActiveKey = (key: number) => {
    setActiveKey(s =>
      s.includes(key) ? s.filter(i => i !== key) : [...s, key],
    );
  };

  const record = value[index];

  const questionLength = value[index]?.surveyQuestions?.length;

  const handleRemoveBlock = () =>
    setValue(value.filter((i, idx) => idx !== index));

  const handleDuplicateBlock = () => {
    setValue([...value, value[index]]);
  };

  return (
    <>
      <Collapse ghost className={'w-full'} activeKey={activeKey}>
        <Panel
          header={
            <div
              className={'flex gap-3'}
              onChange={e => {
                e.stopPropagation();
              }}
            >
              <ControlledInput
                className={'w-[100px]'}
                label={t('common.type')}
                name={`version.surveyFlowElements[${index}].type`}
                inputType={INPUT_TYPES.SELECT}
                options={objectKeys(SubSurveyFlowElement).map(i => ({
                  label: i,
                  value: SubSurveyFlowElement[i],
                }))}
              />
              {record.type && (
                <>
                  <BlockNameInput
                    fieldName={`version.surveyFlowElements[${index}].blockDescription`}
                  />

                  <Button
                    className={'px-2'}
                    size={'small'}
                    type={'text'}
                    onClick={() => {
                      toggleActiveKey(record.sort);
                    }}
                  >
                    ({questionLength} Question{questionLength ? 's' : ''})
                  </Button>
                </>
              )}
            </div>
          }
          key={record.sort}
          showArrow={false}
        >
          <SurveyQuestions index={index} />
        </Panel>
        <div className={'absolute right-3 top-6'}>
          <div className={'flex gap-3'}>
            <Tooltip title={t('common.duplicate')}>
              <Button
                size={'small'}
                type={'text'}
                className={'px-2'}
                onClick={handleDuplicateBlock}
              >
                <FileIconOutlined />
              </Button>
            </Tooltip>
            <Tooltip title={t('common.remove')}>
              <Button
                size={'small'}
                type={'text'}
                className={'px-2'}
                danger
                onClick={handleRemoveBlock}
              >
                <TrashOutlined />
              </Button>
            </Tooltip>
          </div>
        </div>
      </Collapse>
    </>
  );
};

export default QuestionBlockCollapse;

const BlockNameInput: FC<{ fieldName: string }> = props => {
  const { fieldName } = props;
  return (
    <ControlledInput
      className={'w-[200px] hide-helper-text'}
      inputType={INPUT_TYPES.INPUT}
      name={fieldName}
      label={'Block:'}
    />
  );
};
