import {FC} from 'react';
import Block from '@components/Block/Block';
import {SubSurveyFlowElement} from '@/type';
import {CubeIcon, SingleChoiceCubeIcon} from '@/icons';
import {Button} from 'antd';
import {AddNewQuestionModal} from '@pages/Survey';
import AddQuestionFormCategoryModal from '../AddQuestionFormCategoryModal';
import {useToggle} from '@/utils';
import {useTranslation} from 'react-i18next';
import {blockColor} from '../QuestionBranchIcon/QuestionBranchIcon';

const EmptyQuestion: FC<{ fieldName: string }> = props => {
  const { fieldName } = props;
  const [openLoadCategoryForm, toggleLoadCategoryForm] = useToggle();

  const [openAddQuestionModal, toggleAddQuestionModal] = useToggle();
  const { t } = useTranslation();
  return (
    <div
      className={
        'w-full h-full flex justify-center items-center overflow-scroll'
      }
    >
      <div className={'w-[600px] flex flex-col gap-6'}>
        <Block
          iconColor={blockColor[SubSurveyFlowElement.BLOCK]}
          title={t('common.oneQuestion')}
          desc={t('direction.addOneQuestion')}
          icon={<SingleChoiceCubeIcon className={'text-white'} />}
          action={
            <Button
              type={'primary'}
              className={'info-btn'}
              onClick={toggleAddQuestionModal}
            >
              {t('common.addQuestion')}
            </Button>
          }
        />
        <Block
          iconColor={blockColor[SubSurveyFlowElement.BLOCK]}
          title={t('common.theWholeCategory')}
          desc={t('direction.selectWholeCategory')}
          icon={<CubeIcon className={'text-white'} />}
          action={
            <Button
              type={'primary'}
              className={'info-btn'}
              onClick={toggleLoadCategoryForm}
            >
              {t('common.addCategory')}
            </Button>
          }
        />
        <AddNewQuestionModal
          open={openAddQuestionModal}
          toggleOpen={toggleAddQuestionModal}
          fieldName={`${fieldName}.surveyQuestions`}
        />
        {openLoadCategoryForm && (
          <AddQuestionFormCategoryModal
            open={openLoadCategoryForm}
            onCancel={toggleLoadCategoryForm}
            fieldName={`${fieldName}.surveyQuestions`}
          />
        )}
      </div>
    </div>
  );
};

export default EmptyQuestion;
