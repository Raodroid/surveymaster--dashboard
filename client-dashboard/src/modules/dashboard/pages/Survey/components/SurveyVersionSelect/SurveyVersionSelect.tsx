import React, { FC, useCallback } from 'react';
import { RoundedSelect } from '@/customize-components';
import { SelectProps } from 'antd/lib/select';
import { useNavigate } from 'react-router';
import qs from 'qs';
import { useParseQueryString } from '@/hooks';
import { IGetParams } from '@/type';
import { useCheckSurveyFormMode } from '@pages/Survey';
import { useFormikContext } from 'formik';
import { Modal } from 'antd';
import { Trans } from 'react-i18next';
const { confirm } = Modal;

const SurveyVersionSelect: FC<{
  options: SelectProps['options'];
  value: SelectProps['value'];
}> = props => {
  const { options, value } = props;
  const qsParams = useParseQueryString<IGetParams & { version?: string }>();
  const navigate = useNavigate();
  const { isEditMode } = useCheckSurveyFormMode();
  const { dirty } = useFormikContext(); //only use the component inside formik component

  const handleDirect = useCallback(
    options => {
      const newQes = qs.stringify({
        ...qsParams,
        version: options.label,
      });
      navigate(`${window.location.pathname}?${newQes}`);
    },
    [navigate, qsParams],
  );

  const changeVersion = useCallback(
    (version, options) => {
      if (isEditMode && dirty) {
        confirm({
          icon: null,
          content: (
            <Trans
              i18nKey="direction.warningLostData" // optional -> fallbacks to defaults if not provided
            />
          ),
          onOk() {
            handleDirect(options);
          },
        });
        return;
      }
      handleDirect(options);
    },
    [dirty, handleDirect, isEditMode],
  );

  return (
    <RoundedSelect
      value={value}
      options={options}
      className={'w-[200px]'}
      onChange={changeVersion}
    />
  );
};

export default SurveyVersionSelect;
