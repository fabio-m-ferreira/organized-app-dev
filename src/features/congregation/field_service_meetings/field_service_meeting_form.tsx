import { useState, type FC } from 'react';
import { Box } from '@mui/material';
import { IconCheck, IconClose, IconSearch } from '@components/icons';
import Button from '@components/button';
import Typography from '@components/typography';
import Select from '@components/select';
import MenuItem from '@components/menuitem';
import DatePicker from '@components/date_picker';
import TimePicker from '@components/time_picker';
import Divider from '@components/divider';
import TextField from '@components/textfield';
import { useAppTranslation } from '@hooks/index';
import Autocomplete from '@components/autocomplete';
import usePersons from '@features/persons/hooks/usePersons';
import useFieldServiceGroups from '@features/congregation/field_service_groups/useFieldServiceGroups';
import { formatDate } from '@utils/date';
import { buildPersonFullname } from '@utils/common';

const meetingTypeList = [
  'Joint meeting',
  'Field service group meeting',
  'Zoom',
] as const;

export type MeetingType = (typeof meetingTypeList)[number];

export interface FieldServiceMeetingFormValues {
  meetingType?: MeetingType;
  selectedGroup?: string;
  conductor?: string;
  assistant?: string;
  date?: Date;
  time?: Date;
  materials?: string;
}

type FieldServiceMeetingFormProps = {
  handleCloseForm: () => void;
  initialValues?: FieldServiceMeetingFormValues;
};

const FieldServiceMeetingForm: FC<FieldServiceMeetingFormProps> = ({
  handleCloseForm,
  initialValues,
}) => {
  const { t } = useAppTranslation();
  // Use initialValues for edit mode, fallback to defaults for add mode
  const [meetingType, setMeetingType] = useState<MeetingType>(
    initialValues?.meetingType ?? meetingTypeList[0]
  );
  const [selectedGroup, setSelectedGroup] = useState<string>(
    initialValues?.selectedGroup ?? ''
  );
  const [conductor, setConductor] = useState<string>(
    initialValues?.conductor ?? ''
  );
  const [assistant, setAssistant] = useState<string>(
    initialValues?.assistant ?? ''
  );
  const [date, setDate] = useState<Date>(initialValues?.date ?? new Date());
  const [time, setTime] = useState<Date>(
    initialValues?.time ?? new Date('2023-11-19T12:00:00')
  );
  const [materials, setMaterials] = useState<string>(
    initialValues?.materials ?? ''
  );

  // Get all groups and persons
  const { groups_list } = useFieldServiceGroups();
  const { getAppointedBrothers } = usePersons();
  const currentMonth = formatDate(new Date(), 'yyyy/MM');
  const appointedBrothers = getAppointedBrothers(currentMonth);

  // Conductor options logic
  let brotherOptions: string[] = [];
  if (meetingType === 'Field service group meeting' && selectedGroup) {
    const group = groups_list.find((g) => g.group_data.name === selectedGroup);
    if (group) {
      const groupMemberUIDs = group.group_data.members.map((m) => m.person_uid);
      brotherOptions = appointedBrothers
        .filter((person) => groupMemberUIDs.includes(person.person_uid))
        .map((person) =>
          buildPersonFullname(
            person.person_data.person_lastname.value,
            person.person_data.person_firstname.value
          )
        );
    }
  } else {
    brotherOptions = appointedBrothers.map((person) =>
      buildPersonFullname(
        person.person_data.person_lastname.value,
        person.person_data.person_firstname.value
      )
    );
  }

  // Get all group names from field service groups
  const groupOptions = groups_list.map((group) => group.group_data.name);

  return (
    <Box
      sx={{
        display: 'flex',
        gap: '16px',
        flexDirection: 'column',
        border: '1px solid var(--accent-300)',
        borderRadius: 'var(--radius-xl)',
        padding: '24px',
        backgroundColor: 'var(--white)',
      }}
    >
      <Typography className="h3" color="var(--black)">
        {t('tr_addFieldServiceMeeting')}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <Select
          label={t('tr_type')}
          value={meetingType}
          onChange={(e) => setMeetingType(e.target.value as MeetingType)}
          sx={{ minWidth: 180 }}
        >
          {meetingTypeList.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </Select>
        {meetingType === 'Field service group meeting' && (
          <Select
            label={t('tr_group')}
            value={selectedGroup ?? ''}
            onChange={(e) => setSelectedGroup(e.target.value as string)}
            sx={{ minWidth: 180 }}
          >
            {groupOptions.length === 0 ? (
              <MenuItem value="">{t('tr_noOptions')}</MenuItem>
            ) : (
              groupOptions.map((name) => (
                <MenuItem key={name} value={name}>
                  {name}
                </MenuItem>
              ))
            )}
          </Select>
        )}

        <Autocomplete
          label={t('tr_conductor')}
          value={conductor}
          options={brotherOptions}
          onChange={(_, value) => {
            if (typeof value === 'string') setConductor(value);
            else setConductor('');
          }}
          endIcon={<IconSearch />}
        />
        {meetingType === 'Joint meeting' && (
          <Autocomplete
            label={t('tr_assistant')}
            value={assistant}
            options={brotherOptions}
            onChange={(_, value) => {
              if (typeof value === 'string') setAssistant(value);
              else setAssistant('');
            }}
            endIcon={<IconSearch />}
          />
        )}
      </Box>
      <Divider color="var(--accent-200)" />
      <Typography className="h4" color="var(--grey-400)">
        {t('tr_details')}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          gap="16px"
          justifyContent="space-between"
          flex={1}
        >
          <DatePicker
            sx={{ flex: 1, height: '48px' }}
            label="Date"
            value={date}
            onChange={setDate}
          />
          <TimePicker
            sx={{ flex: 1, height: '48px' }}
            label="Time"
            ampm={false}
            value={time}
            onChange={setTime}
          />
        </Box>
        {/* Removed location and address fields */}
      </Box>
      <TextField
        label={t('tr_meetingMaterials')}
        height={48}
        value={materials}
        onChange={(e) => setMaterials(e.target.value)}
      />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'right',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <Button
          variant="secondary"
          startIcon={<IconClose />}
          color="red"
          onClick={handleCloseForm}
        >
          {t('tr_cancel')}
        </Button>
        <Button
          variant="secondary"
          startIcon={<IconCheck />}
          onClick={handleCloseForm}
        >
          {t('tr_done')}
        </Button>
      </Box>
    </Box>
  );
};

export default FieldServiceMeetingForm;
