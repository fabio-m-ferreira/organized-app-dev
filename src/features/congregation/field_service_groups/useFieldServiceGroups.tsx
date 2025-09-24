import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { useBreakpoints } from '@hooks/index';
import { fieldWithLanguageGroupsState } from '@states/field_service_groups';
import { personsState } from '@states/persons';
import { buildPersonFullname } from '@utils/common';

const useFieldServiceGroups = () => {
  const { desktopUp, tablet688Up, desktopLargeUp } = useBreakpoints();

  const groups_list = useAtomValue(fieldWithLanguageGroupsState);

  const persons = useAtomValue(personsState);

  const masonry_columns = useMemo(() => {
    if (!tablet688Up) return 1;

    if (!desktopUp) return 2;

    if (!desktopLargeUp) return 3;

    return 4;
  }, [tablet688Up, desktopUp, desktopLargeUp]);

  // Get host's full name for a group by name
  const getGroupHostName = (groupName: string): string => {
    const group = groups_list.find((g) => g.group_data.name === groupName);
    if (!group) return '';
    const host = group.group_data.members.find((m) => m.isHost);
    if (!host) return '';
    const person = persons.find((p) => p.person_uid === host.person_uid);
    if (!person) return '';
    return buildPersonFullname(
      person.person_data.person_lastname.value,
      person.person_data.person_firstname.value
    );
  };

  return { masonry_columns, groups_list, getGroupHostName };
};

export default useFieldServiceGroups;
