import {notification} from 'antd';
import {ArgsProps} from 'antd/lib/notification';
import {CloseIcon, ErrorIcon, InfoIcon, SuccessIcon, WarningIcon,} from 'icons';

import {Icons} from './styles';

class CustomNotification {
  static instance: any;
  constructor() {
    if (CustomNotification.instance) {
      return CustomNotification.instance;
    }

    CustomNotification.instance = this;

    return this;
  }
  defaultAttribute = (args: ArgsProps) => ({
    ...args,
    closeIcon: <CloseIcon />,
    message: <div>{args.message}</div>,
  });

  success(args: ArgsProps) {
    return notification.success({
      ...this.defaultAttribute(args),
      icon: (
        <Icons className="bg-blue-success">
          <SuccessIcon />
        </Icons>
      ),
    });
  }

  error(args: ArgsProps) {
    return notification.error({
      ...this.defaultAttribute(args),
      icon: (
        <Icons>
          <ErrorIcon />
        </Icons>
      ),
    });
  }

  warning(args: ArgsProps) {
    return notification.warning({
      ...this.defaultAttribute(args),
      icon: (
        <Icons className="bg-orange-warning">
          <WarningIcon />
        </Icons>
      ),
    });
  }

  info(args: ArgsProps) {
    return notification.info({
      ...this.defaultAttribute(args),
      icon: (
        <Icons>
          <InfoIcon />
        </Icons>
      ),
    });
  }
}

export default new CustomNotification();
