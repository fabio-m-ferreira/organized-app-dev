import { useMemo, useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  congNewState,
  firstnameState,
  settingsState,
  userLocalUIDState,
} from '@states/settings';
import { isMyAssignmentOpenState } from '@states/app';
import { assignmentsHistoryState } from '@states/schedules';
import { getDayDate } from '@utils/date';
import { isTest } from '@constants/index';
import { schedulesGetMeetingDate } from '@services/app/schedules';

const useDashboard = () => {
  const setIsMyAssignmentOpen = useSetAtom(isMyAssignmentOpenState);

  const firstName = useAtomValue(firstnameState);
  const isCongNew = useAtomValue(congNewState);
  const userUID = useAtomValue(userLocalUIDState);
  const assignmentsHistory = useAtomValue(assignmentsHistoryState);
  const settings = useAtomValue(settingsState);

  const isMigrated = useMemo(() => {
    return settings.cong_settings.cong_migrated ?? false;
  }, [settings]);

  const initialSnackValue = useMemo(() => {
    return !isMigrated && isCongNew && !isTest;
  }, [isCongNew, isMigrated]);

  const [newCongSnack, setNewCongSnack] = useState(initialSnackValue);

  const countFutureAssignments = useMemo(() => {
    const now = getDayDate();
    return assignmentsHistory.filter((record) => {
      if (record.assignment.person !== userUID) return false;
      let assignmentDateStr = record.weekOf;
      const isMidweek = record.assignment.key.startsWith('MM_');
      if (typeof schedulesGetMeetingDate === 'function') {
        const meetingDate = schedulesGetMeetingDate({
          week: record.weekOf,
          meeting: isMidweek ? 'midweek' : 'weekend',
          dataView: record.assignment.dataView,
        });
        if (meetingDate.date && meetingDate.date.length > 0) {
          assignmentDateStr = meetingDate.date;
        }
      }
      if (!assignmentDateStr) return false;
      const assignmentDate = new Date(assignmentDateStr.replace(/\//g, '-'));
      return assignmentDate >= now;
    }).length;
  }, [assignmentsHistory, userUID]);

  const handleCloseNewCongNotice = async () => {
    setNewCongSnack(false);
  };

  const handleOpenMyAssignments = async () => {
    setIsMyAssignmentOpen(true);
  };

  return {
    firstName,
    isCongNew,
    handleCloseNewCongNotice,
    handleOpenMyAssignments,
    countFutureAssignments,
    isMigrated,
    newCongSnack,
  };
};

export default useDashboard;
