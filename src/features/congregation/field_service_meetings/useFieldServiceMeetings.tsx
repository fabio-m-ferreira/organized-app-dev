import { useMemo, useState, useEffect } from 'react';
import { useAtomValue } from 'jotai';
import { IconError } from '@components/icons';
import { useCurrentUser } from '@hooks/index';
import { FieldServiceMeetingDataType } from './field_service_meeting_form/index.types';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';
import { fieldServiceMeetingsActiveState } from '@states/field_service_meetings';
import {
  dbFieldServiceMeetingsSave,
  dbFieldServiceMeetingsDelete,
} from '@services/dexie/field_service_meetings';
import {
  buildPublisherReportMonths,
  currentMonthServiceYear,
} from '@utils/date';

const useFieldServiceMeetings = () => {
  // Month tab logic
  const monthsList = useMemo(() => buildPublisherReportMonths(), []);
  const initialMonth = useMemo(() => currentMonthServiceYear(), []);
  const [selectedMonth, setSelectedMonth] = useState(initialMonth);
  const [initialValue, setInitialValue] = useState(() => {
    return monthsList.findIndex((m) => m.value === initialMonth);
  });

  const handleMonthChange = (value: number) => {
    setSelectedMonth(monthsList[value].value);
    setInitialValue(value);
  };

  useEffect(() => {
    setSelectedMonth(monthsList[initialValue]?.value || initialMonth);
  }, [monthsList, initialValue, initialMonth]);

  const monthsTab = monthsList.map((month) => ({ label: month.label }));

  // CRUD/data logic
  const { isSecretary, isGroup, my_group } = useCurrentUser();
  const meetings = useAtomValue(fieldServiceMeetingsActiveState);
  const [addMeetingBoxShow, setAddMeetingBoxShow] = useState(false);
  const [editMeeting, setEditMeeting] =
    useState<FieldServiceMeetingDataType | null>(null);

  // Example empty meeting object
  const emptyMeeting: FieldServiceMeetingDataType = {
    meeting_uid: crypto.randomUUID(),
    meeting_data: {
      date: new Date(),
      type: 'group',
      group: my_group?.group_data?.name || '',
      conductor: '',
      assistant: '',
      location: '',
      materials: '',
    },
  };

  // Filtering logic (customize as needed)
  const filteredMeetings = useMemo(() => {
    // Example: show all meetings
    return meetings;
  }, [meetings]);

  const handleShowAddMeetingBox = () => {
    setAddMeetingBoxShow(true);
    setEditMeeting(null);
  };

  const handleHideAddMeetingBox = () => {
    setAddMeetingBoxShow(false);
    setEditMeeting(null);
  };

  const handleAddMeetingButtonClick = () => {
    handleShowAddMeetingBox();
  };

  const handleEditMeeting = (meeting: FieldServiceMeetingDataType) => {
    setEditMeeting(meeting);
    setAddMeetingBoxShow(true);
  };

  const handleSaveMeeting = async (meeting: FieldServiceMeetingDataType) => {
    try {
      await dbFieldServiceMeetingsSave(meeting);
      handleHideAddMeetingBox();
    } catch (error) {
      console.error(error);
      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: error.message,
        severity: 'error',
        icon: <IconError color="var(--white)" />,
      });
    }
  };

  const handleDeleteMeeting = async (meetingId: number) => {
    try {
      await dbFieldServiceMeetingsDelete(meetingId);
    } catch (error) {
      console.error(error);
      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: error.message,
        severity: 'error',
        icon: <IconError color="var(--white)" />,
      });
    }
  };

  return {
    // Month tab logic
    monthsTab,
    handleMonthChange,
    selectedMonth,
    initialValue,
    // CRUD/data logic
    isSecretary,
    isGroup,
    my_group,
    emptyMeeting,
    meetings: filteredMeetings,
    addMeetingBoxShow,
    editMeeting,
    handleSaveMeeting,
    handleDeleteMeeting,
    handleHideAddMeetingBox,
    handleAddMeetingButtonClick,
    handleEditMeeting,
  };
};

export default useFieldServiceMeetings;
