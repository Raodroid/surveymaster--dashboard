import React, { memo, useState, useEffect } from 'react';
import { Upload } from 'antd';
import notification from 'customize-components/CustomNotification';
import { RcFile, UploadChangeParam, UploadProps } from 'antd/lib/upload';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { OnchangeType } from '../../type';
import { useTranslation } from 'react-i18next';
import { UploadService } from 'services';

export type CustomUploadProps = UploadProps &
  OnchangeType & {
    value: string;
    moduleName?: string;
    subPath?: string;
  };

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

const CustomImageUpload = (props: CustomUploadProps) => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>(props.value);
  const { t } = useTranslation();

  const customRequest = async options => {
    let type = options.file.type;
    let nameImage = options.file.name;
    const moduleName = props.moduleName || 'users';
    const subPath = props.subPath || 'avatar';
    try {
      const res = await UploadService.getPreSignedUrlUpload(
        moduleName,
        nameImage,
        type,
        subPath,
      );
      const { data } = res;
      if (data) {
        await UploadService.putWithFormFileAsync(data.url, options.file, type);
        options.onSuccess({
          url: `${process.env.REACT_APP_S3_URL}/${data.filePath}`,
        });
      }
    } catch (error) {
      options.onError(error);
    }
  };

  const uploadButton = (
    <div>
      {isLoading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>{t('common.upload')}</div>
    </div>
  );

  const image = React.useMemo(() => {
    if (!props.value) return null;
    return imageUrl || props.value;
  }, [props.value, imageUrl]);

  // const image = imageUrl || props.value;
  // useEffect(() => {
  //   if (!props.value) {
  //     setImageUrl('');
  //   }
  // }, [props.value]);

  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng =
      file.type === 'image/jpeg' ||
      file.type === 'image/png' ||
      file.type === 'image/jpg';
    if (!isJpgOrPng) {
      notification.error({ message: t('validation.messages.uploadFileError') });
    }
    const isLt2M = file.size / 1024 / 1024 < 10;
    if (!isLt2M) {
      notification.error({
        message: t('validation.messages.uploadFileErrorSize'),
      });
    }
    return isJpgOrPng && isLt2M;
  };

  const handleChange = (info: UploadChangeParam) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, imgUrl => {
        setLoading(false);
        setImageUrl(imgUrl);
        console.log(imgUrl);
      });
    }

    if (props.onChange) {
      props.onChange(info.file ? info.file : null);
    }
  };

  const customProps: { onChange?: typeof handleChange } = {};
  if (props.onChange) customProps.onChange = handleChange;

  return (
    <>
      <Upload
        {...props}
        {...customProps}
        customRequest={customRequest}
        accept=".jpg,.png,.jpeg"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        beforeUpload={beforeUpload}
      >
        {image ? (
          <img
            src={image}
            alt="avatar"
            style={{ width: '100%', height: '100%' }}
          />
        ) : (
          uploadButton
        )}
      </Upload>
    </>
  );
};

export default memo(CustomImageUpload);
