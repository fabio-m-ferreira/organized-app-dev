import React, { useState, Fragment } from 'react';
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
import MeetingItem from '@features/congregation/field_service_meetings/meeting_item';
import Accordion from '@components/accordion';
import { getWeekDate } from '@utils/date';
import FieldServiceMeetingForm from '@features/congregation/field_service_meetings/field_service_meeting_form/fieldServiceMeetingForm';
import { FieldServiceMeetingDataType } from '@definition/field_service_meetings';
import i18n from '@services/i18n';
import ScheduleExport from '@features/congregation/field_service_meetings/schedule_export';
import FieldMeetingsPublish from '@features/congregation/field_service_meetings/publish';

const MeetingAttendance = () => {
  const { t } = useAppTranslation();
  const appLocale = i18n?.language || navigator.language;
  const [filterId, setFilterId] = useState<string | null>('all');
  const [showPast, setShowPast] = useState(false);
  const [openExport, setOpenExport] = useState(false);

  const { isFieldServiceEditor, my_group } = useCurrentUser();

  const {
    monthsTab,
    handleMonthChange,
    initialValue,
    filteredMeetings,
    emptyMeeting,
    handleSaveMeeting,
    handleShowAddMeetingBox,
    handleHideAddMeetingBox,
    addMeetingBoxShow,
    isConnected,
    openPublish,
    handleOpenPublish,
    handleClosePublish,
  } = useFieldServiceMeetings();

  const filters = [
    { value: 'all', label: t('tr_fieldServiceAll') },
    { value: 'group', label: t('tr_myGroup') },
    { value: 'joint', label: t('tr_joint') },
    { value: 'zoom', label: t('tr_zoom') },
  ];

  // Shared filter function for meetings
  function meetingFilter(item: FieldServiceMeetingDataType) {
    if (!filterId) return true; // No filter selected, show all meetings

    const meeting = item.meeting_data;
    if (filterId === 'all') {
      // Show user's group, joint, and zoom meetings
      if (meeting.type === 'joint' || meeting.type === 'zoom') return true;
      if (
        meeting.type === 'group' &&
        my_group &&
        meeting.group === my_group.group_data.name
      )
        return true;
      return false;
    }
    if (filterId === 'joint') return meeting.type === 'joint';
    if (filterId === 'group')
      return (
        meeting.type === 'group' &&
        my_group &&
        meeting.group === my_group.group_data.name
      );
    if (filterId === 'zoom') return meeting.type === 'zoom';

    return true;
  }

  function openScheduleExport(
    event: React.MouseEvent<HTMLAnchorElement>
  ): void {
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
      {isConnected && openPublish && (
        <FieldMeetingsPublish open={openPublish} onClose={handleClosePublish} />
      )}

      <PageTitle
        title={t('tr_fieldServiceMeetings')}
        buttons={
          isFieldServiceEditor && (
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
                onClick={handleShowAddMeetingBox}
                startIcon={<IconAdd />}
              >
                {t('tr_add')}
              </Button>
              <Button
                variant="main"
                startIcon={<IconEventAvailable color="white" />}
                onClick={handleOpenPublish}
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
                key={filter.value}
                label={filter.label}
                selected={filter.value === filterId}
                onClick={() =>
                  setFilterId(filter.value === filterId ? null : filter.value)
                }
              />
            ))}
          </Box>
        </Box>
      </Box>

      {addMeetingBoxShow && (
        <FieldServiceMeetingForm
          data={emptyMeeting}
          type="add"
          onSave={handleSaveMeeting}
          onCancel={handleHideAddMeetingBox}
        />
      )}
      <Fragment>
        {(() => {
          const meetings = filteredMeetings.filter(meetingFilter);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          // Split meetings into future and past
          const futureMeetings: FieldServiceMeetingDataType[] = [];
          const pastMeetings: FieldServiceMeetingDataType[] = [];
          meetings.forEach((item) => {
            if (new Date(item.meeting_data.date) >= today) {
              futureMeetings.push(item);
            } else {
              pastMeetings.push(item);
            }
          });

          // Group by week
          function groupByWeek(meetingList: FieldServiceMeetingDataType[]) {
            const weekGroups: Record<string, FieldServiceMeetingDataType[]> =
              {};
            meetingList.forEach((item) => {
              const weekStart = getWeekDate(new Date(item.meeting_data.date));
              const key = weekStart.toISOString().slice(0, 10);
              if (!weekGroups[key]) weekGroups[key] = [];
              weekGroups[key].push(item);
            });
            return weekGroups;
          }

          // Render grouped meetings
          function renderGroupedMeetings(
            meetingList: FieldServiceMeetingDataType[]
          ) {
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
                    {weekStart.toLocaleDateString(appLocale, {
                      day: 'numeric',
                      month: 'long',
                    })}
                    {' – '}
                    {weekEnd.toLocaleDateString(appLocale, {
                      day: 'numeric',
                      month: 'long',
                    })}
                  </Box>
                  {weekGroups[weekKey].map((item) => (
                    <MeetingItem key={item.meeting_uid} {...item} />
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
              {futureMeetings.length === 0 && (
                <InfoTip
                  isBig={false}
                  icon={<IconInfo />}
                  color="blue"
                  text={t('tr_noFieldServiceMeetings')}
                />
              )}
              {pastMeetings.length > 0 && pastContent}
            </>
          );
        })()}
      </Fragment>
    </Box>
  );
};

export default MeetingAttendance;
