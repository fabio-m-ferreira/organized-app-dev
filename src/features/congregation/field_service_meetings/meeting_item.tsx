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
} from '@components/icons';
import Button from '@components/button';
import Typography from '@components/typography';
import { useAppTranslation } from '@hooks/index';
import GroupBadge from '@components/group_badge';
import FieldServiceMeetingForm from './field_service_meeting_form/fieldServiceMeetingForm';
import { FieldServiceMeetingDataType } from './field_service_meeting_form/index.types';

const MeetingItem = (data: FieldServiceMeetingDataType) => {
  const { t, i18n } = useAppTranslation();
  const appLocale = i18n?.language || navigator.language;
  const [isEditing, setIsEditing] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(menuAnchorEl);

  const { uid, date, type, group, conductor, assistant, location, materials } =
    data.meeting_data;

  const groupColors: Record<string, string> = {
    'Passos Esteves': 'group-1',
    Esteveira: 'group-2',
    'Bairro da Camara': 'group-3',
    'Grupo Salão 1': 'group-4',
    'Grupo Salão 2': 'group-5',
  };

  if (isEditing) {
    return (
      <FieldServiceMeetingForm
        data={{
          type,
          group,
          conductor,
          assistant,
          date,
          time: date,
          materials,
        }}
        type="edit"
        onSave={() => {
          // Handle save logic here
          setIsEditing(false);
        }}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <Box
      className="meeting-item"
      key={uid}
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
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '5px',
        }}
      >
        <Box display="flex" alignItems="center">
          <Typography
            className="h3"
            sx={{ '&::first-letter': { textTransform: 'capitalize' } }}
          >
            {date.toLocaleDateString(appLocale, {
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
                color={groupColors[group] || 'black'}
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
          </Box>
          <Box className="more-button">
            <Button
              variant="small"
              sx={{
                marginLeft: '8px',
                marginRight: '-8px',
                height: '28px',
                minWidth: '20px',
                padding: 0,
              }}
              onClick={(e) => setMenuAnchorEl(e.currentTarget)}
            >
              <IconMore color="var(--grey-400)" />
            </Button>
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
              <MenuItem
                onClick={() => {
                  setIsEditing(true);
                  setMenuAnchorEl(null);
                }}
              >
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
                  /* TODO: handle delete */ setMenuAnchorEl(null);
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
            {date.toLocaleTimeString(navigator.language, {
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
          {type === 'group' && location && (
            <Typography className="body-regular" color="var(--grey-400)">
              <Box
                component="span"
                display="flex"
                alignItems="center"
                gap="4px"
              >
                <IconAtHome color="var(--grey-400)" /> Casa: {location}
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
