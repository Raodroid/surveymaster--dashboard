import { FC, memo } from 'react';
import { IModal, SubSurveyFlowElement } from '@/type';
import { Divider, Empty, Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  rootSurveyFlowElementFieldName,
  SurveyDataTreeNode,
} from '@pages/Survey';
import { useField } from 'formik';
import { RoundedTag } from '@components/index';
import DisplaySurveyQuestion from '@pages/Survey/components/SurveyQuestion/DisplaySurveyQuestion';
import SimpleBar from 'simplebar-react';

const OverviewQuestionModal: FC<IModal> = props => {
  const { open, toggleOpen } = props;
  const { t } = useTranslation();
  const [{ value }] = useField<Array<SurveyDataTreeNode>>(
    rootSurveyFlowElementFieldName,
  );
  const allQuestionBlock = value.filter(
    i => i.type === SubSurveyFlowElement.BLOCK,
  );
  return (
    <Modal
      open={open}
      onCancel={toggleOpen}
      width={800}
      footer={false}
      centered
      title={t('common.allQuestions')}
    >
      <div
        className={'overflow-hidden h-full'}
        style={{ maxHeight: 'calc(90vh - 77px)' }}
      >
        <SimpleBar
          style={{ maxHeight: 'calc(90vh - 77px)' }}
          className={'overflow-y-scroll'}
        >
          <div className={'pr-3'}>
            {allQuestionBlock.length === 0 && <Empty />}
            {allQuestionBlock.map(block => (
              <div key={block.fieldName} className={''}>
                <span
                  className={
                    'inline-block font-semibold text-[16px] mb-3 text-textColor'
                  }
                >
                  {block.blockDescription}
                </span>
                <ul>
                  {block.surveyQuestions.map((question, index) => (
                    <li key={question.questionVersionId} className={'mb-3'}>
                      <DisplaySurveyQuestion
                        record={question}
                        index={index}
                        blockSort={block.blockSort as number}
                        fieldName={`${block.fieldName}.surveyQuestions[${index}]`}
                      />
                      <div className={'flex gap-3'}>
                        <RoundedTag title={question.category} />
                        <RoundedTag
                          title={t(`questionType.${question.type}`)}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
                <Divider />
              </div>
            ))}
          </div>
        </SimpleBar>
      </div>
    </Modal>
  );
};

export default memo(OverviewQuestionModal);
