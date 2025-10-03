import { Box } from '@mui/material';
import IconLoading from '@components/icon_loading';
import Button from '@components/button';
import Dialog from '@components/dialog';
import { useAppTranslation } from '@hooks/index';
import Typography from '@components/typography';
import YearContainer from '../../../meetings/schedule_publish/year_container';
import { ScheduleExportType } from './index.types';
import useScheduleExport from './useScheduleExport';

const ScheduleExport = ({ open, onClose }: ScheduleExportType) => {
  const { t } = useAppTranslation();

  const {
    isProcessing,
    handleExportSchedule,
    meetingsList,
    handleCheckedChange,
  } = useScheduleExport(onClose);

  return (
    <Dialog
      onClose={onClose}
      open={open}
      sx={{ padding: '32px', position: 'relative' }}
    >
      <Box
        sx={{
          display: 'flex',
          gap: '24px',
          flexDirection: 'column',
          width: '100%',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Typography className="h2">{t('tr_exportSchedule')}</Typography>
          <Typography color="var(--grey-400)">
            {t('tr_selectScheduleToExport')}
          </Typography>
        </Box>

        <Box
          sx={{ width: '100%', overflow: 'auto', display: 'flex', gap: '24px' }}
        >
          {meetingsList && meetingsList.length > 0 ? (
            meetingsList.map((schedule) => (
              <YearContainer
                key={schedule.year}
                data={schedule}
                onChange={handleCheckedChange}
                monthSeparator="-"
              />
            ))
          ) : (
            <Box sx={{ color: 'var(--grey-400)', padding: '24px' }}>
              {t('tr_noMeetingsToExport')}
            </Box>
          )}
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          width: '100%',
        }}
      >
        <Button
          variant="main"
          endIcon={isProcessing && <IconLoading />}
          onClick={handleExportSchedule}
        >
          {t('tr_export')}
        </Button>
        <Button variant="secondary" onClick={onClose}>
          {t('tr_cancel')}
        </Button>
      </Box>
    </Dialog>
  );
};

export default ScheduleExport;
