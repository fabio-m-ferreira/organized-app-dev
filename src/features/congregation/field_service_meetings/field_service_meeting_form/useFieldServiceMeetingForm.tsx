import { useCallback, useState } from 'react';

const initialErrors = {
  meetingType: false,
  selectedGroup: false,
  conductor: false,
  assistant: false,
  materials: false,
};

const useFieldServiceMeetingForm = ({ data, onSave }) => {
  const [localMeeting, setLocalMeeting] = useState(data);
  const [errors, setErrors] = useState(initialErrors);
  const [wasSubmitted, setWasSubmitted] = useState(false);

  const validateField = useCallback(
    (field, value) => {
      switch (field) {
        case 'meetingType':
          return !value;
        case 'selectedGroup':
          return (
            localMeeting.meetingType === 'group' &&
            (!value || value.trim() === '')
          );
        case 'conductor':
          return !value || value.trim() === '';
        case 'assistant':
          return (
            localMeeting.meetingType === 'joint' &&
            (!value || value.trim() === '')
          );
        case 'materials':
          return !value || value.trim() === '';
        default:
          return false;
      }
    },
    [localMeeting]
  );

  const validateForm = useCallback(() => {
    const data = localMeeting;
    const newErrors = {
      meetingType: validateField('meetingType', data.meetingType),
      selectedGroup: validateField('selectedGroup', data.selectedGroup),
      conductor: validateField('conductor', data.conductor),
      assistant: validateField('assistant', data.assistant),
      date: validateField('date', data.date),
      time: validateField('time', data.time),
      materials: validateField('materials', data.materials),
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  }, [localMeeting, validateField]);

  // Individual field change handlers
  const handleChangeMeetingType = useCallback(
    (value) => {
      setLocalMeeting((prev) => ({ ...prev, meetingType: value }));
      if (wasSubmitted) setErrors((prev) => ({ ...prev, meetingType: false }));
    },
    [wasSubmitted]
  );

  const handleChangeSelectedGroup = useCallback(
    (value) => {
      setLocalMeeting((prev) => ({ ...prev, selectedGroup: value }));
      if (wasSubmitted)
        setErrors((prev) => ({ ...prev, selectedGroup: false }));
    },
    [wasSubmitted]
  );

  const handleChangeConductor = useCallback(
    (value) => {
      setLocalMeeting((prev) => ({ ...prev, conductor: value }));
      if (wasSubmitted) setErrors((prev) => ({ ...prev, conductor: false }));
    },
    [wasSubmitted]
  );

  const handleChangeAssistant = useCallback(
    (value) => {
      setLocalMeeting((prev) => ({ ...prev, assistant: value }));
      if (wasSubmitted) setErrors((prev) => ({ ...prev, assistant: false }));
    },
    [wasSubmitted]
  );

  // Only update date and time separately
  const handleChangeDate = useCallback(
    (dateValue) => {
      setLocalMeeting((prev) => ({ ...prev, date: dateValue }));
      if (wasSubmitted) setErrors((prev) => ({ ...prev, date: false }));
    },
    [wasSubmitted]
  );

  const handleChangeTime = useCallback(
    (timeValue) => {
      setLocalMeeting((prev) => ({ ...prev, time: timeValue }));
      if (wasSubmitted) setErrors((prev) => ({ ...prev, time: false }));
    },
    [wasSubmitted]
  );

  const handleChangeMaterials = useCallback(
    (value) => {
      setLocalMeeting((prev) => ({ ...prev, materials: value }));
      if (wasSubmitted) setErrors((prev) => ({ ...prev, materials: false }));
    },
    [wasSubmitted]
  );

  const handleSaveMeeting = useCallback(() => {
    setWasSubmitted(true);
    if (validateForm()) {
      const meeting = structuredClone(localMeeting);
      // Combine date and time for saving
      const combinedDate = new Date(meeting.date);
      combinedDate.setHours(
        meeting.time.getHours(),
        meeting.time.getMinutes(),
        0,
        0
      );
      meeting.date = combinedDate;
      delete meeting.time; // Remove time before saving
      meeting.updatedAt = new Date().toISOString();
      onSave(meeting);
    }
  }, [localMeeting, onSave, validateForm]);

  const handleDeleteMeeting = useCallback(() => {
    const meeting = structuredClone(localMeeting);

    meeting.meeting_data._deleted = true;
    meeting.meeting_data.updatedAt = new Date().toISOString();

    onSave(meeting);
  }, [localMeeting, onSave]);

  return {
    localMeeting,
    errors,
    handleChangeMeetingType,
    handleChangeSelectedGroup,
    handleChangeConductor,
    handleChangeAssistant,
    handleChangeDate,
    handleChangeTime,
    handleChangeMaterials,
    handleSaveMeeting,
    handleDeleteMeeting,
  };
};

export default useFieldServiceMeetingForm;
