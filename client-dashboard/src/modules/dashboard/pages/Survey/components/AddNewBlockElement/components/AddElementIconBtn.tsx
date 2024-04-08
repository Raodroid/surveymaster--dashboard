import { useTranslation } from 'react-i18next';
import { Button, Dropdown } from 'antd';
import { objectKeys } from '@/utils';
import { SubSurveyFlowElement } from '@/type';
import QuestionBranchIcon from '../../QuestionBranchIcon/QuestionBranchIcon';
import { PlusOutLinedIcon } from '@/icons';

interface IAddElementIconBtn {
  handleAddElement: (type: SubSurveyFlowElement) => void;
}

export const AddElementIconBtn = function (props: IAddElementIconBtn) {
  const { handleAddElement } = props;
  const { t } = useTranslation();
  return (
    <Dropdown
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
        shape={'round'}
        className={'!px-[3px] !h-[20px]'}
        size={'small'}
        icon={<PlusOutLinedIcon />}
      />
    </Dropdown>
  );
};
