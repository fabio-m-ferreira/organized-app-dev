export type FieldServiceMeetingFormProps = {
  data: FieldServiceMeetingDataType;
  type: 'edit' | 'add';
  onSave: (event: FieldServiceMeetingDataType) => void;
  onCancel: () => void;
};

export type MeetingType = 'joint' | 'group' | 'zoom';

export type FieldServiceMeetingDataType = {
  meeting_uid: string;
  _deleted?: boolean;
  updatedAt?: string;
  meeting_data: {
    _deleted: boolean;
    updatedAt: string;
    date: string;
    type: MeetingType; // for each type theres a different badge
    group?: string; // Only required if type === "group"
    conductor: string; // person_uid of conductor
    assistant?: string; // person_uid of assistant, only required if type === "joint"
    location?: string; // Only required if type === "group"
    materials: string;
  };
};
