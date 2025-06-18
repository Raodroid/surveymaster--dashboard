import { useCallback, useState } from 'react';
import { Button, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import { UploadExternalFileWrapper } from './style';
import * as XLSX from 'xlsx';
import Dragger from 'antd/lib/upload/Dragger';
import { useField } from 'formik';
import { IQuestion } from '@/type';
import { QuestionBankService } from '@/services';
import { initNewRowValue } from '@pages/Survey/components/GroupSurveyButton/GroupSurveyButton';
import {
  questionValueType,
  rootSurveyFlowElementFieldName,
} from '@pages/Survey/SurveyForm/type';

const UploadExternalFile = () => {
  const { t } = useTranslation();

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
          (res: questionValueType[], parameter) => {
            if (valueQuestionMap[parameter]) {
              return res;
            }

            const questionHasVariableNameSameParameter = questionList.find(
              q => q.masterVariableName === parameter,
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
                id: undefined,
                parameter,
              };
              return [...res, newValue];
            }

            return [
              ...res,
              {
                ...initNewRowValue,
                id: undefined,
                parameter: parameter,
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
          // createBinaryFile(info.file.originFileObj, res => {
          //   setExcelUploadFile(res);
          // });
          handleFiles(info.file.originFileObj);
          setUploading(false);
        });
      }
    },
    [handleFiles],
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
