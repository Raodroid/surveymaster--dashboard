import { Spin } from 'antd';

const NewGenerationSpin = props => {
  return (
    // <div className={''}>
    <Spin spinning={true} style={{ maxHeight: 'unset' }}>
      {props.children}
    </Spin>
    // </div>
  );
};

export default NewGenerationSpin;
