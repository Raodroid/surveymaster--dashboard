import { useCallback, useMemo, useState } from 'react';
import * as Yup from 'yup';
import { ControlledInput, INVALID_FIELDS } from '@/modules/common';
import { Button, Divider, Form } from 'antd';
import { INPUT_TYPES } from '@input/type';
import { Formik, FormikHelpers } from 'formik';
import { IGetParams, IOptionItem } from '@/type';
import { onError, useDebounce } from '@/utils';
import { useTranslation } from 'react-i18next';
import { RoleEnum } from '@/enums';
import { AdminService } from '@/services';
import { useQuery } from 'react-query';
import _get from 'lodash/get';

const initValue: { userId: string } = {
  userId: '',
};
const baseParams: IGetParams = {
  selectAll: true,
  isDeleted: false,
  roleIds: [RoleEnum.STAFF_SUPER_ADMIN],
};

const RequestApproveFrom = (props: {
  onSubmit: (
    values: typeof initValue,
    helper: FormikHelpers<any>,
  ) => Promise<void>;
}) => {
  const { t } = useTranslation();
  const { onSubmit } = props;
  const [search, setSearch] = useState<string>('');

  const handleTyping = useCallback((value: string) => {
    setSearch(value);
  }, []);

  const searchDebounce = useDebounce(search);

  const query = useQuery(
    ['getAdmins', baseParams],
    () => AdminService.getTeamMembers(baseParams),
    {
      refetchOnWindowFocus: false,
      onError,
    },
  );
  const optionsList = useMemo<IOptionItem[]>(
    () =>
      _get(query.data, 'data.data', []).map(elm => {
        return {
          label: `${elm.firstName || ''} ${elm.lastName || ''}`,
          value: elm.id,
        };
      }),
    [query.data],
  );

  const options = useMemo<IOptionItem[]>(
    () =>
      optionsList.reduce((result: IOptionItem[], option) => {
        if ((option?.label as string).toLowerCase().includes(searchDebounce)) {
          return [...result, option];
        }
        return result;
      }, []),
    [optionsList, searchDebounce],
  );
  return (
    <Formik
      enableReinitialize={true}
      onSubmit={onSubmit}
      initialValues={initValue}
      validationSchema={Yup.object().shape({
        userId: Yup.string().required(INVALID_FIELDS.REQUIRED),
      })}
    >
      {({ handleSubmit }) => (
        <>
          <Form
            layout={'vertical'}
            onFinish={handleSubmit}
            className={'flex flex-col h-full'}
            id={'rename-form'}
          >
            <ControlledInput
              showSearch
              inputType={INPUT_TYPES.SELECT}
              name="userId"
              label={t('common.approvalPerson')}
              options={options}
              onSearch={handleTyping}
              loading={query.isLoading}
            />
            <Divider />
            <Button
              type={'primary'}
              htmlType={'submit'}
              size={'large'}
              className="secondary-btn w-full"
              form={'rename-form'}
            >
              {t('common.submit')}
            </Button>
          </Form>
        </>
      )}
    </Formik>
  );
};

export default RequestApproveFrom;
