import { SizeType } from 'antd/lib/config-provider/SizeContext';
export enum ScreenSizeType {
  small = 'small',
  medium = 'medium',
  large = 'large',
  extraLarge = 'extraLarge',
  superLarge = 'superLarge',
}
export const RENDER_MOBILE_MENU_SCREEN_SIZE = 1150;

export const size: Record<ScreenSizeType, number> = {
  [ScreenSizeType.small]: 576,
  [ScreenSizeType.medium]: 768,
  [ScreenSizeType.large]: 992,
  [ScreenSizeType.extraLarge]: 1200,
  [ScreenSizeType.superLarge]: 1650,
};

export const tableSizeResponsive: Record<ScreenSizeType, SizeType> = {
  [ScreenSizeType.small]: 'small',
  [ScreenSizeType.medium]: 'small',
  [ScreenSizeType.large]: 'middle',
  [ScreenSizeType.extraLarge]: 'large',
  [ScreenSizeType.superLarge]: 'large',
};

export const screenSize = {
  small: `(max-width: ${size.small}px)`,
  medium: `(max-width: ${size.medium}px)`,
  large: `(max-width: ${size.large}px)`,
  extraLarge: `(max-width: ${size.extraLarge}px)`,
  superLarge: `(max-width: ${size.superLarge}px)`,
};

export function getScreenSizeType(width: number): ScreenSizeType {
  if (width <= 576) {
    return ScreenSizeType.small;
  }
  if (width > 567 && width <= 768) {
    return ScreenSizeType.medium;
  }
  if (width > 768 && width <= 992) {
    return ScreenSizeType.large;
  } else {
    return ScreenSizeType.extraLarge;
  }
}

export const mobileSize = size.medium;
