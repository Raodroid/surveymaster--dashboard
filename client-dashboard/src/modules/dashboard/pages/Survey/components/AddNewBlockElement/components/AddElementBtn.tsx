import { useTranslation } from 'react-i18next';
import { Button, Dropdown } from 'antd';
import { objectKeys } from '@/utils';
import { SubSurveyFlowElement } from '@/type';
import QuestionBranchIcon from '../../QuestionBranchIcon/QuestionBranchIcon';
import { PlusOutLinedIcon } from '@/icons';

interface AddElementBtn {
  handleAddElement: (type: SubSurveyFlowElement) => void;
}

export const AddElementBtn = function (props: AddElementBtn) {
  const { handleAddElement } = props;
  const { t } = useTranslation();
  return (
    <Dropdown
      placement={'bottomRight'}
      trigger={['hover']}
      menu={{
        items: objectKeys(SubSurveyFlowElement).map(key => {
          const val = SubSurveyFlowElement[key];
          return {
            label: (
              <div className={'pb-2 flex gap-3 items-center'}>
                <QuestionBranchIcon type={val} />
                <span className={'font-semibold'}>{t(`common.${val}`)}</span>
              </div>
            ),
            key: val,
          };
        }),
        onClick: e => {
          e.domEvent.stopPropagation();
          handleAddElement(e.key as SubSurveyFlowElement);
        },
      }}
    >
      <Button
        type={'primary'}
        className={'info-btn'}
        icon={<PlusOutLinedIcon />}
      >
        <span className={'text-white font-semibold'}>
          {t('common.addNewElement')}
        </span>
      </Button>
    </Dropdown>
  );
};
