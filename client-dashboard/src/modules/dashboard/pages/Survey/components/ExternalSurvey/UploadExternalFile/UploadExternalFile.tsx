import { useCallback, useState } from 'react';
import { Button, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import { UploadExternalFileWrapper } from './style';
import * as XLSX from 'xlsx';
import Dragger from 'antd/lib/upload/Dragger';
import { useField } from 'formik';
import { IQuestion, IQuestionVersion, QuestionVersionStatus } from '@/type';
import { QuestionBankService } from '@/services';
import moment from 'moment';
import { initNewRowValue } from '@pages/Survey/components/GroupSurveyButton/GroupSurveyButton';
import {
  questionValueType,
  rootSurveyFlowElementFieldName,
} from '@pages/Survey/SurveyForm/type';
import { useSurveyFormContext } from '@pages/Survey';

const storeResultX = {};

export const determineVersionOfSurveyQuestion = (
  record: questionValueType,
): IQuestionVersion[][] | undefined[] => {
  const versions = record.versions;
  if (!versions) return [undefined, undefined];

  if (storeResultX[record.questionVersionId]) {
    return storeResultX[record.questionVersionId];
  }

  const newVersions: IQuestionVersion[] = [];
  const historyVersions: IQuestionVersion[] = [];

  let chosenValueIdx: undefined | number = undefined;

  versions
    .filter(q => q.status === QuestionVersionStatus.COMPLETED)
    .sort((a, b) => (moment(a.createdAt).isBefore(a.createdAt) ? 1 : 0))
    ?.forEach((ver, idx) => {
      const isCurrentValue = ver.id === record.questionVersionId;

      if (ver.deletedAt && !isCurrentValue) {
        return;
      }

      if (chosenValueIdx !== undefined && idx > chosenValueIdx) {
        historyVersions.push(ver);
        return;
      }

      if (isCurrentValue) {
        chosenValueIdx = idx;
      }
      newVersions.push(ver);
    }, []);

  const result = [newVersions, historyVersions];

  storeResultX[record.questionVersionId] = result;

  return result;
};

const createBinaryFile = (excelFile, callback) => {
  const reader = new FileReader();
  reader.onload = () => {
    callback(excelFile);
  };
  reader.readAsBinaryString(excelFile);
};

const UploadExternalFile = () => {
  const { t } = useTranslation();
  const { project } = useSurveyFormContext();
  const { setExcelUploadFile } = project;

  const [{ value }, , { setValue }] = useField<questionValueType[]>(
    `${rootSurveyFlowElementFieldName}[0].surveyQuestions`,
  );

  const handleFiles = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = async () => {
        const fileData = reader.result;

        const wb = await XLSX.read(fileData, { type: 'file' });
        const rowObj = wb.Sheets[wb.SheetNames[0]];

        const columnHeaders: string[] = [];
        for (const key in rowObj) {
          //condition to stop at second row which is not the column name title
          if (key === 'A2') {
            break;
          }
          if (rowObj[key].v) columnHeaders.push(rowObj[key].v as never);
        }

        const valueQuestionMap = (value || []).reduce(
          (res: Record<string, boolean>, q) => {
            if (!q.parameter) return res;
            res[q.parameter] = true;
            return res;
          },
          {},
        );

        const getQuestionByParametersList =
          await QuestionBankService.getQuestions({
            selectAll: true,
            hasLatestCompletedVersion: true,
            isDeleted: false,
            body: {
              masterVariableNames: columnHeaders,
            },
          });

        const questionList: IQuestion[] =
          getQuestionByParametersList.data.data || [];

        const uniqParameter: questionValueType[] = columnHeaders.reduce(
          (res: questionValueType[], x) => {
            if (valueQuestionMap[x]) {
              return res;
            }

            const questionHasVariableNameSameParameter = questionList.find(
              q => q.masterVariableName === x,
            );
            //hannah
            if (questionHasVariableNameSameParameter) {
              const newValue: questionValueType = {
                ...initNewRowValue,
                category: questionHasVariableNameSameParameter.masterCategory
                  ?.name as string,
                type: questionHasVariableNameSameParameter
                  .latestCompletedVersion.type,
                // question:
                //   questionHasVariableNameSameParameter.latestCompletedVersion
                //     .question,
                questionVersionId: questionHasVariableNameSameParameter
                  .latestCompletedVersion.id as string,
                questionTitle:
                  questionHasVariableNameSameParameter.latestCompletedVersion
                    .title,
                id: x,
                parameter: x,
              };
              return [...res, newValue];
            }
            return [
              ...res,
              {
                ...initNewRowValue,
                id: x,
                parameter: x,
              },
            ];
          },
          [],
        );

        setValue([...(value || []), ...uniqParameter]);
      };
    },
    [setValue, value],
  );

  const [isUploading, setUploading] = useState(false);

  const onChange = useCallback(
    info => {
      const { status } = info.file;
      if (status === 'uploading') {
        setUploading(true);
      }
      if (status !== 'uploading') {
        setTimeout(() => {
          createBinaryFile(info.file.originFileObj, res => {
            setExcelUploadFile(res);
          });
          handleFiles(info.file.originFileObj);
          setUploading(false);
        });
      }
    },
    [handleFiles, setExcelUploadFile],
  );

  const onDrop = useCallback(
    e => {
      handleFiles(e.dataTransfer.files[0]);
    },
    [handleFiles],
  );

  return (
    <UploadExternalFileWrapper>
      <Spin spinning={isUploading}>
        <Dragger
          name={'file'}
          onChange={onChange}
          onDrop={onDrop}
          multiple={false}
          accept={'.csv,.xlsx'}
        >
          <p className="ant-upload-text">{t('common.dragYourCSV')}</p>
          <p className="ant-upload-hint">OR</p>
          <Button className={'info-btn'} type={'primary'}>
            {t('common.browseLocalFile')}
          </Button>
        </Dragger>
      </Spin>
    </UploadExternalFileWrapper>
  );
};

export default UploadExternalFile;
