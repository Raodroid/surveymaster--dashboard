import { IAction } from 'interfaces';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { useHandleActionType } from '../../../utils';
import { ActionWrapper } from './styles';

function Action(props: { action: IAction; today?: boolean }) {
  const { action, today = false } = props;
  const { t } = useTranslation();

  const actionText = useHandleActionType(action);

  if (!action) return <></>;

  return (
    <ActionWrapper className="flex-column">
      <div className="flex-j-start header-wrapper">
        {today ? (
          <span className="date">{t('common.today')}</span>
        ) : (
          <span className="date">
            {action?.createdAt
              ? moment(action.createdAt).format('DD.MM')
              : t('common.today')}
          </span>
        )}
        <span className="auth">
          {action.owner.firstName + ' ' + action.owner.lastName}
        </span>
      </div>
      <div className={`action ${today ? 'today' : ''}`}>{actionText}</div>
    </ActionWrapper>
  );
}

export default Action;
