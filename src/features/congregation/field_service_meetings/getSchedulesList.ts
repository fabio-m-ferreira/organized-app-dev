import { FieldServiceMeetingDataType } from '@definition/field_service_meetings';

export interface YearGroupType {
  year: string;
  months: string[];
}

export interface ScheduleListType {
  year: string;
  months: {
    month: string;
    checked: boolean;
    published: boolean;
  }[];
}

interface GetSchedulesListOptions {
  meetings: FieldServiceMeetingDataType[];
  checkedItems?: string[];
  publishedItems?: string[];
}

export function getBaseList(
  meetings: FieldServiceMeetingDataType[]
): YearGroupType[] {
  const monthsSet = new Set<string>();
  meetings.forEach((item) => {
    const month = item.meeting_data.date.slice(0, 7); // YYYY-MM
    monthsSet.add(month);
  });
  const monthsList = Array.from(monthsSet).sort();

  const baseList: YearGroupType[] = [];
  monthsList.forEach((month) => {
    const [year] = month.split('-');
    let yearGroup = baseList.find((g) => g.year === year);
    if (!yearGroup) {
      yearGroup = { year, months: [] };
      baseList.push(yearGroup);
    }
    yearGroup.months.push(month);
  });
  return baseList;
}

export function getSchedulesList({
  meetings,
  checkedItems = [],
  publishedItems,
}: GetSchedulesListOptions): ScheduleListType[] {
  const baseList = getBaseList(meetings);
  const schedulesList: ScheduleListType[] = baseList.map((record) => ({
    year: record.year,
    months: record.months.map((month) => ({
      month,
      checked: checkedItems.includes(month),
      published: publishedItems.includes(month),
    })),
  }));
  return schedulesList;
}
