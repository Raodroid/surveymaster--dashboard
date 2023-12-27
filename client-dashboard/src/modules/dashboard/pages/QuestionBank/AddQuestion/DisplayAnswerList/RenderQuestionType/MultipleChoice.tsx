import { useCallback, useMemo } from 'react';
import { DragTable } from '@/modules/dashboard';
import { ColumnsType } from 'antd/lib/table/interface';
import { useTranslation } from 'react-i18next';
import { TrashOutlined } from 'icons';
import { useFormikContext } from 'formik';
import {
  BaseQuestionVersionDto,
  IQuestionVersionOption,
  QuestionType,
} from 'type';
import { Button } from 'antd';
import SimpleBar from 'simplebar-react';
import { useMatch } from 'react-router-dom';
import { ROUTE_PATH } from '@/enums';

import { AnswerListWrapper } from './style';
import { INPUT_TYPES } from '@input/type';
import { generateRandom } from 'modules/common/funcs';
import { DragHandle } from '@/customize-components';
import { ControlledInput } from '@/modules/common';
import { filterColumn, IRenderColumnCondition } from '@/utils';
import { InputWrapperMultipleChoice } from '../styles';

const MultipleChoice = ({ isKeyPath = true }: { isKeyPath?: boolean }) => {
  const { t } = useTranslation();
  const { values, setValues } = useFormikContext<BaseQuestionVersionDto>();

  const isViewMode = useMatch({
    path: ROUTE_PATH.DASHBOARD_PATHS.QUESTION_BANK.VIEW_QUESTION,
    end: true,
    caseSensitive: true,
  });

  const className = isViewMode ? 'view-mode' : undefined;

  const handleDeleteRow = useCallback(
    (record: IQuestionVersionOption) => {
      setValues(s => ({
        ...s,
        options: s?.options?.filter(s => s.id !== record.id),
      }));
    },
    [setValues],
  );

  const columns: ColumnsType<IQuestionVersionOption> = useMemo(
    () => [
      {
        title: t('common.order'),
        dataIndex: 'order',
        width: 100,
        render: (value, record, index) => {
          return (
            <span className={'drag-icon-wrapper'}>
              {!isViewMode && <DragHandle />}
              <span className={'title'}>{index}</span>
            </span>
          );
        },
      },
      {
        title:
          values.type === QuestionType.FORM_FIELD
            ? t('common.field')
            : t('common.question'),
        dataIndex: 'question',
        render: (value, record, index) => {
          return (
            <InputWrapperMultipleChoice>
              <ControlledInput
                inputType={INPUT_TYPES.INPUT}
                name={`options[${index}].text`}
                className={className}
                aria-label={`options[${index}].text`}
                placeholder={'Title'}
              />
              {isKeyPath && (
                <ControlledInput
                  style={{ marginLeft: 10 }}
                  inputType={INPUT_TYPES.INPUT}
                  name={`options[${index}].keyPath`}
                  className={className}
                  aria-label={`options[${index}].keyPath`}
                  placeholder={'Key Path'}
                />
              )}
            </InputWrapperMultipleChoice>
          );
        },
      },

      {
        title: '',
        dataIndex: 'action',
        width: 60,
        render: (value, record, index) => (
          <Button
            type={'text'}
            aria-label={'trash-icon'}
            onClick={() => {
              handleDeleteRow(record);
            }}
          >
            <TrashOutlined className={'trash-icon'} />
          </Button>
        ),
      },
    ],
    [className, handleDeleteRow, isKeyPath, isViewMode, t, values.type],
  );

  const renderColumnCondition: IRenderColumnCondition = [
    {
      condition: !!isViewMode,
      indexArray: ['action'],
    },
  ];

  const columnsFiltered = filterColumn<IQuestionVersionOption>(
    renderColumnCondition,
    columns,
  );

  const dataSource = useMemo(() => values.options || [], [values.options]);

  const setDataTable = (options: IQuestionVersionOption[]) => {
    setValues(s => ({
      ...s,
      options,
    }));
  };

  return (
    <SimpleBar>
      <AnswerListWrapper>
        <DragTable
          columns={columnsFiltered}
          dataSource={dataSource}
          setDataTable={setDataTable}
          pagination={false}
        />
        {!isViewMode && <GroupSurveyButton />}
      </AnswerListWrapper>
    </SimpleBar>
  );
};

export default MultipleChoice;

const initNewRowValue = {
  id: '',
  text: '',
};

const GroupSurveyButton = () => {
  const { setValues, values } = useFormikContext<BaseQuestionVersionDto>();
  const { t } = useTranslation();

  const handleAddRow = useCallback(() => {
    setValues(s => ({
      ...s,
      options: [
        ...(s.options || []),
        {
          ...initNewRowValue,
          id: generateRandom().toString(),
          sort: generateRandom(),
        },
      ],
    }));
  }, [setValues]);

  return (
    <Button type={'primary'} onClick={handleAddRow} style={{ width: `100%` }}>
      {values.type === QuestionType.FORM_FIELD
        ? t('common.addOneMoreField')
        : t('common.addOneMoreQuestion')}
    </Button>
  );
};
