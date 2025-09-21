import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { monthNamesState } from '@states/app';

const useMonthItem = (month: string, separator: string) => {
  const monthNames = useAtomValue(monthNamesState);

  const monthName = useMemo(() => {
    const monthIndex = +month.split(separator)[1];

    return monthNames[monthIndex - 1];
  }, [month, monthNames, separator]);

  return { monthName };
};

export default useMonthItem;
