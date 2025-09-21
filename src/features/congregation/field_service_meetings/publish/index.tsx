import { Box, Stack } from '@mui/material';
import IconLoading from '@components/icon_loading';
import { useAppTranslation } from '@hooks/index';
import Button from '@components/button';
import Dialog from '@components/dialog';
import Divider from '@components/divider';
import Typography from '@components/typography';
import useFieldMeetingsPublish from '../publish_dialog/useFieldMeetingsPublish';

import YearContainer from '../../../../features/meetings/schedule_publish/year_container';

export interface FieldMeetingsPublishProps {
  open: boolean;
  onClose: () => void;
}

const FieldMeetingsPublish = (props: FieldMeetingsPublishProps) => {
  const { t } = useAppTranslation();
  // Placeholder for meetings selection logic
  // const { meetingsList, handleCheckedChange, handlePublish, isProcessing } = usePublishMeetings(props);
  const {
    schedulesList,
    handleCheckedChange,
    handlePublishSchedule,
    isProcessing,
  } = useFieldMeetingsPublish(props);

  return (
    <Dialog onClose={props.onClose} open={props.open} sx={{ padding: '24px' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Typography className="h3">{t('tr_publishSchedules')}</Typography>
        <Typography color="var(--grey-400)">
          {t('tr_publishSchedulesDesc')}
        </Typography>
      </Box>

      <Stack
        direction="row"
        spacing="24px"
        divider={
          <Divider orientation="vertical" color="var(--accent-200)" flexItem />
        }
        sx={{ width: '100%', overflow: 'auto' }}
      >
        {schedulesList.length > 0 ? (
          schedulesList.map((schedule) => (
            <YearContainer
              key={schedule.year}
              data={schedule}
              onChange={handleCheckedChange}
              monthSeparator="-"
            />
          ))
        ) : (
          <Box sx={{ color: 'var(--grey-400)', padding: '24px' }}>
            {t('tr_noMeetingsToPublish')}
          </Box>
        )}
      </Stack>

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
          disabled={isProcessing}
          onClick={handlePublishSchedule}
          endIcon={isProcessing ? <IconLoading /> : null}
        >
          {t('tr_publish')}
        </Button>
        <Button variant="secondary" onClick={props.onClose}>
          {t('tr_cancel')}
        </Button>
      </Box>
    </Dialog>
  );
};

export default FieldMeetingsPublish;
