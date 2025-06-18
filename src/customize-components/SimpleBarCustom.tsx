import SimpleBar from 'simplebar-react';

const SimpleBarCustom = props => {
  return (
    <SimpleBar className={'h-full overflow-scroll pr-1'}>
      <div className={'p-3'}>{props.children}</div>
    </SimpleBar>
  );
};

export default SimpleBarCustom;
