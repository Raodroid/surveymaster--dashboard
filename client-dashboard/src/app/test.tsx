import React, { useCallback, useEffect, useState } from 'react';
import { Button, DatePicker, Form, Input, Select, Checkbox } from 'antd';
import notification from 'customize-components/CustomNotification';
import styled from 'styled-components/macro';
import { ClockCircleOutlined } from '@ant-design/icons/';

const { TextArea } = Input;
const { Option } = Select;

const Test = () => {
  // useEffect(() => {
  //   openNotification();
  // }, []);

  // const openNotification = () => {
  //   notification.error({
  //     message: 'Notification Message Text Here',
  //     duration: 100000,
  {
    /*  });*/
  }
  {
    /*  notification.warning({*/
  }
  {
    /*    message: 'Notification Message Text Here',*/
  }
  //     duration: 100000,
  //   });
  //   notification.info({
  //     message: 'Notification Message Text Here',
  //     duration: 100000,
  //   });
  //   notification.success({
  //     message:
  //       'Notification Message Text Here Supppppp ppppper Long Optionnnnnnnnnnnn Notific ation ',
  //     duration: 100000,
  //   });
  {
    /*  notification.success({*/
  }
  //     message: (
  //       <div>
  //         <p style={{ marginBottom: 12 }}>Notification Message Text Here</p>
  //         <Button style={{ height: 33, lineHeight: 0 }}>Button Text</Button>
  //       </div>
  //     ),
  //     duration: 100000,
  //   });
  // };

  return (
    <TestWrapper
      style={{ backgroundColor: '#fff', height: '100vh', padding: '2rem' }}
    >
      <Checkbox>Checkbox</Checkbox>
      <div>
        <Button type={'default'} size={'large'}>
          default large
        </Button>
        <hr />
        <Button type={'default'} size={'small'}>
          default small
        </Button>
        <hr />
        <Button type={'default'} className={''}>
          default
        </Button>
        <hr />
        <Button type={'default'} className={'dark-btn'}>
          default dark-btn
        </Button>
        <hr />
        <Button type={'default'} className={'info-btn'}>
          default info-btn
        </Button>
        <hr />
        <Button type={'default'} className={'secondary-btn'}>
          default secondary-btn
        </Button>
        <hr />
        <Button type={'default'} danger>
          default danger
        </Button>
      </div>
      <div>
        <Button type={'primary'} size={'large'}>
          primary large
        </Button>
        <hr />
        <Button type={'primary'} size={'small'}>
          primary small
        </Button>
        <hr />
        <Button type={'primary'} className={''}>
          primary
        </Button>
        <hr />
        <Button type={'primary'} className={'dark-btn'}>
          primary dark-btn
        </Button>
        <hr />
        <Button type={'primary'} className={'secondary-btn'}>
          primary secondary-btn
        </Button>
        <hr />
        <hr />
        <Button type={'primary'} className={'info-btn'}>
          primary info-btn
        </Button>
        <hr />
        <Button type={'primary'} danger>
          primary danger
        </Button>
      </div>
      <div>
        <Button type={'text'} size={'large'}>
          text large
        </Button>
        <hr />
        <Button type={'text'} size={'small'}>
          text small
        </Button>
        <hr />
        <Button type={'text'} className={''}>
          text
        </Button>
        <hr />
        <Button type={'text'} className={'dark-btn'}>
          text dark-btn
        </Button>
        <hr />
        <Button type={'text'} className={'info-btn'}>
          text info-btn
        </Button>
        <hr />
        <Button type={'text'} className={'secondary-btn'}>
          text secondary-btn
        </Button>
        <hr />
        <Button type={'text'} danger>
          text danger
        </Button>
      </div>
      <div>
        <Button type="dashed" size={'large'}>
          text large
        </Button>
        <hr />
        <Button type="dashed" size={'small'}>
          text small
        </Button>
        <hr />
        <Button type="dashed" className={''}>
          text
        </Button>
        <hr />
        <Button type="dashed" className={'dark-btn'}>
          text dark-btn
        </Button>
        <hr />
        <Button type="dashed" className={'info-btn'}>
          text info-btn
        </Button>
        <hr />
        <Button type="dashed" className={'secondary-btn'}>
          text secondary-btn
        </Button>
        <hr />
        <Button type="dashed" danger>
          text danger
        </Button>
      </div>

      <div>
        <Form.Item name={'a'} validateStatus={'error'} label={'Label'}>
          <DatePicker placeholder={'error'} />
        </Form.Item>

        <Form.Item validateStatus={'warning'} label={'Label'}>
          <DatePicker placeholder={'warning'} />
        </Form.Item>
        <Form.Item validateStatus={'success'} label={'Label'}>
          <DatePicker placeholder={'success'} />
        </Form.Item>
        <Form.Item label={'Label'}>
          <DatePicker placeholder={'normal'} />
        </Form.Item>
      </div>

      <div>
        <Form.Item validateStatus={'error'} label={'Label'}>
          <TextArea placeholder={'error'} />
        </Form.Item>

        <Form.Item validateStatus={'warning'} label={'Label'}>
          <TextArea placeholder={'warning'} />
        </Form.Item>
        <Form.Item validateStatus={'success'} label={'Label'}>
          <TextArea placeholder={'success'} />
        </Form.Item>
        <Form.Item label={'Label'}>
          <TextArea placeholder={'normal'} />
        </Form.Item>
      </div>

      <div>
        <Form.Item validateStatus={'error'} label={'Label'}>
          <Input placeholder={'error'} prefix={<ClockCircleOutlined />} />
        </Form.Item>

        <Form.Item validateStatus={'warning'} label={'Label'}>
          <Input placeholder={'warning'} suffix={<ClockCircleOutlined />} />
        </Form.Item>
        <Form.Item validateStatus={'success'} label={'Label'}>
          <Input placeholder={'success'} />
        </Form.Item>
        <Form.Item label={'Label'}>
          <Input placeholder={'normal'} />
        </Form.Item>
      </div>

      <div>
        <Form.Item validateStatus={'error'} label={'Label'}>
          <Select placeholder={'error'}>
            <Option value="jack">Jack</Option>
            <Option value="lucy">Lucy</Option>
          </Select>
        </Form.Item>

        <Form.Item validateStatus={'warning'} label={'Label'}>
          <Select placeholder={'warning'}>
            <Option value="jack">Jack</Option>
            <Option value="lucy">Lucy</Option>
          </Select>
        </Form.Item>
        <Form.Item validateStatus={'success'} label={'Label'}>
          <Select placeholder={'success'}>
            <Option value="jack">Jack</Option>
            <Option value="lucy">Lucy</Option>
          </Select>
        </Form.Item>
        <Form.Item label={'Label'}>
          <Select placeholder={'nomal'}>
            <Option value="jack">Jack</Option>
            <Option value="lucy">Lucy</Option>
          </Select>
        </Form.Item>
      </div>
    </TestWrapper>
  );
};

export default Test;

const TestWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
`;
