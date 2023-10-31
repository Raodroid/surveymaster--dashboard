// import { useTranslation } from 'react-i18next';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
// import { useField, useFormikContext } from 'formik';
// import { Badge, Button, Menu, Table, Upload } from 'antd';
// import moment from 'moment';
//
// import GroupSurveyButton, {
//   initNewRowValue,
// } from '../GroupSurveyButton/GroupSurveyButton';
// import {
//   IAddSurveyFormValues,
//   questionValueType,
//   rootSurveyFlowElementFieldName,
// } from '@pages/Survey/SurveyForm/type';
// import {
//   filterColumn,
//   IRenderColumnCondition,
//   useDebounce,
//   usePrevious,
// } from '@/utils';
// import { IOptionItem, IQuestionVersion } from '@/type';
// import { MOMENT_FORMAT, size } from '@/enums';
// import { generateRandom } from '@/modules/common/funcs';
// import { ColumnsType } from 'antd/es/table';
// import { ControlledInput } from '@/modules/common';
// import { INPUT_TYPES } from '@input/type';
// import UncontrollInput from '@input/uncontrolled-input/UncontrollInput';
// import { DragTable } from '@/modules/dashboard/components/DragTable/DragTable';
// import { DragHandle, ThreeDotsDropdown } from '@/customize-components';
// import { MenuDropDownWrapper } from '@/customize-components/styles';
// import { Refresh, SuffixIcon, TrashOutlined } from '@/icons';
// import { DisplayAnswerWrapper } from './style';
// import { determineVersionOfSurveyQuestion } from '../EditSurveyQuestionList/UploadExternalFile';
// import { useSurveyFormContext } from '@pages/Survey/components/SurveyFormContext/SurveyFormContext';
// import { useCheckSurveyFormMode } from '@pages/Survey/SurveyForm/util';
// import DynamicSelect from '../DynamicSelect/DynamicSelec';
//
// interface IExpandableTable extends questionValueType {
//   createdAt: string | Date | null;
// }
//
// const DisplayAnswer = (props: {
//   isExternalProject: boolean;
//   questionBlockIndex: number;
//   onChangeUploadFile: (input: unknown) => void;
// }) => {
//   const { onChangeUploadFile, isExternalProject, questionBlockIndex } = props;
//   const [searchTxt, setSearchTxt] = useState<string>('');
//   const debounceSearchText = useDebounce(searchTxt);
//
//   const { t } = useTranslation();
//   const fieldName = `${rootSurveyFlowElementFieldName}[${questionBlockIndex}].surveyQuestions`;
//   const [{ value }, , { setValue }] = useField<questionValueType[]>(fieldName);
//
//   const { question, form } = useSurveyFormContext();
//   const { setSearchParams, questionOptions } = question;
//   const { questionIdMap } = form;
//
//   const availableQuestionOptions = useMemo<IOptionItem[]>(() => {
//     return questionOptions.reduce((res: IOptionItem[], item) => {
//       if (value.some(i => i.questionVersionId === item.value)) return res;
//       return [...res, item];
//     }, []);
//   }, [questionOptions, value]);
//
//   const { setValues, setFieldValue } = useFormikContext<IAddSurveyFormValues>();
//
//   const { isCreateMode } = useCheckSurveyFormMode();
//
//   useEffect(() => {
//     setSearchParams({ q: debounceSearchText });
//   }, [debounceSearchText, setSearchParams]);
//
//   const handleAddRow = useCallback(() => {
//     setValue([
//       ...value,
//       { ...initNewRowValue, id: generateRandom().toString() },
//     ]);
//   }, [setValue, value]);
//
//   const rowExpandable = (record: questionValueType) => {
//     const [newVersions] = determineVersionOfSurveyQuestion(record);
//
//     if (!newVersions) return false;
//     return newVersions.length !== 1;
//   };
//   const columns: ColumnsType<questionValueType> = useMemo(
//     () => [
//       {
//         title: t('common.order'),
//         dataIndex: 'order',
//         width: 100,
//         shouldCellUpdate: (record, prevRecord) => false,
//         render: (value, record, index) => {
//           return (
//             <span
//               style={{
//                 display: 'inline-flex',
//                 gap: '1.5rem',
//                 alignItems: 'center',
//               }}
//             >
//               <DragHandle />
//               <span>{index}</span>
//             </span>
//           );
//         },
//       },
//       {
//         title: t('common.parameter'),
//         dataIndex: 'parameter',
//         shouldCellUpdate: (record, prevRecord) => false,
//         width: 200,
//         render: (value, record, index) => {
//           return (
//             <>
//               <ControlledInput
//                 style={{ width: '100%' }}
//                 inputType={INPUT_TYPES.INPUT}
//                 name={`version.questions[${index}].parameter`}
//               />
//             </>
//           );
//         },
//       },
//       {
//         title: t('common.category'),
//         dataIndex: 'category',
//         width: 100,
//       },
//       {
//         title: t('common.type'),
//         dataIndex: 'type',
//         width: 150,
//         render: value => {
//           return value ? t(`questionType.${value}`) : '';
//         },
//       },
//       {
//         title: t('common.question'),
//         dataIndex: 'question',
//         width: 300,
//         shouldCellUpdate: (record, prevRecord) => false,
//         render: (value, record, index) => {
//           return (
//             <DynamicSelect
//               setSearchTxt={setSearchTxt}
//               fieldName={fieldName}
//               availableQuestionOptions={availableQuestionOptions}
//             />
//           );
//         },
//       },
//       {
//         title: t('common.remark'),
//         dataIndex: 'remark',
//         shouldCellUpdate: (record, prevRecord) => false,
//         render: (value, record, index) => (
//           <ControlledInput
//             style={{ width: '100%' }}
//             inputType={INPUT_TYPES.INPUT}
//             name={`version.questions[${index}].remark`}
//           />
//         ),
//       },
//       {
//         title: '',
//         dataIndex: 'action',
//         shouldCellUpdate: (record, prevRecord) => false,
//         width: 60,
//         render: (value, record, qIndex) => (
//           <ActionDropDown
//             record={record}
//             rowExpandable={rowExpandable}
//             questionBlockIndex={questionBlockIndex}
//             isExternalProject={isExternalProject}
//             fieldName={`${fieldName}[${qIndex}]`}
//             rowIndex={qIndex}
//           />
//         ),
//       },
//     ],
//     [
//       availableQuestionOptions,
//       fieldName,
//       isExternalProject,
//       questionBlockIndex,
//       t,
//     ],
//   );
//
//   const renderColumnCondition: IRenderColumnCondition = useMemo(
//     () => [
//       {
//         condition: !isExternalProject,
//         indexArray: ['parameter'],
//       },
//     ],
//     [isExternalProject],
//   );
//
//   const columnsFiltered = useMemo(
//     () => filterColumn<questionValueType>(renderColumnCondition, columns),
//     [columns, renderColumnCondition],
//   );
//
//   const expandTableColumn: ColumnsType<IExpandableTable> = useMemo(() => {
//     const renderBlankKeys = ['action', 'remark', 'parameter'];
//
//     return columnsFiltered.map(col => {
//       const dataIndex = col?.['dataIndex'];
//       if (dataIndex === 'order') {
//         return {
//           ...col,
//           width: 60,
//           render: () => null,
//         };
//       }
//       if (dataIndex === 'question') {
//         return {
//           ...col,
//           dataIndex: 'questionTitle',
//           render: (value, record) => (
//             <div className={'question-cell'}>
//               <Badge status={'warning'} />{' '}
//               <span style={{ fontSize: 12, fontWeight: 600 }}>
//                 {moment(record.createdAt).format(
//                   MOMENT_FORMAT.FULL_DATE_FORMAT,
//                 )}
//               </span>
//               <UncontrollInput
//                 inputType={INPUT_TYPES.INPUT}
//                 value={value}
//                 disabled
//               />
//             </div>
//           ),
//         };
//       }
//       if (typeof dataIndex === 'string') {
//         if (renderBlankKeys.some(k => k === dataIndex)) {
//           return {
//             ...col,
//             render: () => '',
//           };
//         }
//       } else if (
//         col?.['dataIndex'].some(key => renderBlankKeys.some(k => k === key))
//       ) {
//         return {
//           ...col,
//           render: () => '',
//         };
//       }
//       return col;
//     }) as ColumnsType<IExpandableTable>;
//   }, [columnsFiltered]);
//
//   const expandedRowRender = (record: questionValueType) => {
//     const [newVersions] = determineVersionOfSurveyQuestion(record);
//
//     const dataSource = (newVersions || []).reduce(
//       (res: IExpandableTable[], v: IQuestionVersion) => {
//         if (v.id === record.questionVersionId) return res;
//         return [
//           ...res,
//           {
//             createdAt: v.createdAt,
//             questionVersionId: v.id as string,
//             parameter: record.parameter,
//             type: record.type,
//             category: record.category,
//             questionTitle: v.title,
//           },
//         ];
//       },
//       [],
//     );
//
//     return dataSource.length > 0 ? (
//       <Table
//         dataSource={dataSource}
//         columns={expandTableColumn}
//         showHeader={false}
//         pagination={false}
//         rowClassName={() => 'padding-top'}
//       />
//     ) : (
//       <div className="empty-expanded" />
//     );
//   };
//
//   const dataSource = useMemo(() => value as IExpandableTable[], [value]);
//
//   const [checked, setChecked] = useState<React.Key[]>([]);
//
//   const preVersionQuestion = usePrevious(value);
//
//   useEffect(() => {
//     if (isCreateMode) return;
//     if (!preVersionQuestion) {
//       setChecked(value.map(i => i.questionVersionId));
//     }
//   }, [isCreateMode, preVersionQuestion, value]);
//
//   const onSelectChange = (
//     newSelectedRowKeys: React.Key[],
//     selectedRows: questionValueType[],
//   ) => {
//     const nextValue = selectedRows.map(x => x.questionVersionId);
//     setChecked(nextValue);
//
//     setFieldValue('selectedRowKeys', nextValue);
//   };
//
//   const rowSelection = {
//     selectedRowKeys: checked.map(questionVersionId =>
//       dataSource.findIndex(i => i.questionVersionId === questionVersionId),
//     ),
//     onChange: onSelectChange,
//     getCheckboxProps: (record: questionValueType) => ({
//       disabled: !record.questionVersionId, // Column configuration not to be checked
//     }),
//   };
//
//   const setDataTable = (questions: questionValueType[]) => {
//     setValues(s => ({
//       ...s,
//       version: {
//         ...s.version,
//         questions,
//       },
//     }));
//   };
//
//   const renderRowClassName = useCallback(
//     record => {
//       if (!record) return '';
//       const isNewQuestion = !Object.keys(questionIdMap).some(
//         questionVersionId =>
//           !!questionIdMap?.[record.questionVersionId] ||
//           questionIdMap?.[questionVersionId].versions.some(
//             ver => ver?.id === record.questionVersionId,
//           ), // check if the value was existed in survey
//       );
//
//       return !isNewQuestion ? 'padding-top' : '';
//     },
//     [questionIdMap],
//   );
//
//   if (!isExternalProject) {
//     return (
//       <DisplayAnswerWrapper>
//         <DragTable
//           scroll={{ x: size.large }}
//           columns={columnsFiltered}
//           dataSource={dataSource}
//           setDataTable={setDataTable}
//           pagination={false}
//           expandable={{
//             expandedRowRender,
//             rowExpandable,
//             expandRowByClick: false,
//             expandIconColumnIndex: -1,
//             defaultExpandAllRows: true,
//           }}
//           renderRowClassName={renderRowClassName}
//         />
//
//         <GroupSurveyButton fieldNameRoot={fieldName} />
//       </DisplayAnswerWrapper>
//     );
//   }
//
//   return (
//     <DisplayAnswerWrapper>
//       <DragTable
//         scroll={{ x: size.large }}
//         rowSelection={rowSelection}
//         columns={columnsFiltered}
//         dataSource={dataSource}
//         pagination={false}
//         renderRowClassName={renderRowClassName}
//         expandable={{
//           expandedRowRender,
//           rowExpandable,
//           expandRowByClick: false,
//           expandIconColumnIndex: -1,
//           defaultExpandAllRows: true,
//         }}
//         setDataTable={setDataTable}
//       />
//       <div className={'DisplayAnswerWrapper__footer'}>
//         <Upload
//           onChange={onChangeUploadFile}
//           accept={'.csv,.xlsx'}
//           multiple={false}
//         >
//           <Button type={'primary'} disabled>
//             {t('common.clickToUpload')}
//           </Button>
//         </Upload>
//         <Button type={'primary'} onClick={handleAddRow}>
//           {t('common.addRow')}
//         </Button>
//       </div>
//     </DisplayAnswerWrapper>
//   );
// };
//
// export default DisplayAnswer;
//
// enum ACTION_ENUM {
//   DELETE = 'DELETE',
//   CHANGE = 'CHANGE',
//   DECLINE = 'DECLINE',
// }
//
// const ActionDropDown: FC<{
//   record: questionValueType;
//   questionBlockIndex: number;
//   rowExpandable;
//   isExternalProject: boolean;
//   fieldName: string;
//   rowIndex: number;
// }> = props => {
//   const { t } = useTranslation();
//   const {
//     record,
//     rowExpandable,
//     questionBlockIndex,
//     isExternalProject,
//     fieldName,
//     rowIndex,
//   } = props;
//   const hasNewVersion = rowExpandable(record);
//   const { form } = useSurveyFormContext();
//   const { questionIdMap } = form;
//   const [{ value: questionValue }] = useField<questionValueType>(fieldName);
//
//   const [{ value: surveyQuestions }, , { setValue: setSurveyQuestions }] =
//     useField<questionValueType[]>(
//       `${rootSurveyFlowElementFieldName}[${questionBlockIndex}].surveyQuestions`,
//     );
//
//   const isDirty = useMemo(
//     () =>
//       Object.keys(questionIdMap).some(
//         questionVersionId =>
//           !questionIdMap?.[questionValue.questionVersionId] &&
//           questionIdMap?.[questionVersionId].versions.some(
//             ver => ver?.id === questionValue.questionVersionId,
//           ), // check if the value was existed in survey
//       ),
//     [questionIdMap, questionValue.questionVersionId],
//   );
//   //hannah
//   const handleDecline = useCallback(() => {
//     setSurveyQuestions(
//       !questionIdMap
//         ? surveyQuestions
//         : surveyQuestions.map(q => {
//             if (
//               q.questionVersionId !== //only care about the current value
//               questionValue.questionVersionId
//             )
//               return q;
//
//             if (questionIdMap[q.questionVersionId])
//               //if true => nothing change here
//               return q;
//
//             const key = Object.keys(questionIdMap).find(questionVersionId => {
//               return questionIdMap[questionVersionId].versions.some(
//                 v => record.questionVersionId === v.id,
//               );
//             });
//
//             if (key) {
//               return {
//                 ...q,
//                 questionVersionId: key as string,
//                 questionTitle: questionIdMap[key].questionTitle,
//               };
//             }
//             return q;
//           }),
//     );
//   }, []);
//
//   const handleChange = useCallback(
//     (record, index) => {
//       const [newVersions] = determineVersionOfSurveyQuestion(record);
//       if (!newVersions) return;
//
//       setSurveyQuestions(
//         surveyQuestions.map((q, idx) => {
//           if (idx !== index) return q;
//           return {
//             ...q,
//             questionVersionId: newVersions[0].id as string,
//             questionTitle: newVersions[0].title as string,
//           };
//         }),
//       );
//     },
//     [setSurveyQuestions, surveyQuestions],
//   );
//
//   const handleDelete = useCallback(
//     index => {
//       setSurveyQuestions(surveyQuestions.filter((i, idx) => idx !== index));
//     },
//     [setSurveyQuestions, surveyQuestions],
//   );
//
//   const count = useMemo<number>(() => {
//     let result = 0;
//     if (hasNewVersion) {
//       result += 1;
//     }
//     if (isDirty) {
//       result += 1;
//     }
//     if (!isExternalProject) {
//       result += 1;
//     }
//     return result;
//   }, [hasNewVersion, isDirty, isExternalProject]);
//
//   return (
//     <div
//       onClick={e => {
//         e.stopPropagation();
//       }}
//     >
//       {!!count && (
//         <ThreeDotsDropdown
//           overlay={
//             <MenuDropDownWrapper>
//               {!isExternalProject && (
//                 <Menu.Item
//                   key={ACTION_ENUM.DELETE}
//                   onClick={() => handleDelete(rowIndex)}
//                 >
//                   <TrashOutlined /> {t('common.delete')}
//                 </Menu.Item>
//               )}
//               {hasNewVersion && (
//                 <Menu.Item
//                   key={ACTION_ENUM.CHANGE}
//                   onClick={() => handleChange(record, rowIndex)}
//                 >
//                   <SuffixIcon /> {t('common.change')}
//                 </Menu.Item>
//               )}
//               {isDirty && (
//                 <Menu.Item key={ACTION_ENUM.DECLINE} onClick={handleDecline}>
//                   <Refresh /> {t('common.declineChange')}
//                 </Menu.Item>
//               )}
//             </MenuDropDownWrapper>
//           }
//           trigger={['click']}
//         />
//       )}
//     </div>
//   );
// };
