import { useMemo, useState, useEffect } from 'react';
import { useAtomValue } from 'jotai';
import { IconError } from '@components/icons';
import { FieldServiceMeetingDataType } from '@definition/field_service_meetings';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';
import { fieldServiceMeetingsState } from '@states/field_service_meetings';
import { dbFieldServiceMeetingsSave } from '@services/dexie/field_service_meetings';
import {
  buildPublisherReportMonths,
  currentMonthServiceYear,
} from '@utils/date';
import { congAccountConnectedState } from '@states/app';
import { personsActiveState } from '@states/persons';
import { buildPersonFullname } from '@utils/common';

const useFieldServiceMeetings = () => {
  const isConnected = useAtomValue(congAccountConnectedState);

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

  const meetings = useAtomValue(fieldServiceMeetingsState);
  const [addMeetingBoxShow, setAddMeetingBoxShow] = useState(false);

  const [openPublish, setOpenPublish] = useState(false);

  const handleOpenPublish = () => setOpenPublish(true);
  const handleClosePublish = () => setOpenPublish(false);

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
          const meetingMonth = item.meeting_data.date
            .slice(0, 7)
            .replace(/-/g, '/');
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

  const persons = useAtomValue(personsActiveState);

  // Helper to get display name from person_uid or fallback to string
  const getPersonDisplay = (value: string) => {
    if (!value) return '';
    const person = persons.find((p) => p.person_uid === value);
    if (person) {
      return buildPersonFullname(
        person.person_data.person_lastname.value,
        person.person_data.person_firstname.value
      );
    }
    return value;
  };

  return {
    monthsTab,
    handleMonthChange,
    selectedMonth,
    initialValue,
    emptyMeeting,
    filteredMeetings,
    addMeetingBoxShow,
    handleSaveMeeting,
    handleHideAddMeetingBox,
    handleShowAddMeetingBox,
    openPublish,
    handleOpenPublish,
    handleClosePublish,
    isConnected,
    getPersonDisplay,
  };
};

export default useFieldServiceMeetings;
