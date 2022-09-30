import { Radio, Select } from 'antd';
import { useState } from 'react';
import DuplicateExistingTable from './DuplicateExistingTable';
import { CustomPopUp, SurveyCustomSelectWrapper } from './styles';

export interface AddNewSurveySelect {}

function SurveyCustomSelect() {
  const [show, setShow] = useState(false);
  const [checked, setChecked] = useState('');

  const values = {
    newSurvey: 'newSurvey',
    duplicateExistingSurvey: 'duplicate',
    json: 'json',
  };

  const list = [
    {
      value: values.newSurvey,
      title: 'New Survey',
    },
    {
      value: values.duplicateExistingSurvey,
      title: 'Duplicate Existing Survey',
    },
    {
      value: values.json,
      title: 'Import from JSON file',
    },
  ];

  return (
    <SurveyCustomSelectWrapper>
      <label>Survey Template</label>
      <Select
        popupClassName="custom-select-popup"
        onClick={() => {
          setShow(!show);
          setChecked('');
        }}
      />
      {show && (
        <CustomPopUp className="flex-column">
          {list.map(elm => (
            <Radio
              checked={elm.value === checked}
              onClick={() => {
                setChecked(elm.value);
              }}
            >
              {elm.title}
              {elm.value === values.duplicateExistingSurvey && (
                <Select
                  className="duplicate-selector"
                  popupClassName="custom-select-popup"
                  onClick={() => setChecked(elm.value)}
                />
              )}
              {elm.value === values.duplicateExistingSurvey &&
                checked === values.duplicateExistingSurvey && (
                  <DuplicateExistingTable />
                )}
            </Radio>
          ))}
        </CustomPopUp>
      )}
    </SurveyCustomSelectWrapper>
  );
}

export default SurveyCustomSelect;
