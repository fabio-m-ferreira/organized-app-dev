import { useEffect, useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import { useQuery } from '@tanstack/react-query';
import { addMonths, formatDate, getWeekDate } from '@utils/date';
import { updateObject } from '@utils/common';
import { fieldServiceMeetingsState } from '@states/field_service_meetings';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';
import { useAppTranslation } from '@hooks/index';
import {
  apiPublicFieldMeetingsGet,
  apiPublishFieldMeetings,
} from '@services/api/field_service_meetings';
import { FieldServiceMeetingDataType } from '@definition/field_service_meetings';
import { getBaseList, getSchedulesList } from '../getSchedulesList';

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

export interface FieldMeetingsPublishProps {
  onClose?: () => void;
}

const useFieldMeetingsPublish = ({ onClose }: FieldMeetingsPublishProps) => {
  const { t } = useAppTranslation();

  const { data, refetch } = useQuery({
    queryKey: ['public_field_meetings'],
    queryFn: apiPublicFieldMeetingsGet,
    refetchOnMount: 'always',
  });

  const meetings = useAtomValue(fieldServiceMeetingsState);

  const [isProcessing, setIsProcessing] = useState(false);
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [publishedItems, setPublishedItems] = useState<string[]>([]);
  const baseList = getBaseList(meetings);
  const schedulesList = getSchedulesList({
    meetings,
    checkedItems,
    publishedItems,
  });

  // Selection logic
  const handleCheckedChange = (checked: boolean, value: string) => {
    if (isProcessing) return;
    if (checked) {
      setCheckedItems((prev) => {
        const items = structuredClone(prev);
        if (!value.includes('-')) {
          // Year bulk select
          const months = baseList.find((g) => g.year === value)?.months || [];
          return Array.from(new Set([...items, ...months]));
        }
        items.push(value);
        return Array.from(new Set(items));
      });
    } else {
      setCheckedItems((prev) => {
        if (!value.includes('-')) {
          // Year bulk unselect
          return prev.filter((m) => !m.startsWith(value + '-'));
        }
        return prev.filter((m) => m !== value);
      });
    }
  };

  // Extract meetings for selected months
  const handleGetMaterials = (
    data: FieldServiceMeetingDataType[],
    months: string[]
  ) => {
    const filtered = data.filter((item) =>
      months.includes(item.meeting_data.date.slice(0, 7))
    );
    return filtered;
  };

  // Merge local and remote meetings
  const handleUpdateMaterialsFromRemote = (
    local: FieldServiceMeetingDataType[],
    remote: FieldServiceMeetingDataType[]
  ) => {
    const now = getWeekDate();
    const lastDate = formatDate(addMonths(now, -3), 'yyyy-MM');
    const filteredRemote = remote.filter(
      (item) => item.meeting_data.date.slice(0, 7) >= lastDate
    );
    const merged = [...filteredRemote];
    for (const item of local) {
      const idx = merged.findIndex((r) => r.meeting_uid === item.meeting_uid);
      if (idx === -1) {
        merged.push(item);
      } else {
        merged[idx] = updateObject(structuredClone(merged[idx]), item);
      }
    }
    return merged;
  };

  // Publish
  const handlePublishSchedule = async () => {
    if (checkedItems.length === 0 || isProcessing) return;
    try {
      setIsProcessing(true);
      const months = checkedItems.toSorted();
      const localToPublish = handleGetMaterials(meetings, months);
      const { data } = await refetch();
      if (Array.isArray(data?.meetings)) {
        const remoteMeetings = data.meetings;
        const meetingsToPublish = handleUpdateMaterialsFromRemote(
          localToPublish,
          remoteMeetings
        );
        const { status, message } =
          await apiPublishFieldMeetings(meetingsToPublish);
        if (status !== 200) throw new Error(message);
        displaySnackNotification({
          header: t('tr_successfullyPublished'),
          message: t('tr_successfullyPublishedDesc'),
          severity: 'success',
        });
        setIsProcessing(false);
        onClose?.();
      }
    } catch (error) {
      setIsProcessing(false);
      onClose?.();
      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  // Set published months from remote
  useEffect(() => {
    if (Array.isArray(data?.meetings)) {
      const published = data.meetings.reduce(
        (acc: string[], item: FieldServiceMeetingDataType) => {
          const month = item.meeting_data.date.slice(0, 7);
          if (!acc.includes(month)) acc.push(month);
          return acc;
        },
        []
      );
      setPublishedItems(published);
    }
  }, [data]);

  return {
    schedulesList,
    handleCheckedChange,
    handlePublishSchedule,
    isProcessing,
    checkedItems,
    publishedItems,
  };
};

export default useFieldMeetingsPublish;
