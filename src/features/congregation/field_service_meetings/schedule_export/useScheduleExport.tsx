import { useState } from 'react';
import { ScheduleExportType } from './index.types';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';

import { pdf } from '@react-pdf/renderer';
import { TemplateFieldServiceMeeting } from '@views/index';
import { useAtomValue } from 'jotai';
import { fieldWithLanguageGroupsState } from '@states/field_service_groups';
import { JWLangLocaleState } from '@states/settings';
import { fieldServiceMeetingsState } from '@states/field_service_meetings';
import { FieldServiceMeetingDataType } from '@definition/field_service_meetings';

import { getBaseList, getSchedulesList } from '../getSchedulesList';

const useScheduleExport = (onClose: ScheduleExportType['onClose']) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const meetings = useAtomValue(fieldServiceMeetingsState);
  const sourceLang = useAtomValue(JWLangLocaleState);

  // Month selection logic
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const baseList = getBaseList(meetings);
  const meetingsList = getSchedulesList({
    meetings,
    checkedItems,
    publishedItems: [],
  });

  const allGroups = useAtomValue(fieldWithLanguageGroupsState);
  // Selection logic (same as publish)
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

  const handleExportSchedule = async () => {
    if (isProcessing) return;
    if (checkedItems.length === 0) return;

    try {
      setIsProcessing(true);

      // Filter meetings by selected months
      const months = checkedItems.toSorted();
      const meetingData = handleGetMaterials(meetings, months);

      const blob = await pdf(
        <TemplateFieldServiceMeeting
          data={meetingData}
          lang={sourceLang}
          groupsList={allGroups}
        />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      window.open(url, '_blank'); // Preview PDF in new tab

      // const filename = `Saídas_ao_serviço_de_campo.pdf`;

      // saveAs(blob, filename);

      setIsProcessing(false);
      onClose?.();
    } catch (error) {
      console.error(error);

      setIsProcessing(false);
      onClose?.();

      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  return {
    meetingsList,
    handleCheckedChange,
    handleExportSchedule,
    isProcessing,
    checkedItems,
  };
};

export default useScheduleExport;
