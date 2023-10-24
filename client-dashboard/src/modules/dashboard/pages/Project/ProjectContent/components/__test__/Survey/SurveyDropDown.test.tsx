import * as router from 'react-router';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import {
  baseAxiosResponse,
  JestGeneralProviderHoc,
} from '../../../../../../../../get-mock-data-jest-test';
import { surveyMock } from '../survey-mock-data';
import * as hoc from '../../../../../../../common/hoc/useCheckScopeEntityDefault';
import {
  ProjectService,
  SurveyService,
} from '../../../../../../../../services';
import { ProjectTypes } from '@/type';
import { notification } from 'antd';
import clearAllMocks = jest.clearAllMocks;
import * as funcs from '../../../../../../../../utils/funcs';
import { SurveyDropDownMenu } from '@pages/Survey/SurveyManagement/SurveyDropDown';

const mockedUseNavigate = jest.fn();

const noficationSuccessMock = jest.spyOn(notification, 'success');

beforeEach(() => {
  jest.spyOn(ProjectService, 'getProjectById').mockResolvedValue({
    ...baseAxiosResponse,
    data: {
      personResponsible: undefined,
      createdAt: '2023-02-20T02:43:13.766Z',
      updatedAt: '2023-02-20T02:43:13.766Z',
      deletedAt: null,
      id: '31',
      displayId: 'QK22-XJ7F-VV9C',
      name: 'Project 1',
      description: 'project description 001',
      type: ProjectTypes.INTERNAL,
      personInCharge: '63113393-c401-4c23-8c7d-2a7f5cbb1a80',
    },
  });

  jest.spyOn(router, 'useNavigate').mockImplementation(() => mockedUseNavigate);

  jest
    .spyOn(router, 'useParams')
    .mockImplementation(() => ({ projectId: '31' }));

  jest.spyOn(hoc, 'useCheckScopeEntityDefault').mockReturnValue({
    canRead: true,
    canCreate: true,
    canUpdate: true,
    canDelete: true,
    canRestore: true,
  });
});

afterEach(() => {
  clearAllMocks();
});

test('SurveyDropDownMenu: duplicate survey', async () => {
  const duplicateSurveyRequestMock = jest
    .spyOn(SurveyService, 'duplicateSurvey')
    .mockResolvedValue(baseAxiosResponse);

  render(
    <JestGeneralProviderHoc>
      {/* eslint-disable-next-line react/jsx-no-undef */}
      <SurveyDropDownMenu record={surveyMock} />
    </JestGeneralProviderHoc>,
  );
  await waitFor(() => {
    screen.getByRole('button', { name: 'three drop down' });
  });

  fireEvent.click(screen.getByRole('button', { name: 'three drop down' }));

  await waitFor(() => {
    screen.getByRole('menu');
    expect(screen.getAllByRole('menuitem').length).toBe(4);
    screen.getByText(/edit survey/i);
  });

  fireEvent.click(screen.getByText(/duplicate survey/i));

  await waitFor(() => {
    expect(duplicateSurveyRequestMock).toHaveBeenCalled();
  });

  await waitFor(() => {
    expect(noficationSuccessMock).toHaveBeenCalledWith({
      message: 'Duplicate Successfully',
    });
  });
});

test('SurveyDropDownMenu: delete survey', async () => {
  const deleteSurveyRequestMock = jest
    .spyOn(SurveyService, 'deleteSurveyById')
    .mockResolvedValue(baseAxiosResponse);

  render(
    <JestGeneralProviderHoc>
      <SurveyDropDownMenu record={surveyMock} />
    </JestGeneralProviderHoc>,
  );
  await waitFor(() => {
    screen.getByRole('button', { name: 'three drop down' });
  });

  fireEvent.click(screen.getByRole('button', { name: 'three drop down' }));

  await waitFor(() => {
    screen.getByRole('menu');
  });

  fireEvent.click(screen.getByText(/delete survey/i));

  await waitFor(() => {
    screen.getByText('Are you sure to delete the survey?');
  });

  fireEvent.click(screen.getByRole('button', { name: /ok/i }));

  await waitFor(() => {
    expect(deleteSurveyRequestMock).toHaveBeenCalled();
  });

  await waitFor(() => {
    expect(noficationSuccessMock).toHaveBeenCalled();
  });
});

test('SurveyDropDownMenu: edit survey', async () => {
  render(
    <JestGeneralProviderHoc>
      <SurveyDropDownMenu record={surveyMock} />
    </JestGeneralProviderHoc>,
  );
  await waitFor(() => {
    screen.getByRole('button', { name: 'three drop down' });
  });

  fireEvent.click(screen.getByRole('button', { name: 'three drop down' }));

  await waitFor(() => {
    screen.getByRole('menu');
  });

  fireEvent.click(screen.getByText(/edit survey/i));

  await waitFor(() => {
    expect(mockedUseNavigate).toHaveBeenCalledWith(
      '/app/project/31/124/edit?version=X57N-M726-JKUX',
    );
  });
});

test('SurveyDropDownMenu: export survey', async () => {
  const geSurveyFileRequestMock = jest
    .spyOn(SurveyService, 'getSurveyFile')
    .mockResolvedValue({
      ...baseAxiosResponse,
      data: { SurveyElements: [], SurveyEntry: { SurveyName: 'name' } },
    });

  const downloadFileMock = jest
    .spyOn(funcs, 'saveBlob')
    .mockImplementation(() => jest.fn());

  render(
    <JestGeneralProviderHoc>
      <SurveyDropDownMenu record={surveyMock} />
    </JestGeneralProviderHoc>,
  );

  await waitFor(() => {
    screen.getByRole('button', { name: 'three drop down' });
  });

  fireEvent.click(screen.getByRole('button', { name: 'three drop down' }));

  await waitFor(() => {
    screen.getByRole('menu');
  });

  fireEvent.click(screen.getByText(/export qualtrics json/i));

  await waitFor(() => {
    expect(geSurveyFileRequestMock).toHaveBeenCalled();
  });

  await waitFor(() => {
    expect(downloadFileMock).toHaveBeenCalled();
  });
});

test('SurveyDropDownMenu: restore survey', async () => {
  const restoreSurveyRequestMock = jest
    .spyOn(SurveyService, 'restoreSurveyById')
    .mockResolvedValue(baseAxiosResponse);

  render(
    <JestGeneralProviderHoc>
      <SurveyDropDownMenu
        record={{ ...surveyMock, deletedAt: '2023-03-16T09:58:02.981Z' }}
      />
    </JestGeneralProviderHoc>,
  );
  await waitFor(() => {
    screen.getByRole('button', { name: 'three drop down' });
  });

  fireEvent.click(screen.getByRole('button', { name: 'three drop down' }));

  await waitFor(() => {
    screen.getByRole('menu');
  });

  fireEvent.click(screen.getByText(/restore survey/i));

  await waitFor(() => {
    screen.getByText('Are you sure to restore the survey?');
  });

  fireEvent.click(screen.getByRole('button', { name: /ok/i }));

  await waitFor(() => {
    expect(restoreSurveyRequestMock).toHaveBeenCalled();
  });

  await waitFor(() => {
    expect(noficationSuccessMock).toHaveBeenCalled();
  });
});
