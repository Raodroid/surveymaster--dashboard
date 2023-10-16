import { Button, Collapse, Tooltip } from 'antd';
import { FileIconOutlined, TrashOutlined } from '@/icons';
import React, { FC, useState } from 'react';

import { SubSurveyFlowElement } from '@/type';
import { QuestionBlockProps } from '@/modules/dashboard/pages/Project/ProjectContent/components/DetailSurvey/SurveyForm/SurveyFlow/SurveyPlayGround/elements/QuestionBlockCollapse/types/type';
import EndSurvey from '@/modules/dashboard/pages/Project/ProjectContent/components/DetailSurvey/SurveyForm/SurveyFlow/SurveyPlayGround/elements/QuestionBlockCollapse/types/EndSurvey/EndSurvey';
import Block from '@/modules/dashboard/pages/Project/ProjectContent/components/DetailSurvey/SurveyForm/SurveyFlow/SurveyPlayGround/elements/QuestionBlockCollapse/types/Block/Block';
import Branch from '@/modules/dashboard/pages/Project/ProjectContent/components/DetailSurvey/SurveyForm/SurveyFlow/SurveyPlayGround/elements/QuestionBlockCollapse/types/Branch/Branch';
import Embedded from '@/modules/dashboard/pages/Project/ProjectContent/components/DetailSurvey/SurveyForm/SurveyFlow/SurveyPlayGround/elements/QuestionBlockCollapse/types/Embedded/Embedded';
import { useTranslation } from 'react-i18next';
const { Panel } = Collapse;
const typeMap: Record<SubSurveyFlowElement, FC<QuestionBlockProps>> = {
  [SubSurveyFlowElement.END_SURVEY]: EndSurvey,
  [SubSurveyFlowElement.BLOCK]: Block,
  [SubSurveyFlowElement.BRANCH]: Branch,
  [SubSurveyFlowElement.EMBEDDED_DATA]: Embedded,
};

const QuesionTestBlock: FC<{ record: any }> = props => {
  const { t } = useTranslation();
  const { record } = props;
  const TypeComponent = typeMap[record.type];

  const [activeKey, setActiveKey] = useState<number[]>([]);

  const toggleActiveKey = (key: number) => {
    setActiveKey(s =>
      s.includes(key) ? s.filter(i => i !== key) : [...s, key],
    );
  };
  const questionLength = record?.surveyQuestions?.length;

  return (
    <>
      <Collapse ghost className={'w-full'}>
        <Panel
          header={
            <div
              className={'flex gap-3'}
              onChange={e => {
                e.stopPropagation();
              }}
            >
              {/*<TypeComponent />*/}

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
          {/*<SurveyQuestions index={index} />*/}
        </Panel>
        <div className={'absolute right-3 top-6'}>
          <div className={'flex gap-3'}>
            <Tooltip title={t('common.duplicate')}>
              <Button
                size={'small'}
                type={'text'}
                className={'px-2'}
                // onClick={handleDuplicateBlock}
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
                // onClick={handleRemoveBlock}
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

export default QuesionTestBlock;
