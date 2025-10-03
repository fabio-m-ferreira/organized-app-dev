import { apiDefault } from './common';
import { SourceWeekType } from '@definition/sources';
import {
  OutgoingTalkExportScheduleType,
  SchedWeekType,
} from '@definition/schedules';

export const apiPublicScheduleGet = async () => {
  const {
    apiHost,
    appVersion: appversion,
    congID,
    idToken,
  } = await apiDefault();

  const res = await fetch(
    `${apiHost}api/v3/congregations/meeting/${congID}/schedules`,
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

  const data = await res.json();

  return {
    status: res.status,
    sources: data?.sources as SourceWeekType[],
    schedules: data?.schedules as SchedWeekType[],
    talks: data?.talks as OutgoingTalkExportScheduleType[],
    message: data?.message as string,
  };
};

export const apiPublishSchedule = async (
  sources: SourceWeekType[],
  schedules: SchedWeekType[],
  talks?: OutgoingTalkExportScheduleType[]
) => {
  const {
    apiHost,
    appVersion: appversion,
    congID,
    idToken,
  } = await apiDefault();

  const res = await fetch(
    `${apiHost}api/v3/congregations/meeting/${congID}/schedules`,
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`,
        appclient: 'organized',
        appversion,
      },
      body: JSON.stringify({ sources, schedules, talks }),
    }
  );

  const data = await res.json();

  return { status: res.status, message: data?.message as string };
};
