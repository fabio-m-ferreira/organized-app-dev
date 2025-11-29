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
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import Autocomplete from '@components/autocomplete';
import usePersons from '@features/persons/hooks/usePersons';
import useFieldServiceGroups from '@features/congregation/field_service_groups/useFieldServiceGroups';
import { formatDate } from '@utils/date';
import { buildPersonFullname } from '@utils/common';
import useFieldServiceMeetingForm from './useFieldServiceMeetingForm';
import { FieldServiceMeetingFormProps } from '@definition/field_service_meetings';

const FieldServiceMeetingForm = (props: FieldServiceMeetingFormProps) => {
  const { t } = useAppTranslation();
  const { laptopDown } = useBreakpoints();
  const {
    localMeeting,
    errors,
    handleChangeType,
    handleChangeGroup,
    handleChangeConductor,
    handleChangeAssistant,
    handleChangeDate,
    handleChangeTime,
    handleChangeMaterials,
    handleSaveMeeting,
    handleChangeLocation,
  } = useFieldServiceMeetingForm(props);

  // Meeting type list with localized labels
  const meetingTypeList = [
    { value: 'joint', label: t('tr_jointMeeting') },
    { value: 'group', label: t('tr_groupMeeting') },
    { value: 'zoom', label: t('tr_zoom') },
  ];
  // Use initialValues for edit mode, fallback to defaults for add mode
  const meetingType = localMeeting.meeting_data.type ?? 'joint';
  const selectedGroup = localMeeting.meeting_data.group ?? '';

  // Get all groups and persons
  const { groups_list } = useFieldServiceGroups();

  const { getAppointedBrothers } = usePersons();
  const currentMonth = formatDate(new Date(), 'yyyy/MM');
  const appointedBrothers = getAppointedBrothers(currentMonth);

  // Build options as { id: person_uid, label: full name }
  const brotherOptions = appointedBrothers.map((person) => ({
    id: person.person_uid,
    label: buildPersonFullname(
      person.person_data.person_lastname.value,
      person.person_data.person_firstname.value
    ),
  }));

  const locationValue = localMeeting.meeting_data.location ?? '';

  // Prevent duplicates in conductor/assistant
  const conductorId = localMeeting.meeting_data.conductor ?? '';
  const assistantId = localMeeting.meeting_data.assistant ?? '';
  const conductorValue =
    brotherOptions.find((o) => o.id === conductorId) || null;
  const assistantValue =
    brotherOptions.find((o) => o.id === assistantId) || null;
  const conductorOptions = brotherOptions.filter(
    (option) => option.id !== assistantId
  );
  const assistantOptions = brotherOptions.filter(
    (option) => option.id !== conductorId
  );

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
        {props.type === 'add'
          ? t('tr_addFieldServiceMeeting')
          : t('tr_editFieldServiceMeeting')}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: '16px',
          flexDirection: laptopDown ? 'column' : 'row',
        }}
      >
        <Select
          label={t('tr_type')}
          value={meetingType}
          onChange={handleChangeType}
          error={errors.type}
          helperText={errors.type && t('tr_fillRequiredField')}
          sx={{ minWidth: 180 }}
        >
          {meetingTypeList.map((type) => (
            <MenuItem key={type.value} value={type.value}>
              {type.label}
            </MenuItem>
          ))}
        </Select>
        {meetingType === 'group' && (
          <Select
            label={t('tr_group')}
            value={selectedGroup}
            onChange={handleChangeGroup}
            error={errors.group}
            helperText={errors.group && t('tr_fillRequiredField')}
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
          value={conductorValue}
          options={conductorOptions}
          getOptionLabel={(option) =>
            typeof option === 'object' && option !== null ? option.label : ''
          }
          isOptionEqualToValue={(option, value) =>
            typeof option === 'object' &&
            option !== null &&
            typeof value === 'object' &&
            value !== null &&
            option.id === value.id
          }
          onChange={(_, value) => {
            if (value && !Array.isArray(value) && typeof value === 'object') {
              handleChangeConductor(null, value.id);
            } else {
              handleChangeConductor(null, '');
            }
          }}
          error={errors.conductor}
          helperText={errors.conductor && t('tr_fillRequiredField')}
          endIcon={<IconSearch />}
        />
        {meetingType === 'joint' && (
          <Autocomplete
            label={t('tr_assistant')}
            value={assistantValue}
            options={assistantOptions}
            getOptionLabel={(option) =>
              typeof option === 'object' && option !== null ? option.label : ''
            }
            isOptionEqualToValue={(option, value) =>
              typeof option === 'object' &&
              option !== null &&
              typeof value === 'object' &&
              value !== null &&
              option.id === value.id
            }
            onChange={(_, value) => {
              if (value && !Array.isArray(value) && typeof value === 'object') {
                handleChangeAssistant(null, value.id);
              } else {
                handleChangeAssistant(null, '');
              }
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
        display="flex"
        alignItems="center"
        gap="16px"
        justifyContent="space-between"
        flex={1}
        flexDirection={laptopDown ? 'column' : 'row'}
      >
        <DatePicker
          sx={{ flex: 1 }}
          label={t('tr_date')}
          value={new Date(localMeeting.meeting_data.date)}
          onChange={handleChangeDate}
        />
        <TimePicker
          label={t('tr_time')}
          ampm={false}
          value={new Date(localMeeting.meeting_data.date)}
          onChange={handleChangeTime}
        />
        {meetingType === 'group' && (
          <TextField
            sx={{ flex: 1 }}
            label={t('tr_location')}
            value={locationValue}
            onChange={(e) => handleChangeLocation(e, e.target.value)}
          />
        )}
      </Box>
      <TextField
        label={t('tr_material')}
        value={localMeeting.meeting_data.materials}
        onChange={handleChangeMaterials}
        error={errors.materials}
        helperText={errors.materials && t('tr_fillRequiredField')}
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
          onClick={props.onCancel}
        >
          {t('tr_cancel')}
        </Button>
        <Button
          variant="secondary"
          startIcon={<IconCheck />}
          onClick={handleSaveMeeting}
        >
          {t('tr_done')}
        </Button>
      </Box>
    </Box>
  );
};

export default FieldServiceMeetingForm;
