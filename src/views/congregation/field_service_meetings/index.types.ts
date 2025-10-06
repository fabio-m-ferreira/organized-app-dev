import { FieldServiceGroupType } from '@definition/field_service_groups';
import { FieldServiceMeetingDataType } from '@definition/field_service_meetings';

export interface FieldServiceMeetingTemplateType {
  data: FieldServiceMeetingDataType[];
  lang: string;
  groupsList: FieldServiceGroupType[];
}
