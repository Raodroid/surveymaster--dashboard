import { Radio, Select } from 'antd';
import { useMemo, useState } from 'react';
import DuplicateExistingTable from './DuplicateExistingTable';
import { CustomPopUp, SurveyCustomSelectWrapper } from './styles';

export interface AddNewSurveySelect {
  className?: string;
  value: string;
  setValue: (value: string) => void;
  values: Record<string, string>;
}

function SurveyCustomSelect(props: AddNewSurveySelect) {
  const { className = '', value, setValue, values } = props;
  const [show, setShow] = useState(false);
  const [checked, setChecked] = useState('');

  const list = useMemo(
    () => [
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
    ],
    [values],
  );

  const selectValue = useMemo(() => {
    const obj = list.find(elm => elm.value === value);
    if (obj) return obj.title;
    return 'Select';
  }, [value, list]);

  return (
    <SurveyCustomSelectWrapper className={`${className}`}>
      <label>Survey Template</label>
      <Select
        popupClassName="custom-select-popup"
        onClick={() => {
          setShow(!show);
          setChecked('');
        }}
        value={[selectValue]}
      />
      {show && (
        <CustomPopUp className="flex-column">
          {list.map(elm => (
            <Radio
              checked={elm.value === checked}
              onClick={() => {
                setChecked(elm.value);
                if (elm.value !== values.duplicateExistingSurvey) {
                  setValue(elm.value);
                  setShow(false);
                }
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
