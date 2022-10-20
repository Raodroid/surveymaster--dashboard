import { ControlledInput } from 'modules/common';
import React, { FC, useState } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DroppableProps,
} from 'react-beautiful-dnd';
import { INPUT_TYPES } from '../../../../../common/input/type';
import { Button } from 'antd';
import { DragIcon, TrashOutlined } from '../../../../../../icons';
import { IQuestionVersionOption } from 'type';
import { FieldArrayRenderProps, useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';

export function reorder<T>(list: T[], startIndex, endIndex): T[] {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

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
          className={'DisplayAnswerListWrapper__row'}
          key={index}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div className={'DisplayAnswerListWrapper__row__first'}>
            <DragIcon />

            <span> {index + 1}</span>
          </div>
          <div className={'DisplayAnswerListWrapper__row__second'}>
            <ControlledInput
              inputType={INPUT_TYPES.INPUT}
              name={`options[${index}].text`}
            />
          </div>
          <Button
            className={'delete-icon'}
            onClick={() => {
              arrayHelpers.remove(index);
              if (arrayHelpers.form?.[arrayHelpers.name]?.length === 0) {
                arrayHelpers.push({
                  text: '',
                  id: Math.random(),
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
      <div className={'DisplayAnswerListWrapper__row'}>
        <div className={'DisplayAnswerListWrapper__row__first'}>
          <span style={{ marginLeft: 'auto' }}>{t('common.order')}</span>
        </div>
        <div className={'DisplayAnswerListWrapper__row__second'}>
          <span>{t('common.answer')}</span>
        </div>
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

const DragAnswerList: FC<{
  options: IQuestionVersionOption[];
  arrayHelpers: FieldArrayRenderProps;
}> = props => {
  const { options, arrayHelpers } = props;

  const { setFieldValue } = useFormikContext();

  function onDragEnd(result) {
    if (!result.destination) {
      return;
    }
    if (result.destination.index === result.source.index) {
      return;
    }

    setFieldValue(
      'options',
      reorder(options, result.source.index, result.destination.index),
    );
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <StrictModeDroppable droppableId="DragDropContext_list">
        {provided => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            <OptionList items={options} arrayHelpers={arrayHelpers} />
            {provided.placeholder}
          </div>
        )}
      </StrictModeDroppable>
    </DragDropContext>
  );
};

export default DragAnswerList;
