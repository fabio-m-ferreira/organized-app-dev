import { apiDefault } from './common';
import { FieldServiceMeetingDataType } from '@definition/field_service_meetings';

export const apiPublicFieldMeetingsGet = async () => {
  const {
    apiHost,
    appVersion: appversion,
    congID,
    idToken,
  } = await apiDefault();

  const res = await fetch(
    `${apiHost}api/v3/congregations/meeting/${congID}/field-meetings`,
    {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`,
        appclient: 'organized',
        appversion,
      },
    }
  );

  if (!res.ok) {
    return {
      status: res.status,
      meetings: [],
      message: await res.text(),
    };
  }

  const data = await res.json();
  return {
    status: res.status,
    meetings: data?.meetings as FieldServiceMeetingDataType[],
    message: data?.message || '',
  };
};

export const apiPublishFieldMeetings = async (
  meetings: FieldServiceMeetingDataType[]
) => {
  const {
    apiHost,
    appVersion: appversion,
    congID,
    idToken,
  } = await apiDefault();

  const res = await fetch(
    `${apiHost}api/v3/congregations/meeting/${congID}/field-meetings`,
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`,
        appclient: 'organized',
        appversion,
      },
      body: JSON.stringify({ meetings }),
    }
  );

  const data = await res.json();
  return {
    status: res.status,
    message: data.message || '',
  };
};
