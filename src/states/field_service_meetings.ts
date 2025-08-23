import { atom } from 'jotai';
import { FieldServiceMeetingDataType } from '@features/congregation/field_service_meetings/field_service_meeting_form/index.types';

export const fieldServiceMeetingsDbState = atom<FieldServiceMeetingDataType[]>(
  []
);

export const fieldServiceMeetingsState = atom((get) => {
  const meetings = get(fieldServiceMeetingsDbState);
  return meetings
    .filter((record) => !record._deleted)
    .sort(
      (a, b) =>
        new Date(a.meeting_data.date).getTime() -
        new Date(b.meeting_data.date).getTime()
    );
});

export const fieldServiceMeetingsActiveState = atom((get) => {
  return get(fieldServiceMeetingsState);
});
