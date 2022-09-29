import { CloseIcon } from 'icons';
import { ControlledInput } from 'modules/common';
import { INPUT_TYPES } from 'modules/common/input/type';
import React from 'react';

function DuplicateExisting() {
  return (
    <ControlledInput
      inputType={INPUT_TYPES.SELECT}
      type={'text'}
      name="surveyTemplate"
      label="Survey Template"
      options={[
        { label: 'New Survey', value: 'newSurvey' },
        {
          label: <CloseIcon />,
          value: 'duplicateExistingSurvey',
        },
      ]}
      onSelect={e => e.preventDefault()}
    />
  );
}

export default DuplicateExisting;
