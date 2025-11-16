import { useState } from 'react';
import { useAtomValue } from 'jotai';
import writeXlsxFile, { Row, SheetData } from 'write-excel-file';
import { IconError } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import { getMessageByCode } from '@services/i18n/translation';
import { displaySnackNotification } from '@services/states/app';
import { personsAllState } from '@states/persons';
import { fieldWithLanguageGroupsState } from '@states/field_service_groups';
import { JWLangLocaleState } from '@states/settings';

const useExportPersons = () => {
  const { t } = useAppTranslation();

  const persons = useAtomValue(personsAllState);
  const groups = useAtomValue(fieldWithLanguageGroupsState);
  const lng = useAtomValue(JWLangLocaleState);

  const [isProcessing, setIsProcessing] = useState(false);

  const personGetGroup = (person_uid: string) => {
    return groups.find((group) =>
      group.group_data.members.some(
        (member) => member.person_uid === person_uid
      )
    );
  };

  const handleExport = async () => {
    try {
      setIsProcessing(true);

      const data: SheetData = [];

      // create header
      const header_row: Row = [
        { value: t('tr_lastname', { lng }), fontWeight: 'bold' },
        { value: t('tr_firstname', { lng }), fontWeight: 'bold' },
        { value: t('tr_phoneNumber', { lng }), fontWeight: 'bold' },
        { value: t('tr_address', { lng }), fontWeight: 'bold' },
        { value: t('tr_emergencyContacts', { lng }), fontWeight: 'bold' },
        { value: t('tr_fieldServiceGroup', { lng }), fontWeight: 'bold' },
        { value: t('tr_spiritualStatus', { lng }), fontWeight: 'bold' },
        { value: t('tr_privileges', { lng }), fontWeight: 'bold' },
        { value: t('tr_enrollments', { lng }), fontWeight: 'bold' },
      ];
      function getPersonEnrollments(person) {
        const enrollments = (person.person_data.enrollments || []).filter(
          (e) => !e._deleted
        );
        const active = enrollments.find((e) => !e.endDate);
        if (!active) return '';
        if (active.enrollment === 'AP') return t('tr_AP', { lng });
        if (active.enrollment === 'FR') return t('tr_FR', { lng });
        if (active.enrollment === 'FS') return t('tr_FS', { lng });
        if (active.enrollment === 'FMF') return t('tr_FMF', { lng });
        return '';
      }
      function getPersonPrivileges(person) {
        const privileges = (person.person_data.privileges || []).filter(
          (p) => !p._deleted
        );
        const active = privileges.find((p) => !p.endDate);
        if (!active) return '';
        if (active.privilege === 'elder') return 'Elder';
        if (active.privilege === 'ms') return 'Ministry Servant';
        return '';
      }

      data.push(header_row);

      function getSpiritualStatus(person): string {
        const pd = person.person_data;
        // Helper to get last non-deleted history item
        function getLastHistory(history) {
          return history
            .filter((h) => !h._deleted)
            .sort((a, b) => {
              const aDate = a.start_date || a.date || '';
              const bDate = b.start_date || b.date || '';
              return aDate > bDate ? 1 : aDate < bDate ? -1 : 0;
            })
            .at(-1);
        }

        const isBaptized = !!pd.publisher_baptized?.active?.value;
        const isUnbaptized = !!pd.publisher_unbaptized?.active?.value;

        // 1. Inactive Publisher (check only the relevant history)
        if (isBaptized) {
          const baptizedHistory = pd.publisher_baptized?.history || [];
          const lastBaptized = getLastHistory(baptizedHistory);
          if (
            baptizedHistory.length === 0 ||
            (lastBaptized && lastBaptized.end_date)
          ) {
            return t('tr_inactivePublisher', { lng });
          }
        } else if (isUnbaptized) {
          const unbaptizedHistory = pd.publisher_unbaptized?.history || [];
          const lastUnbaptized = getLastHistory(unbaptizedHistory);
          if (
            unbaptizedHistory.length === 0 ||
            (lastUnbaptized && lastUnbaptized.end_date)
          ) {
            return t('tr_inactivePublisher', { lng });
          }
        } else {
          // If neither, check both histories for inactivity
          const baptizedHistory = pd.publisher_baptized?.history || [];
          const lastBaptized = getLastHistory(baptizedHistory);
          const unbaptizedHistory = pd.publisher_unbaptized?.history || [];
          const lastUnbaptized = getLastHistory(unbaptizedHistory);
          if (
            (baptizedHistory.length === 0 ||
              (lastBaptized && lastBaptized.end_date)) &&
            (unbaptizedHistory.length === 0 ||
              (lastUnbaptized && lastUnbaptized.end_date))
          ) {
            return t('tr_inactivePublisher', { lng });
          }
        }

        // 2. Anointed
        if (
          pd.publisher_baptized?.active?.value &&
          pd.publisher_baptized?.anointed?.value
        ) {
          return t('tr_anointed', { lng });
        }

        // 3. Baptized Publisher
        if (
          pd.publisher_baptized?.active?.value &&
          !pd.publisher_baptized?.anointed?.value
        ) {
          return t('tr_baptizedPublisher', { lng });
        }

        // 4. Unbaptized Publisher
        if (pd.publisher_unbaptized?.active?.value) {
          return t('tr_unbaptizedPublisher', { lng });
        }

        // 5. Midweek Meeting Student
        if (pd.midweek_meeting_student?.active?.value) {
          return t('tr_midweekMeetingStudent', { lng });
        }

        return '';
      }

      const persons_row = persons
        .filter(
          (person) =>
            person.person_data.publisher_baptized.active.value ||
            person.person_data.publisher_unbaptized.active.value
        )
        .map((person) => {
          const group = personGetGroup(person.person_uid);

          let groupName = '';

          if (group) {
            groupName = group.group_data.name;

            if (groupName.length === 0) {
              groupName = t('tr_groupNumber', {
                lng,
                groupNumber: group.group_data.sort_index + 1,
              });
            }
          }

          const emergencyContacts = person.person_data.emergency_contacts
            .filter((record) => !record._deleted)
            .reduce((acc: string[], current) => {
              if (current.name.length > 0 && current.contact.length > 0) {
                acc.push(`${current.name} (${current.contact})`);
              }

              return acc;
            }, []);

          const spiritualStatus = getSpiritualStatus(person);
          const personPrivileges = getPersonPrivileges(person);
          const personEnrollments = getPersonEnrollments(person);

          return [
            { value: person.person_data.person_lastname.value },
            { value: person.person_data.person_firstname.value },
            { value: person.person_data.phone.value, type: String },
            { value: person.person_data.address.value },
            { value: emergencyContacts.join('; ') },
            { value: groupName },
            { value: spiritualStatus },
            { value: personPrivileges },
            { value: personEnrollments },
          ] as Row;
        });

      data.push(...persons_row);

      await writeXlsxFile(data, {
        fileName: 'persons-list.xlsx',
        stickyRowsCount: 1,
        columns: [
          { width: 30 },
          { width: 30 },
          { width: 20 },
          { width: 45 },
          { width: 25 },
          { width: 25 },
          { width: 30 },
          { width: 30 },
          { width: 30 },
        ],
      });

      setIsProcessing(false);
    } catch (error) {
      console.error(error);

      setIsProcessing(false);

      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: error.message,
        severity: 'error',
        icon: <IconError color="var(--white)" />,
      });
    }
  };
  return { handleExport, isProcessing };
};

export default useExportPersons;
