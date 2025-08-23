export type FieldServiceMeetingFormProps = {
  data: FieldServiceMeetingType;
  type: 'edit' | 'add';
  onSave: (event: FieldServiceMeetingType) => void;
  onCancel: () => void;
};

export type MeetingType = 'joint' | 'group' | 'zoom';

export type FieldServiceMeetingType = {
  type: MeetingType;
  group?: string;
  conductor: string;
  assistant?: string;
  date: Date;
  time: Date;
  materials: string;
};

export type FieldServiceMeetingDataType = {
  meeting_uid: string;
  _deleted?: boolean;
  updatedAt?: string;
  meeting_data: {
    date: Date;
    type: MeetingType; // for each type theres a different badge
    group?: string; // Only required if type === "group"
    conductor: string;
    assistant?: string; // Only required if type === "joint"
    location?: string; // Only required if type === "group"
    materials: string;
  };
};
