import * as reactRedux from 'react-redux';

export const getDispatch = (object, method) => {
  const mockDispatch = jest.fn();
  const mockUseDispatch = jest
    .spyOn(reactRedux, 'useDispatch')
    .mockReturnValue(mockDispatch);

  return { mockUseDispatch, mockDispatch };
};
