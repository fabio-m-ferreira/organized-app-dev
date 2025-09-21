import { atom } from 'jotai';
import { FieldServiceMeetingDataType } from '@definition/field_service_meetings';

export const fieldServiceMeetingsDbState = atom<FieldServiceMeetingDataType[]>(
  []
);

export const fieldServiceMeetingsState = atom((get) => {
  const meetings = get(fieldServiceMeetingsDbState);
  return meetings
    .filter((record) => !record.meeting_data._deleted)
    .sort(
      (a, b) =>
        new Date(a.meeting_data.date).getTime() -
        new Date(b.meeting_data.date).getTime()
    );
});
