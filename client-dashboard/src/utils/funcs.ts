import { Role, Scope } from 'redux/user';
import { useLocation } from 'react-router-dom';
import { getI18n } from 'react-i18next';
import notification from 'customize-components/CustomNotification';
import { useCallback, useEffect, useRef, useState } from 'react';
import useWindowSize from 'modules/common/hoc/useWindowSize';
import { mobileSize } from '../enums';

declare global {
  interface Navigator {
    msSaveBlob?: (blob: any, defaultName?: string) => boolean;
  }
}

interface IErr {
  error: any;
  i18nKey: string;
  contentObj?: Object;
}

export const errorNotification = (input: IErr) => {
  const i18n = getI18n();
  const { error, i18nKey, contentObj = {} } = input;
  const errCode = error?.response?.data?.statusCode;
  const isLimitNotification = [401, 403].includes(errCode);
  const errMessage =
    error?.response?.data?.message || error?.message || 'Unknown error message';
  notification.error({
    key: isLimitNotification
      ? errCode
      : `${error?.response?.data?.statusCode}-${i18nKey}`,
    message: i18n?.t(i18nKey, {
      ...contentObj,
      ERROR_MESSAGE: isLimitNotification
        ? `[${errCode}] ${errMessage}`
        : errMessage,
    }) as string,
  });
};

export const getAllScopes = (roleData: Role[]) => {
  const scopes: Record<string, boolean> = {};
  const scopesArr: Scope[] = [];
  roleData.forEach(role => {
    const roleScopes = role.scopes as Scope[];
    roleScopes.forEach(scope => {
      if (!scopes[scope.id]) {
        scopesArr.push(scope);
        scopes[scope.id] = true;
      }
    });
  });
  return scopesArr;
};

export const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

export const convertB64ToBuffer = (dataB64: any) => {
  const buffer = new Buffer(dataB64.split(',')[1], 'base64');
  return { buffer, type: 'image/png' };
};

export const saveBlob = (blob: Blob, filename: string) => {
  if (navigator.msSaveBlob) {
    // IE 10+
    navigator.msSaveBlob(blob, filename);
  } else {
    var link = document.createElement('a');
    if (link.download !== undefined) {
      // feature detection
      // Browsers that support HTML5 download attribute
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
};

export function downloadURI(uri, name) {
  let link = document.createElement('a');
  // If you don't know the name or want to use
  // the webserver default set name = ''
  link.setAttribute('download', name);
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export const usePrevious = value => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
};

export const downloadFile = (file: string) => {
  const fileName = file.substr(file.lastIndexOf('/') + 1);
  const element = document.createElement('a');
  element.setAttribute('href', file);
  element.setAttribute('download', fileName);
  element.setAttribute('target', '_blank');

  element.style.display = 'none';

  document.body.appendChild(element);

  element.click();
  document.body.removeChild(element);
};

export const useMobile = (mobileWidth: number = mobileSize) => {
  const { windowSize } = useWindowSize();
  const [isMobile, setIsMobile] = useState<boolean>(
    windowSize.width <= mobileWidth,
  );
  useEffect(() => {
    setIsMobile(windowSize.width <= mobileWidth);
  }, [mobileWidth, windowSize]);

  return { isMobile };
};

export const useToggle = (initValue: boolean = false) => {
  const [open, setOpen] = useState(initValue);
  const toggle = useCallback(() => {
    setOpen(s => !s);
  }, []);

  return [open, toggle, setOpen];
};

export const onError = (error: any) => {
  notification.error({ message: error.response?.data?.message });
};

export const checkSpecialAddressCase = address => {
  return (
    address?.state === 'SG' &&
    address?.city === 'SG' &&
    address?.country === 'SG'
  );
};
