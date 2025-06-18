import React, { FC } from 'react';
import { questionValueType, RemarkSection } from '@pages/Survey';
import { useTranslation } from 'react-i18next';
import { useToggle } from '@/utils';
import { gen_QID_template } from '@pages/Survey/DetailSurvey/SurveyDetailLayout/Body/DetailNode/Body/types/Branch';
import { CopyButton } from '@/modules/common';
import { Button, Divider } from 'antd';
import { Chat } from '@/icons';
import SimpleBar from 'simplebar-react';

const DisplaySurveyQuestion: FC<{
  record: questionValueType;
  index: number;
  blockSort: number;
  fieldName: string;
}> = props => {
  const { record, index, blockSort, fieldName } = props;
  const { t } = useTranslation();
  const [expanded, toggleExpanded] = useToggle();

  const content = gen_QID_template({
    blockSort,
    sort: (index + 1) as number,
  });

  return (
    <div className={''}>
      <p
        className={
          'overflow-hidden truncate w-[500px] text-[16px] font-semibold'
        }
      >
        {record.questionTitle}
      </p>
      <span className={'flex items-center gap-3 pb-3'}>
        <div className={'flex gap-1 items-center'}>
          <p className={'m-0'}>
            <span className={'font-semibold text-[12px]'}>ID:</span>{' '}
            <span className={'text-[12px]'}>{content}</span>
          </p>
          <CopyButton content={content} />
        </div>

        <Divider type="vertical" className={'h-[8px]'} />

        <div className={'flex gap-1.5 items-center text-info '}>
          <Button
            shape={'round'}
            type={expanded ? 'primary' : 'text'}
            className={'info-btn'}
            icon={<Chat />}
            onClick={toggleExpanded}
          >
            <span className={'font-semibold text-[12px]'}>
              {t('common.remark')}
            </span>
            <span
              className={
                'font-semibold text-[12px] rounded-[32px] px-3 py-[3px] text-[#007AE7]'
              }
              style={{
                background: expanded ? '#fff' : '#cae3ff',
              }}
            >
              {record?.remarks?.length || '0'}
            </span>
          </Button>
        </div>
      </span>
      <div
        className={'max-w-[630px] overflow-hidden transition-[height]'}
        style={{ height: expanded ? '100%' : 0 }}
      >
        <SimpleBar className={'max-h-[260px] h-full overflow-scroll pr-1'}>
          <div className={'p-3'}>
            <RemarkSection
              remarks={record?.remarks || []}
              fieldName={fieldName}
            />
          </div>
        </SimpleBar>
      </div>
    </div>
  );
};
export default DisplaySurveyQuestion;
