import { useCallback } from 'react';
import Block from '@components/Block/Block';
import { EmptyString, SubSurveyFlowElement } from '@/type';
import { BranchIcon, EmbeddedTypeIcon, QuestionTypeIcon } from '@/icons';
import { Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { blockColor } from '@pages/Survey/components/QuestionBranchIcon/QuestionBranchIcon';
import {
  genBlockSort,
  genDefaultBlockDescription,
  rootSurveyFlowElementFieldName,
  SurveyDataTreeNode,
  useSurveyFormContext,
} from '@pages/Survey';
import { useField } from 'formik';

const defaultNode: SurveyDataTreeNode = {
  blockSort: 0,
  sort: Math.random(),
  type: SubSurveyFlowElement.BRANCH,
  blockDescription: '',
  surveyQuestions: [],
  branchLogics: [],
  listEmbeddedData: [],
  children: [],
  key: '',
  title: '',
  fieldName: '',
};

const EmptyBlock = () => {
  const { t } = useTranslation();
  const [, , { setValue }] = useField<Array<EmptyString<SurveyDataTreeNode>>>(
    rootSurveyFlowElementFieldName,
  );

  const { setSurveyFormContext } = useSurveyFormContext();

  const handleAddBlock = useCallback(
    (type: SubSurveyFlowElement) => {
      const fieldName = `${rootSurveyFlowElementFieldName}[0]`;
      const newBlockValue: SurveyDataTreeNode = {
        ...defaultNode,
        type,
        blockSort: genBlockSort(),
        fieldName,
        key: `${rootSurveyFlowElementFieldName}[0]`,
        blockDescription: genDefaultBlockDescription(fieldName),
      };

      setValue([newBlockValue]);

      setSurveyFormContext(oldState => ({
        ...oldState,
        tree: {
          ...oldState.tree,
          focusBlock: newBlockValue,
        },
      }));
    },
    [setSurveyFormContext, setValue],
  );

  return (
    <div
      className={
        'w-full h-full flex justify-center items-center overflow-scroll'
      }
    >
      <div className={'w-[600px] flex flex-col gap-6'}>
        <Block
          iconColor={blockColor[SubSurveyFlowElement.BLOCK]}
          title={t('common.questionary')}
          desc={t('direction.questionary')}
          icon={<QuestionTypeIcon className={'text-white'} />}
          action={
            <Button
              type={'primary'}
              className={'info-btn'}
              onClick={() => {
                handleAddBlock(SubSurveyFlowElement.BLOCK);
              }}
            >
              {t('common.addBlock')}
            </Button>
          }
        />
        <Block
          iconColor={blockColor[SubSurveyFlowElement.BRANCH]}
          title={t('common.branch')}
          desc={t('direction.branch')}
          icon={<BranchIcon className={'text-white'} />}
          action={
            <Button
              type={'primary'}
              className={'info-btn'}
              onClick={() => {
                handleAddBlock(SubSurveyFlowElement.BRANCH);
              }}
            >
              {t('common.addBlock')}
            </Button>
          }
        />
        <Block
          iconColor={blockColor[SubSurveyFlowElement.EMBEDDED_DATA]}
          title={t('common.embeddedData')}
          desc={t('direction.embeddedData')}
          icon={<EmbeddedTypeIcon className={'text-white'} />}
          action={
            <Button
              type={'primary'}
              className={'info-btn'}
              onClick={() => {
                handleAddBlock(SubSurveyFlowElement.EMBEDDED_DATA);
              }}
            >
              {t('common.addBlock')}
            </Button>
          }
        />
      </div>
    </div>
  );
};

export default EmptyBlock;
