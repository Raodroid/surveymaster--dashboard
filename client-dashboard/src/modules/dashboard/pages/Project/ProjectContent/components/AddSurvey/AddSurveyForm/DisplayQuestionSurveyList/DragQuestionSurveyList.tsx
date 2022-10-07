import { ControlledInput } from 'modules/common';
import React, { FC, useState } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DroppableProps,
} from 'react-beautiful-dnd';

import { Button } from 'antd';
import { IQuestionVersionOption, QuestionType } from 'type';
import { FieldArrayRenderProps, useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { DragIcon, TrashOutlined } from 'icons';
import { INPUT_TYPES } from '../../../../../../../../common/input/type';

const reorder = (
  list: IQuestionVersionOption[],
  startIndex,
  endIndex,
): IQuestionVersionOption[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const DragOption: FC<{
  opt: IQuestionVersionOption;
  index: number;
  arrayHelpers: FieldArrayRenderProps;
}> = props => {
  const { opt, index, arrayHelpers } = props;
  return (
    <Draggable draggableId={`item${opt.id}`} index={index} key={opt.id}>
      {provided => (
        <div
          className={'DisplayQuestionSurveyListWrapper__row'}
          key={index}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div className={'DisplayQuestionSurveyListWrapper__row__item first'}>
            <DragIcon />

            <span> {index + 1}</span>
          </div>
          <div className={'DisplayQuestionSurveyListWrapper__row__item second'}>
            <ControlledInput
              inputType={INPUT_TYPES.INPUT}
              name={`questions[${index}].title`}
            />
          </div>
          <div className={'DisplayQuestionSurveyListWrapper__row__item third'}>
            <ControlledInput
              inputType={INPUT_TYPES.INPUT}
              name={`questions[${index}].categoryName`}
            />
          </div>
          <div className={'DisplayQuestionSurveyListWrapper__row__item forth'}>
            <ControlledInput
              inputType={INPUT_TYPES.INPUT}
              name={`questions[${index}].type`}
            />
          </div>
          <div className={'DisplayQuestionSurveyListWrapper__row__item fifth'}>
            <ControlledInput
              inputType={INPUT_TYPES.INPUT}
              name={`questions[${index}].remark`}
            />
          </div>
          <div className={'DisplayQuestionSurveyListWrapper__row__item sixth'}>
            <Button
              className={'delete-icon'}
              onClick={() => {
                arrayHelpers.remove(index);
                if (arrayHelpers.form?.[arrayHelpers.name]?.length === 0) {
                  arrayHelpers.push({
                    title: '',
                    questionVersionId: '',
                    remark: '',
                    id: Math.random(),
                    type: QuestionType.TEXT_ENTRY,
                    categoryName: '',
                  });
                }
              }}
              icon={
                <span>
                  <TrashOutlined />
                </span>
              }
            />
          </div>
        </div>
      )}
    </Draggable>
  );
};

const OptionList = React.memo(function QuoteListA(props: {
  items: IQuestionVersionOption[];
  arrayHelpers: FieldArrayRenderProps;
}) {
  const { items, arrayHelpers } = props;
  const { t } = useTranslation();
  return (
    <>
      <div className={'DisplayQuestionSurveyListWrapper__row'}>
        <div className={'DisplayQuestionSurveyListWrapper__row__item first'}>
          <span style={{ marginLeft: 'auto' }}>{t('common.order')}</span>
        </div>
        <div className={'DisplayQuestionSurveyListWrapper__row__item second'}>
          <span>{t('common.question')}</span>
        </div>
        <div className={'DisplayQuestionSurveyListWrapper__row__item third'}>
          <span>{t('common.questionCategory')}</span>
        </div>
        <div className={'DisplayQuestionSurveyListWrapper__row__item forth'}>
          <span>{t('common.type')}</span>
        </div>
        <div className={'DisplayQuestionSurveyListWrapper__row__item fifth'}>
          <span>{t('common.remarks')}</span>
        </div>
        <div className={'DisplayQuestionSurveyListWrapper__row__item sixth'} />
      </div>
      {(items || []).map((option: IQuestionVersionOption, index: number) => {
        return (
          <DragOption
            opt={option}
            index={index}
            key={option.id || option.sort}
            arrayHelpers={arrayHelpers}
          />
        );
      })}
    </>
  );
});

export const StrictModeDroppable = ({ children, ...props }: DroppableProps) => {
  const [enabled, setEnabled] = useState(false);

  React.useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));

    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);

  if (!enabled) {
    return null;
  }

  return <Droppable {...props}>{children}</Droppable>;
};

const DragQuestionSurveyList: FC<{
  questions: IQuestionVersionOption[];
  arrayHelpers: FieldArrayRenderProps;
}> = props => {
  const { questions, arrayHelpers } = props;

  const { setFieldValue } = useFormikContext();

  function onDragEnd(result) {
    if (!result.destination) {
      return;
    }
    if (result.destination.index === result.source.index) {
      return;
    }

    setFieldValue(
      'questions',
      reorder(questions, result.source.index, result.destination.index),
    );
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <StrictModeDroppable droppableId="list">
        {provided => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            <OptionList items={questions} arrayHelpers={arrayHelpers} />
            {provided.placeholder}
          </div>
        )}
      </StrictModeDroppable>
    </DragDropContext>
  );
};

export default DragQuestionSurveyList;
