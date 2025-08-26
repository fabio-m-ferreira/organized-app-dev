import appDb from '@db/appDb';
import { FieldServiceMeetingDataType } from '@definition/field_service_meetings';

const dbUpdateFieldServiceMeetingMetadata = async () => {
  const metadata = await appDb.metadata.get(1);
  if (!metadata) return;
  metadata.metadata.field_service_meetings = {
    ...metadata.metadata.field_service_meetings,
    send_local: true,
  };
  await appDb.metadata.put(metadata);
};

export const dbFieldServiceMeetingGetAll = async () => {
  return appDb.field_service_meetings.toArray();
};

export const dbFieldServiceMeetingsGetActive = async () => {
  const meetings = await appDb.field_service_meetings
    .filter((record) => !record._deleted)
    .toArray();
  return meetings;
};

export const dbFieldServiceMeetingsSave = async (
  meeting: FieldServiceMeetingDataType
) => {
  await appDb.field_service_meetings.put(meeting);
  await dbUpdateFieldServiceMeetingMetadata();
};

export const dbFieldServiceMeetingsClear = async () => {
  const records = await appDb.field_service_meetings.toArray();
  if (records.length === 0) return;
  for (const record of records) {
    record._deleted = true;
    record.updatedAt = new Date().toISOString();
  }
  await appDb.field_service_meetings.bulkPut(records);
};

export const dbFieldServiceMeetingsCleanup = async () => {
  const records = await appDb.field_service_meetings.toArray();

  if (records.length === 0) return;

  const recordsToUpdate = records.reduce(
    (acc: FieldServiceMeetingDataType[], current) => {
      if (current.updatedAt) {
        const meeting = structuredClone(current);

        meeting.meeting_data._deleted = meeting._deleted;
        meeting.meeting_data.updatedAt = meeting.updatedAt;

        delete meeting._deleted;
        delete meeting.updatedAt;

        acc.push(meeting);
      }

      return acc;
    },
    []
  );

  if (recordsToUpdate.length > 0) {
    await appDb.field_service_meetings.bulkPut(recordsToUpdate);
  }
};
