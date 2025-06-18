import { FC, useCallback, useMemo } from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';
import { BaseQuestionVersionDto, IQuestionVersionOption } from 'type';
import { useMatch } from 'react-router-dom';
import { ROUTE_PATH } from 'enums';
import { ColumnsType } from 'antd/lib/table/interface';
import { INPUT_TYPES } from '@input/type';
import { TrashOutlined } from 'icons';
import SimpleBar from 'simplebar-react';
import { DragTable } from '@components/DragTable/DragTable';
import { Button } from 'antd';
import { filterColumn, formatBytes, IRenderColumnCondition } from 'utils';
import templateVariable from 'app/template-variables.module.scss';
import { generateRandom } from 'modules/common/funcs';
import { DragHandle } from '@/customize-components';
import { ControlledInput } from '@/modules/common';

const Photo = () => {
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
        title: t('common.answer'),
        dataIndex: 'question',
        render: (value, record, index) => {
          return (
            <DisplayPhotoAnswer
              className={className}
              index={index}
              handleDeleteRow={handleDeleteRow}
              record={record}
              isViewMode={!!isViewMode}
            />
          );
        },
      },
    ],
    [className, handleDeleteRow, isViewMode, t],
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
    <>
      <SimpleBar>
        <PhotoWrapper>
          <DragTable
            columns={columnsFiltered}
            dataSource={dataSource}
            setDataTable={setDataTable}
            pagination={false}
          />
        </PhotoWrapper>
      </SimpleBar>
      {!isViewMode && <GroupSurveyButton />}
    </>
  );
};

export default Photo;

const PhotoWrapper = styled.div`
  .drag-icon-wrapper {
    display: inline-flex;
    gap: 1.5rem;
    align-items: center;
    margin-left: 1rem;
    .title {
      font-size: 12px;
      font-weight: 600;
    }
  }
  .ant-form-item-control {
    > div {
      &:last-child {
        display: none !important;
      }
    }
  }
  .trash-icon {
    color: ${templateVariable.primary_color};
    cursor: pointer;
    :hover {
      color: ${templateVariable.primary_color_hover};
    }
  }
`;

const initNewRowValue = {
  id: '',
  text: '',
  imageUrl: '',
};

const GroupSurveyButton = () => {
  const { setValues } = useFormikContext<BaseQuestionVersionDto>();
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
      {t('common.addOneMoreQuestion')}
    </Button>
  );
};

const getFileNameFormURL = fileName => {
  if (!fileName) return undefined;
  const redundant = fileName.match(/^https:\/\/.+\/.+\//g);
  return fileName.substring(redundant?.[0].length);
};

const DisplayPhotoAnswer: FC<{
  index: number;
  className?: string;
  handleDeleteRow: (record: IQuestionVersionOption) => void;
  record: IQuestionVersionOption & {
    imageURL?: { name: string; size?: number };
  };
  isViewMode?: boolean;
}> = props => {
  const { index, className, handleDeleteRow, record, isViewMode } = props;
  const imageSize = (record?.imageUrl as any)?.size || 0;
  const imageName =
    (record?.imageUrl as any)?.name || getFileNameFormURL(record?.imageUrl);

  return (
    <DisplayPhotoAnswerWrapper>
      <div className={'DisplayPhotoAnswerWrapper__image'}>
        <ControlledInput
          inputType={INPUT_TYPES.IMAGE_UPLOAD}
          name={`options[${index}].imageUrl`}
          className={className}
          subPath={'question'}
        />
      </div>
      <div className={'DisplayPhotoAnswerWrapper__info'}>
        <div className={'DisplayPhotoAnswerWrapper__info__top'}>
          {!!imageName && <span className={'img-name'}>{imageName}</span>}
          {!!imageSize && (
            <span className={'img-size'}>{formatBytes(imageSize)}</span>
          )}
          {!isViewMode && (
            <Button
              onClick={() => handleDeleteRow(record)}
              aria-label={'trash-icon'}
              type={'text'}
            >
              <TrashOutlined className={'trash-icon'} />
            </Button>
          )}
        </div>
        <div className={'DisplayPhotoAnswerWrapper__info__bottom'}>
          <ControlledInput
            inputType={INPUT_TYPES.INPUT}
            name={`options[${index}].text`}
            className={className}
          />
        </div>
      </div>
    </DisplayPhotoAnswerWrapper>
  );
};

const DisplayPhotoAnswerWrapper = styled.div`
  display: flex;
  gap: 1.5rem;

  .DisplayPhotoAnswerWrapper {
    &__image {
      .ant-upload.ant-upload-select-picture-card {
        height: 100px;
        width: 150px;
      }
    }
    &__info {
      flex: 1;
      display: flex;
      flex-direction: column;
      &__top {
        position: relative;
        display: flex;
        flex-direction: column;
        margin-bottom: 1rem;
        min-height: 1.5rem;
        .img-name {
          font-size: 12px;
          white-space: nowrap;
          width: calc(100% - 40px);
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .img-size {
          font-size: 10px;
          font-weight: 600;
        }
        .trash-icon {
          position: absolute;
          top: 6px;
          right: 6px;
        }
      }
      &__bottom {
      }
    }
  }
`;
