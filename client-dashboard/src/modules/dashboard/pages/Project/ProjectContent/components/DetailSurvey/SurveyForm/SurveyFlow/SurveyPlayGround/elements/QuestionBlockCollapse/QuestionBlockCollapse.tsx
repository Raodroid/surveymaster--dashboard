import React, { FC, useState } from 'react';
import { Button, Collapse, Tooltip } from 'antd';
import { FileIconOutlined, TrashOutlined } from '@/icons';
import { useTranslation } from 'react-i18next';
import SurveyQuestions from '../SurveyQuestion/SurveyQuestions';
import { SubSurveyFlowElement, SubSurveyFlowElementDto } from '@/type';
import { useField } from 'formik';
import Branch from '@/modules/dashboard/pages/Project/ProjectContent/components/DetailSurvey/SurveyForm/SurveyFlow/SurveyPlayGround/elements/QuestionBlockCollapse/types/Branch/Branch';
import Block from '@/modules/dashboard/pages/Project/ProjectContent/components/DetailSurvey/SurveyForm/SurveyFlow/SurveyPlayGround/elements/QuestionBlockCollapse/types/Block/Block';
import Embedded from '@/modules/dashboard/pages/Project/ProjectContent/components/DetailSurvey/SurveyForm/SurveyFlow/SurveyPlayGround/elements/QuestionBlockCollapse/types/Embedded/Embedded';
import EndSurvey from '@/modules/dashboard/pages/Project/ProjectContent/components/DetailSurvey/SurveyForm/SurveyFlow/SurveyPlayGround/elements/QuestionBlockCollapse/types/EndSurvey/EndSurvey';
import { QuestionBlockProps } from '@/modules/dashboard/pages/Project/ProjectContent/components/DetailSurvey/SurveyForm/SurveyFlow/SurveyPlayGround/elements/QuestionBlockCollapse/types/type';

const { Panel } = Collapse;

const typeMap: Record<SubSurveyFlowElement, FC<QuestionBlockProps>> = {
  [SubSurveyFlowElement.END_SURVEY]: EndSurvey,
  [SubSurveyFlowElement.BLOCK]: Block,
  [SubSurveyFlowElement.BRANCH]: Branch,
  [SubSurveyFlowElement.EMBEDDED_DATA]: Embedded,
};

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

  const questionLength = record?.surveyQuestions?.length;
  const type = record?.type;

  const TypeComponent = typeMap[type];

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
              <TypeComponent index={index} />

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
