import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { AuthSelectors } from 'redux/auth';

const LIST_COUNTRIES_VALID = ['SG', 'VN'];

const useCheckValidLocation = () => {
  const countryCode = useSelector(AuthSelectors.getCountryCode);

  const isValidCountry = useMemo<boolean>(() => {
    return LIST_COUNTRIES_VALID.includes(countryCode);
  }, [countryCode]);

  return {
    isValidCountry,
    countryCode,
  };
};

export default useCheckValidLocation;
