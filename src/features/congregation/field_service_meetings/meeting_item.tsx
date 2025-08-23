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
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import GroupBadge from '@components/group_badge';
import FieldServiceMeetingForm, {
  FieldServiceMeetingFormValues,
} from './field_service_meeting_form';

export type MeetingItemProps = {
  id: number;
  time: Date;
  type: 'joint' | 'group' | 'zoom'; // for each type theres a different badge
  group?: string; // Only required if type === "group"
  conductor: string;
  assistant?: string; // Only required if type === "joint"
  location?: string; // Only required if type === "group"
  materials: string;
  onEdit?: () => void;
};

const MeetingItem = ({
  id,
  time,
  type,
  group,
  conductor,
  assistant,
  location,
  materials,
}: MeetingItemProps) => {
  const { desktopUp } = useBreakpoints();
  const { t, i18n } = useAppTranslation();
  const appLocale = i18n?.language || navigator.language;
  const [isEditing, setIsEditing] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(menuAnchorEl);

  const groupColors: Record<string, string> = {
    'Passos Esteves': 'group-1',
    Esteveira: 'group-2',
    'Bairro da Camara': 'group-3',
    'Grupo Salão 1': 'group-4',
    'Grupo Salão 2': 'group-5',
  };

  if (isEditing) {
    const initialValues: FieldServiceMeetingFormValues = {
      meetingType: type,
      selectedGroup: group,
      conductor,
      assistant,
      date: time,
      time,
      materials,
    };

    return (
      <FieldServiceMeetingForm
        handleCloseForm={() => setIsEditing(false)}
        initialValues={initialValues}
      />
    );
  }

  return (
    <Box
      className="meeting-item"
      key={id}
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
            {time.toLocaleDateString(appLocale, {
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
          <Box className="edit-button">
            <Button
              variant="small"
              sx={{
                marginLeft: '8px',
                marginRight: '-8px',
                minHeight: '14px',
                minWidth: '14px',
                padding: 0,
              }}
              onClick={(e) => setMenuAnchorEl(e.currentTarget)}
            >
              <IconMore />
            </Button>
            <Menu
              anchorEl={menuAnchorEl}
              open={isMenuOpen}
              onClose={() => setMenuAnchorEl(null)}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              sx={{
                '& .MuiPaper-root': {
                  backgroundColor: 'var(--white)',
                  color: 'var(--black) !important',
                  borderRadius: 'var(--radius-l)',
                  border: '1px solid var(--accent-200)',
                  padding: '8px 0px',
                  marginTop: '2px',
                  boxShadow: 'var(--shadow-m)',
                },
                '& .MuiPaper-root .MuiSvgIcon-root': {
                  color: 'var(--black) !important',
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
            {time.toLocaleTimeString(navigator.language, {
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
