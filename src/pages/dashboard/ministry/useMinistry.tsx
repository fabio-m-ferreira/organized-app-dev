import { useMemo, useState, useEffect } from 'react';
import { useCurrentUser } from '@hooks/index';
import { useAtomValue } from 'jotai';
import { fieldServiceMeetingsState } from '@states/field_service_meetings';
import { getDayDate } from '@utils/date';
import {
  personIsAP,
  personIsFMF,
  personIsFR,
  personIsFS,
} from '@services/app/persons';
import { currentMonthServiceYear, currentServiceYear } from '@utils/date';
import useMinistryMonthlyRecord from '@features/ministry/hooks/useMinistryMonthlyRecord';
import usePioneerStats from '@features/ministry/service_year/yearly_stats/pioneer_stats/usePioneerStats';

const useMinistry = () => {
  const { person, enable_AP_application } = useCurrentUser();
  const meetings = useAtomValue(fieldServiceMeetingsState);
  // State for async field service meeting count
  const [meetingCount, setMeetingCount] = useState<number | null>(null);
  const [meetingCountLoading, setMeetingCountLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function calculateMeetingCount() {
      if (!person) {
        setMeetingCount(null);
        setMeetingCountLoading(false);
        return;
      }
      const now = getDayDate();
      // Only count meetings today or in the future
      let groupCount = 0;
      let normalCount = 0;
      meetings.forEach((m) => {
        if (!m.meeting_data) return;
        const isUser =
          m.meeting_data.conductor === person.person_uid ||
          m.meeting_data.assistant === person.person_uid;
        if (!isUser) return;
        const meetingDate = new Date(m.meeting_data.date.replace(/\//g, '-'));
        if (meetingDate < now) return;
        if (m.meeting_data.type === 'group') {
          groupCount++;
        } else {
          normalCount++;
        }
      });
      // Divide group meetings by 2 to avoid double counting
      const count = normalCount + Math.floor(groupCount / 2);
      if (isMounted) {
        setMeetingCount(count);
        setMeetingCountLoading(false);
      }
    }
    setMeetingCountLoading(true);
    calculateMeetingCount();
    return () => {
      isMounted = false;
    };
  }, [person, meetings]);

  const currentMonth = useMemo(() => {
    return currentMonthServiceYear();
  }, []);

  const currentSY = useMemo(() => {
    return currentServiceYear();
  }, []);

  const { hours_balance } = usePioneerStats(currentSY);

  const { hours_total } = useMinistryMonthlyRecord({
    month: currentMonth,
    person_uid: person.person_uid,
    publisher: true,
  });

  const isPioneer = useMemo(() => {
    if (!person) return false;

    const isAP = personIsAP(person);
    const isFR = personIsFR(person);
    const isFS = personIsFS(person);
    const isFMF = personIsFMF(person);

    return isAP || isFR || isFS || isFMF;
  }, [person]);

  const hours = useMemo(() => {
    if (hours_total.indexOf(':') === -1) {
      return `${hours_total}:00`;
    }

    return hours_total;
  }, [hours_total]);

  return {
    isPioneer,
    hours,
    hours_balance: String(hours_balance),
    enable_AP_application,
    fieldServiceMeetingCount: meetingCount,
    fieldServiceMeetingCountLoading: meetingCountLoading,
  };
};

export default useMinistry;
