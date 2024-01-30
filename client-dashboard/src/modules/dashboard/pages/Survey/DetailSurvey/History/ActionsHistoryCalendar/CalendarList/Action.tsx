import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { Avatar, Collapse, Divider, Typography } from 'antd';
import { QuestionHistoryType, SurveyHistory, SurveyHistoryType } from '@/type';
import { useToggle } from '@/utils';
import { Link } from 'react-router-dom';
import { ArrowRight } from '@/icons';
const { Panel } = Collapse;

const haveChildrenToShowMap = {
  [SurveyHistoryType.SURVEY_VERSION_UPDATED]: true,
  [QuestionHistoryType.QUESTION_VERSION_UPDATED]: true,
} as const;
function Action(props: { action?: SurveyHistory; today?: boolean }) {
  const { action, today = false } = props;
  const { t } = useTranslation();

  if (!action)
    return (
      <div className={'font-semibold'}>{t('actionType.noActionsYet')}</div>
    );

  return (
    <div className="w-full overflow-hidden flex gap-4 text-textColor">
      <Avatar src={action.owner.avatar} />

      <div className={''}>
        <div className="flex items-center h-[32px]">
          <span className="font-[500]">
            {action.owner.firstName + ' ' + action.owner.lastName}
          </span>

          <Divider type="vertical" className={'h-[8px] mx-[16px] my-0'} />

          <span className="opacity-40">
            {today || !action?.createdAt
              ? t('common.today')
              : moment(action.createdAt).fromNow()}
          </span>
        </div>
        <div className={`font-[500]`}>
          {haveChildrenToShowMap[action.type] ? (
            <ExpandableRow action={action} />
          ) : (
            t(`actionType.${action.type}`, {
              newItem: action.newItem,
              oldItem: action.oldItem,
            })
          )}
        </div>
      </div>
    </div>
  );
}

const ExpandableRow = (props: { action: SurveyHistory }) => {
  const { action } = props;
  const [open, toggle] = useToggle();
  const { t } = useTranslation();
  return (
    <>
      <div className={'flex items-center gap-3'}>
        <Typography
          onClick={toggle}
          className={'cursor-pointer text-textColor'}
        >
          {t(`actionType.${action.type}`, {
            newItem: action.newItem,
            oldItem: action.oldItem,
          })}
        </Typography>
        <ArrowRight onClick={toggle} className={'cursor-pointer'} />
      </div>
      <ul className={!open ? 'hidden' : ''}>
        {action?.children?.map(i => (
          <li className={'ml-6 mt-3'} key={i.id}>
            {t(`actionType.${i.type}`, {
              newItem: i.newItem || action.newItem,
              oldItem: i.oldItem || action.oldItem,
            })}
          </li>
        ))}
      </ul>
    </>
  );
};

export default Action;
