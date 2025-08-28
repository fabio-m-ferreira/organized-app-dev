import { useMemo, useState, useEffect } from 'react';
import { useAtomValue } from 'jotai';
import { IconError } from '@components/icons';
import { FieldServiceMeetingDataType } from '@definition/field_service_meetings';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';
import { fieldServiceMeetingsActiveState } from '@states/field_service_meetings';
import { dbFieldServiceMeetingsSave } from '@services/dexie/field_service_meetings';
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
  const meetings = useAtomValue(fieldServiceMeetingsActiveState);
  const [addMeetingBoxShow, setAddMeetingBoxShow] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  // Example empty meeting object
  const emptyMeeting: FieldServiceMeetingDataType = {
    meeting_uid: crypto.randomUUID(),
    meeting_data: {
      _deleted: false,
      updatedAt: new Date().toISOString(),
      date: new Date().toISOString(),
      type: 'joint',
      group: '',
      conductor: '',
      assistant: '',
      location: '',
      materials: '',
    },
  };

  const filteredMeetings = useMemo(() => {
    const filtered = selectedMonth
      ? meetings.filter((item) => {
          // Normalize the date format for comparison (replace hyphens with slashes)
          const meetingMonth = item.meeting_data.date.slice(0, 7).replace(/-/g, '/');
          return meetingMonth === selectedMonth;
        })
      : meetings;

    return [...filtered].sort(
      (a, b) =>
        new Date(a.meeting_data.date).getTime() -
        new Date(b.meeting_data.date).getTime()
    );
  }, [meetings, selectedMonth]);

  const handleShowAddMeetingBox = () => {
    setAddMeetingBoxShow(true);
  };

  const handleHideAddMeetingBox = () => {
    setAddMeetingBoxShow(false);
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

  return {
    // Month tab logic
    monthsTab,
    handleMonthChange,
    selectedMonth,
    initialValue,
    // CRUD/data logic
    emptyMeeting,
    filteredMeetings,
    addMeetingBoxShow,
    handleSaveMeeting,
    handleHideAddMeetingBox,
    handleShowAddMeetingBox,
  };
};

export default useFieldServiceMeetings;
