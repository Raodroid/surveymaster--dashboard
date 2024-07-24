import { FC, memo, useState, useMemo } from 'react';
import { QuestionBlockProps } from '../type';
import { onError, useDebounce } from '@/utils';
import { INPUT_TYPES } from 'modules/common/input/type';
import { useField } from 'formik';
import { useQuery } from 'react-query';
import { SurveyService } from '@/services';
import { useCheckSurveyFormMode } from '@pages/Survey/SurveyForm/util';
import { ControlledInput } from '@/modules/common';
import { Input, Empty } from 'antd';

const { TextArea } =Input;


const EndSurvey: FC<QuestionBlockProps> = (props) => {
  const { fieldName } = props;

  const { isViewMode } = useCheckSurveyFormMode();
  const [{ value }] = useField(fieldName);

  const [searchTxt, setSearchTxt] = useState<string>('');
  const searchDebounce = useDebounce(searchTxt);

  const {
    data: messageData,
    isLoading,
  } = useQuery(
    ['getEndMessages', searchDebounce],
    () => {
      return SurveyService.getEndMessages({ q: searchDebounce })
    },
    { refetchOnWindowFocus: false, onError },
  );

  const options = useMemo(() => {
    const endMessages = messageData?.data?.data || [];
    return endMessages?.map((item) => ({ label: item.name, value: item.id }))
  }, [messageData])

  const messageContent = useMemo(() => {
    const endMessages = messageData?.data?.data || [];
    const focusMessage = endMessages?.find((item) => item.id === value?.endMessageId);
    return focusMessage?.content || '';
  }, [messageData, value])

  if (!value) return <Empty />;

  return (
    <>
      <ControlledInput
        showSearch
        filterOption={false}
        disabled={isViewMode}
        value={value.endMessageId || ''}
        inputType={INPUT_TYPES.SELECT}
        name={`${fieldName}.endMessageId`}
        label={'Message'}
        options={options}
        onSearch={(value) => setSearchTxt(value)}
        loading={isLoading}
      />

      <div className='flex flex-row'>
        <span className='text-[12px] font-semibold text-[#25216b] mr-[12px]'>Content:</span>
        <TextArea value={messageContent} rows={5} disabled/>
      </div>
    </>
  );
};

export default memo(EndSurvey);
