import { CustomInputProps } from './inputs/custom-input/CustomInput';
import { CustomSelectProps } from './inputs/custom-select/CustomSelect';
import { CustomTextAreaProps } from './inputs/custom-textarea/CustomTextArea';
import { CustomPasswordProps } from './inputs/custom-password/CustomPassword';
import { FormItemProps } from 'antd/lib/form/FormItem';
import { FetchParamsSelect } from 'type';
import { SliderBaseProps } from 'antd/lib/slider';
import { DATE_PICKER_TYPES } from 'enums';
import { CustomRadioButtonGroupProps } from './inputs/custom-group-radio-button/CustomGroupRadioButton';
import { CustomInputMaskProps } from './input-mask/BaseInputMask';
import { Dispatch, SetStateAction } from 'react';

export enum INPUT_TYPES {
  INPUT = 'INPUT',
  SELECT = 'SELECT',
  TEXTAREA = 'TEXTAREA',
  PASSWORD = 'PASSWORD',
  NUMBER = 'NUMBER',
  DAY_PICKER = 'DAY_PICKER',
  CHECKBOX = 'CHECKBOX',
  CHECKBOX_GROUP = 'CHECKBOX_GROUP',
  RADIO_GROUP = 'RADIO_GROUP',
  IMAGE_UPLOAD = 'IMAGE_UPLOAD',
  RATING = 'RATING',
  CHECKABLE_TAG = 'CHECKABLE_TAG',
  SLIDER = 'SLIDER',
  INPUT_MASK = 'INPUT_MASK',
  INPUT_GROUP_MASK = 'INPUT_GROUP_MASK',
}

export type UncontrolledInputProps = CustomInputMaskProps &
  CustomInputProps &
  CustomTextAreaProps &
  CustomPasswordProps &
  CustomSelectProps &
  SliderBaseProps &
  CustomRadioButtonGroupProps & {
    inputType: INPUT_TYPES;
  } & {
    character?: JSX.Element;
    count?: number;
    isUnStyleDisabled?: boolean;
    callback?: Function;
    tooltips?: Array<string>;
    picker?: DATE_PICKER_TYPES;
    format?: Function;
    isEditFormat?: boolean;
    defaultPickerValue?: any;
  };

export type ControlledInputProps = UncontrolledInputProps & {
  customFormProps?: FormItemProps;
  label?: string | JSX.Element | null;
  name: string;
  entity?: string;
  params?: FetchParamsSelect;
  isOptionValue?: boolean;
  errorMessage?: string | null;
  customOptions?: JSX.Element[];
  ref: any;
  isFastField?: boolean;
  className?: string;
  moduleName?: string;
  subPath?: string;
  onImageChange?: Dispatch<SetStateAction<Record<string, any>>>;
};

export type OnchangeType = {
  onChange?: (value: string | number | any) => void;
};
