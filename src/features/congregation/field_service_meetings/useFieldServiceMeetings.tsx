import { useMemo, useState, useEffect } from 'react';
import {
  buildPublisherReportMonths,
  currentMonthServiceYear,
} from '@utils/date';

// Use buildPublisherReportMonths for month list logic

const useFieldServiceMeetings = () => {
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

  // Tabs for ScrollableTabs
  const monthsTab = monthsList.map((month) => ({ label: month.label }));

  return {
    monthsTab,
    handleMonthChange,
    selectedMonth,
    initialValue,
  };
};

export default useFieldServiceMeetings;
