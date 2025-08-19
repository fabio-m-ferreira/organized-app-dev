import { useState, MouseEvent, Fragment } from 'react';
import useFieldServiceMeetings from '@features/congregation/field_service_meetings/useFieldServiceMeetings';
import { Box } from '@mui/material';
import ScrollableTabs from '@components/scrollable_tabs';
import {
  IconAdd,
  IconEventAvailable,
  IconInfo,
  IconPrint,
} from '@components/icons';
import Button from '@components/button';
import PageTitle from '@components/page_title';
import InfoTip from '@components/info_tip';
import FilterChip from '@components/filter_chip';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import MeetingItem, {
  MeetingItemProps,
} from '@features/congregation/field_service_meetings/meeting_item';
import Accordion from '@components/accordion';
import { mockMeetings } from '@features/congregation/field_service_meetings/mock_meetings';
import { getWeekDate } from '@utils/date';
import FieldServiceMeetingForm from '@features/congregation/field_service_meetings/field_service_meeting_form';
import ScheduleExport from '@features/congregation/field_service_meetings/schedule_export';

const filters = [
  { id: 1, name: 'All' },
  { id: 2, name: 'My group' },
  { id: 3, name: 'Joint' },
  { id: 4, name: 'Zoom' },
];

const MeetingAttendance = () => {
  // Shared filter function for meetings
  function meetingFilter(item: (typeof mockMeetings)[0]) {
    if (!filterId) return true; // No filter selected, show all meetings
    if (filterId === 'All') {
      // Show user's group, joint, and zoom meetings
      if (item.type === 'joint' || item.type === 'zoom') return true;
      if (
        item.type === 'group' &&
        my_group &&
        item.group === my_group.group_data.name
      )
        return true;
      return false;
    }
    if (filterId === 'Joint') return item.type === 'joint';
    if (filterId === 'My group')
      return (
        item.type === 'group' &&
        my_group &&
        item.group === my_group.group_data.name
      );
    if (filterId === 'Zoom') return item.type === 'zoom';

    return true;
  }
  const { t } = useAppTranslation();
  const [isAddingNewMeeting, setIsAddingNewMeeting] = useState(false);
  const [filterId, setFilterId] = useState<string | null>('All');
  const [openExport, setOpenExport] = useState(false);
  const [showPast, setShowPast] = useState(false);

  const { isSecretary, isGroup, my_group } = useCurrentUser();

  const { monthsTab, handleMonthChange, initialValue, selectedMonth } =
    useFieldServiceMeetings();

  function openScheduleExport(event: MouseEvent<HTMLAnchorElement>): void {
    event.preventDefault();
    setOpenExport(true);
  }

  return (
    <Box
      sx={{
        display: 'flex',
        gap: '16px',
        flexDirection: 'column',
      }}
    >
      <PageTitle
        title={t('tr_fieldServiceMeetings')}
        buttons={
          !isGroup &&
          isSecretary && (
            <>
              {openExport && (
                <ScheduleExport
                  open={openExport}
                  onClose={() => setOpenExport(false)}
                />
              )}
              <Button
                variant="secondary"
                onClick={openScheduleExport}
                startIcon={<IconPrint />}
              >
                {t('tr_export')}
              </Button>
              <Button
                variant="secondary"
                onClick={() => setIsAddingNewMeeting(true)}
                startIcon={<IconAdd />}
              >
                {t('tr_add')}
              </Button>
              <Button
                variant="main"
                startIcon={<IconEventAvailable color="white" />}
              >
                {t('tr_publish')}
              </Button>
            </>
          )
        }
      />

      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          flexDirection: 'column',
          border: '1px solid var(--accent-300)',
          borderRadius: 'var(--radius-xl)',
          padding: '16px',
          backgroundColor: 'var(--white)',
        }}
        className="meeting-attendance-header"
      >
        <Box>
          <ScrollableTabs
            tabs={monthsTab}
            value={initialValue}
            onChange={handleMonthChange}
          />
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              width: '100%',
            }}
          >
            {filters.map((filter) => (
              <FilterChip
                key={filter.id}
                label={filter.name}
                selected={filter.name === filterId}
                onClick={() =>
                  setFilterId(filter.name === filterId ? null : filter.name)
                }
              />
            ))}
          </Box>
        </Box>
      </Box>

      {isAddingNewMeeting && (
        <FieldServiceMeetingForm
          handleCloseForm={() => {
            setIsAddingNewMeeting(false);
          }}
        />
      )}
      <Fragment>
        {(() => {
          const meetings = mockMeetings.filter(meetingFilter);
          const now = new Date();
          // Split meetings into future and past
          const futureMeetings: MeetingItemProps[] = [];
          const pastMeetings: MeetingItemProps[] = [];
          meetings.forEach((item) => {
            if (item.time >= now) {
              futureMeetings.push(item);
            } else {
              pastMeetings.push(item);
            }
          });

          // Group by week
          function groupByWeek(meetingList: MeetingItemProps[]) {
            const weekGroups: Record<string, MeetingItemProps[]> = {};
            meetingList.forEach((item) => {
              const weekStart = getWeekDate(new Date(item.time));
              const key = weekStart.toISOString().slice(0, 10);
              if (!weekGroups[key]) weekGroups[key] = [];
              weekGroups[key].push(item);
            });
            return weekGroups;
          }

          // Render grouped meetings
          function renderGroupedMeetings(meetingList: MeetingItemProps[]) {
            const weekGroups = groupByWeek(meetingList);
            const sortedWeekKeys = Object.keys(weekGroups).sort();
            return sortedWeekKeys.map((weekKey) => {
              const weekStart = new Date(weekKey);
              const weekEnd = new Date(weekStart);
              weekEnd.setDate(weekEnd.getDate() + 6);
              return (
                <Fragment key={weekKey}>
                  <Box
                    sx={{
                      padding: '0 16px',
                      fontWeight: 600,
                      fontSize: '1.1em',
                      color: 'var(--accent-main)',
                    }}
                  >
                    {weekStart.toLocaleDateString(navigator.language, {
                      day: 'numeric',
                      month: 'long',
                    })}
                    {' – '}
                    {weekEnd.toLocaleDateString(navigator.language, {
                      day: 'numeric',
                      month: 'long',
                    })}
                  </Box>
                  {weekGroups[weekKey].map((item) => (
                    <MeetingItem key={item.id} {...item} />
                  ))}
                </Fragment>
              );
            });
          }

          // Render future meetings
          const futureContent = renderGroupedMeetings(futureMeetings);
          // Render past meetings inside accordion
          const pastContent = (
            <Accordion
              id="past-meetings"
              label={t('tr_showPastMeetings') || 'Show past meetings'}
              onChange={(expanded) => setShowPast(!!expanded)}
              sx={{ marginTop: '24px' }}
              expanded={showPast}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  padding: '8px 0',
                }}
              >
                {renderGroupedMeetings(pastMeetings)}
              </Box>
            </Accordion>
          );

          return (
            <>
              {futureContent}
              {pastMeetings.length > 0 && pastContent}
            </>
          );
        })()}
        {mockMeetings.length === 0 && (
          <InfoTip
            isBig={false}
            icon={<IconInfo />}
            color="blue"
            text={t('tr_noFieldServiceMeetings')}
          />
        )}
      </Fragment>
    </Box>
  );
};

export default MeetingAttendance;
