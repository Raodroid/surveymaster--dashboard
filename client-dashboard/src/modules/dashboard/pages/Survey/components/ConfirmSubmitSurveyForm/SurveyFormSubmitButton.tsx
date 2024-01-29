import { SaveIcon } from '@/icons';
import { Button } from 'antd';
import { useToggle } from '@/utils';
import { useTranslation } from 'react-i18next';
import ConfirmSubmitSurveyForm from './ConfirmSubmitSurveyForm';
import { useFormikContext } from 'formik';
import { IEditSurveyFormValues } from '@pages/Survey';
import _isEmpty from 'lodash/isEmpty';

const SurveyFormSubmitButton = () => {
  const [open, toggleOpen] = useToggle();
  const { t } = useTranslation();
  const { setTouched, touched, dirty, validateForm } =
    useFormikContext<IEditSurveyFormValues>();
  return (
    <>
      <Button
        disabled={!dirty}
        type={'primary'}
        onClick={() => {
          validateForm().then(errors => {
            if (_isEmpty(errors)) {
              toggleOpen();
            } else {
              const three = Object.assign({}, touched, errors);
              setTouched(three);
            }
          });
        }}
        icon={<SaveIcon />}
      >
        {t('common.save')}
      </Button>
      <ConfirmSubmitSurveyForm open={open} toggleOpen={toggleOpen} />
    </>
  );
};

export default SurveyFormSubmitButton;
