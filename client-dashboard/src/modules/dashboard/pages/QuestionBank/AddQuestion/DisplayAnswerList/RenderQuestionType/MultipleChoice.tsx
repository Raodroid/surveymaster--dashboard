import React, { useCallback, useMemo } from 'react';
import { DragTable } from '../../../../../components/DragTable/DragTable';
import { ColumnsType } from 'antd/lib/table/interface';
import { useTranslation } from 'react-i18next';
import { SortableHandle } from 'react-sortable-hoc';
import { DragIcon, TrashOutlined } from 'icons';
import templateVariable from 'app/template-variables.module.scss';
import { useFormikContext } from 'formik';
import {
  BaseQuestionVersionDto,
  IQuestionVersionOption,
  QuestionType,
} from 'type';
import { Button } from 'antd';
import SimpleBar from 'simplebar-react';
import { useMatch } from 'react-router-dom';
import { ROUTE_PATH } from '../../../../../../../enums';
import {
  filterColumn,
  IRenderColumnCondition,
} from '../../../../../../../utils';
import { AnswerListWrapper } from './style';
import { INPUT_TYPES } from '../../../../../../common/input/type';
import { ControlledInput } from '../../../../../../common';
import { generateRandom } from 'modules/common/funcs';

const DragHandle = SortableHandle(() => (
  <DragIcon
    style={{ cursor: 'grab', color: templateVariable.text_primary_color }}
  />
));

const MultipleChoice = () => {
  const { t } = useTranslation();
  const { values, setValues } = useFormikContext<BaseQuestionVersionDto>();

  const isViewMode = useMatch({
    path: ROUTE_PATH.DASHBOARD_PATHS.QUESTION_BANK.VIEW_QUESTION,
    end: true,
    caseSensitive: true,
  });

  const className = !!isViewMode ? 'view-mode' : undefined;

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
            <ControlledInput
              inputType={INPUT_TYPES.INPUT}
              name={`options[${index}].text`}
              className={className}
              aria-label={`options[${index}].text`}
            />
          );
        },
      },

      {
        title: '',
        dataIndex: 'action',
        width: 60,
        render: (value, record, index) => (
          <Button
            ghost
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
    [className, handleDeleteRow, isViewMode, t, values.type],
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

  const dataSource = useMemo(
    () => (values.options || []).map((q, index) => ({ ...q, index })),
    [values.options],
  );

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
