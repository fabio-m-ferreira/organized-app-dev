import { FieldServiceMeetingDataType } from '@features/congregation/field_service_meetings/field_service_meeting_form/index.types';
import { Table } from 'dexie';

export type FieldServiceMeetingsTable = {
  field_service_meetings: Table<FieldServiceMeetingDataType, number>;
};

export const fieldServiceMeetingsSchema = {
  field_service_meetings: '&meeting_uid, meeting_data',
};
