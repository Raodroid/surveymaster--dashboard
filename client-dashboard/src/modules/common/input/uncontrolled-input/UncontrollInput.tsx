import { memo } from 'react';
import {
  CustomCheckableTag,
  CustomCheckbox,
  CustomDayPicker,
  CustomGroupRadioButton,
  CustomImageUpload,
  CustomInput,
  CustomInputDebounce,
  CustomInputNumber,
  CustomPassword,
  CustomRating,
  CustomSelect,
  CustomSlider,
  CustomTextArea,
} from '../inputs';
import { INPUT_TYPES, UncontrolledInputProps } from '../type';
import CustomGroupCheckbox from '../inputs/custom-group-checkbox/CustomGroupCheckbox';
import CustomInputGroupMask from '../inputs/custom-input-group-mask/CustomInputGroupMask';
import CustomInputMask from '../inputs/custom-input-mask/CustomInputMask';

const ControlledInput = (props: UncontrolledInputProps) => {
  let Input:
    | null
    | typeof CustomInput
    | typeof CustomPassword
    | typeof CustomTextArea
    | typeof CustomInputNumber
    | typeof CustomDayPicker
    | typeof CustomCheckbox
    | typeof CustomGroupRadioButton
    | typeof CustomRating
    | typeof CustomCheckableTag
    | typeof CustomSlider
    | typeof CustomInputDebounce
    | typeof CustomSelect = null;
  const { inputType, isUnStyleDisabled, ...rest } = props;
  let ignoreBlur = false;

  switch (inputType) {
    case INPUT_TYPES.INPUT:
      Input = CustomInput;
      break;
    case INPUT_TYPES.INPUT_DEBOUNCE:
      Input = CustomInputDebounce;
      break;
    case INPUT_TYPES.SELECT:
      Input = CustomSelect;
      break;
    case INPUT_TYPES.TEXTAREA:
      Input = CustomTextArea;
      break;
    case INPUT_TYPES.PASSWORD:
      Input = CustomPassword;
      break;
    case INPUT_TYPES.NUMBER:
      Input = CustomInputNumber;
      break;
    case INPUT_TYPES.DAY_PICKER:
      Input = CustomDayPicker;
      break;
    case INPUT_TYPES.CHECKBOX:
      Input = CustomCheckbox;
      break;
    case INPUT_TYPES.RADIO_GROUP:
      Input = CustomGroupRadioButton;
      break;
    case INPUT_TYPES.IMAGE_UPLOAD:
      Input = CustomImageUpload;
      break;
    case INPUT_TYPES.CHECKABLE_TAG:
      Input = CustomCheckableTag;
      break;
    case INPUT_TYPES.SLIDER:
      Input = CustomSlider;
      break;
    case INPUT_TYPES.CHECKBOX_GROUP:
      Input = CustomGroupCheckbox;
      break;
    case INPUT_TYPES.RATING:
      Input = CustomRating;
      ignoreBlur = true;
      break;
    case INPUT_TYPES.INPUT_GROUP_MASK:
      Input = CustomInputGroupMask;
      break;
    case INPUT_TYPES.INPUT_MASK:
      Input = CustomInputMask;
      break;

    default:
      break;
  }
  const { onBlur, ...restWithoutBlur } = rest;

  if (Input !== null) {
    return (
      <Input
        className={`${isUnStyleDisabled ? 'unstyle-disabled' : ''}`}
        {...(ignoreBlur ? restWithoutBlur : rest)}
      />
    );
  }
  return null;
};

export default memo(ControlledInput);
