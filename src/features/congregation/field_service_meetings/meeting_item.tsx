import { useState } from 'react';
import { Box } from '@mui/material';
import { Menu } from '@mui/material';
import MenuItem from '@components/menuitem';
import {
  IconAtHome,
  IconEdit,
  IconMore,
  IconTalk,
  IconVisitors,
  IconDelete,
  IconJwHome,
} from '@components/icons';
import Button from '@components/button';
import Typography from '@components/typography';
import { useAppTranslation } from '@hooks/index';
import GroupBadge from '@components/group_badge';
import FieldServiceMeetingForm from './field_service_meeting_form/fieldServiceMeetingForm';
import { FieldServiceMeetingDataType } from '@definition/field_service_meetings';
import useFieldServiceMeetings from './useFieldServiceMeetings';
import useFieldServiceMeetingForm from './field_service_meeting_form/useFieldServiceMeetingForm';
import useCurrentUser from '@hooks/useCurrentUser';
import { useAtomValue } from 'jotai';
import { fieldWithLanguageGroupsState } from '@states/field_service_groups';

const MeetingItem = (data: FieldServiceMeetingDataType) => {
  const { t, i18n } = useAppTranslation();
  const appLocale = i18n?.language || navigator.language;
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(menuAnchorEl);

  const { date, type, group, conductor, assistant, location, materials } =
    data.meeting_data;

  const {
    handleSaveMeeting,
    handleHideAddMeetingBox,
    handleShowAddMeetingBox,
    addMeetingBoxShow,
  } = useFieldServiceMeetings();

  const { handleDeleteMeeting } = useFieldServiceMeetingForm({
    data,
    onSave: handleSaveMeeting,
  });

  const { isFieldServiceEditor } = useCurrentUser();

  const groupColors: Record<string, string> = {
    'Passos Esteves': 'group-1',
    Esteveira: 'group-2',
    'Bairro da Câmara': 'group-3',
    'Salão 1': 'group-4',
    'Salão 2': 'group-5',
  };

  const allGroups = useAtomValue(fieldWithLanguageGroupsState);
  const groupNames = allGroups.map((g) => g.group_data.name);
  const groupIndex = groupNames.indexOf(group);
  const groupColor = `group-${groupIndex + 1}`;

  const meetingDate = new Date(date);

  if (addMeetingBoxShow) {
    return (
      <FieldServiceMeetingForm
        data={data}
        type="edit"
        onSave={(data) => {
          handleSaveMeeting(data);
          setMenuAnchorEl(null);
        }}
        onCancel={() => {
          handleHideAddMeetingBox();
          setMenuAnchorEl(null);
        }}
      />
    );
  }

  return (
    <Box
      className="meeting-item"
      key={data.meeting_uid}
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
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '15px',
        }}
      >
        <Box display="flex" alignItems="center">
          <Typography
            className="h3"
            sx={{ '&::first-letter': { textTransform: 'capitalize' } }}
          >
            {meetingDate.toLocaleDateString(appLocale, {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </Typography>
        </Box>
        <Box display="flex" flexDirection="row">
          <Box display="flex" alignItems="center" gap="8px">
            {type === 'joint' && (
              <GroupBadge
                label={t('tr_joint')}
                color="black"
                variant="outlined"
              />
            )}
            {type === 'group' && group && (
              <GroupBadge
                label={group}
                color={groupColor || 'black'}
                variant="outlined"
              />
            )}
            {type === 'zoom' && (
              <GroupBadge
                label={t('tr_zoom')}
                color="swiper-theme-color"
                variant="outlined"
              />
            )}

            <Box className="more-button">
              {isFieldServiceEditor && (
                <Button
                  variant="small"
                  sx={{
                    marginRight: '-8px',
                    minHeight: '28px',
                    minWidth: '20px',
                    padding: 0,
                  }}
                  onClick={(e) => setMenuAnchorEl(e.currentTarget)}
                >
                  <IconMore color="var(--grey-400)" />
                </Button>
              )}
              <Menu
                anchorEl={menuAnchorEl}
                open={isMenuOpen}
                onClose={() => setMenuAnchorEl(null)}
                sx={{
                  marginTop: '8px',
                  '& li': {
                    borderBottom: '1px solid var(--accent-200)',
                  },
                  '& li:last-child': {
                    borderBottom: 'none',
                  },
                }}
                slotProps={{
                  paper: {
                    className: 'small-card-shadow',
                    style: {
                      borderRadius: 'var(--radius-l)',
                      border: '1px solid var(--accent-200)',
                      backgroundColor: 'var(--white)',
                    },
                  },
                }}
              >
                <MenuItem onClick={handleShowAddMeetingBox}>
                  <Box
                    component="span"
                    display="flex"
                    alignItems="center"
                    gap={1}
                  >
                    <IconEdit />
                    <Typography>{t('tr_edit')}</Typography>
                  </Box>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleDeleteMeeting();
                    setMenuAnchorEl(null);
                  }}
                >
                  <Box
                    component="span"
                    display="flex"
                    alignItems="center"
                    gap={1}
                  >
                    <IconDelete />
                    <Typography>{t('tr_delete')}</Typography>
                  </Box>
                </MenuItem>
              </Menu>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <Box
          sx={{
            backgroundColor: 'var(--accent-150)',
            padding: '16px 16px',
            borderRadius: 'var(--radius-l)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 0,
          }}
        >
          <Typography className="h4" color="var(--accent-dark)">
            {meetingDate.toLocaleTimeString(navigator.language, {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            })}
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            gap: '4px',
          }}
        >
          <Typography className="h4">
            <Box component="span" display="flex" alignItems="center" gap="4px">
              <IconTalk color="var(--grey-400)" /> {conductor}
            </Box>
          </Typography>
          {type === 'joint' && assistant && (
            <Typography className="body-regular" color="var(--grey-400)">
              <Box
                component="span"
                display="flex"
                alignItems="center"
                gap="4px"
              >
                <IconVisitors color="var(--grey-400)" /> {assistant}
              </Box>
            </Typography>
          )}
          {type === 'group' && (
            <Typography className="body-regular" color="var(--grey-400)">
              <Box
                component="span"
                display="flex"
                alignItems="center"
                gap="4px"
              >
                {location ? (
                  <>
                    <IconAtHome color="var(--grey-400)" /> {t('tr_house')}:{' '}
                    {location}
                  </>
                ) : (
                  <>
                    <IconJwHome color="var(--grey-400)" /> {t('tr_kingdomHall')}
                  </>
                )}
              </Box>
            </Typography>
          )}
          <Typography className="body-small-regular" color="var(--grey-400)">
            Matéria: {materials}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default MeetingItem;
