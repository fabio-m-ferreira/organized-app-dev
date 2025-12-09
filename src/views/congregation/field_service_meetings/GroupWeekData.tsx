import { FieldServiceGroupType } from '@definition/field_service_groups';
import { FieldServiceMeetingDataType } from '@definition/field_service_meetings';
import { View, Text } from '@react-pdf/renderer';

export const GroupWeekData = ({
  meetings,
  lang,
  groupsList,
  getPersonDisplay,
}: {
  meetings: FieldServiceMeetingDataType[];
  lang: string;
  groupsList: FieldServiceGroupType[];
  getPersonDisplay: (value: string) => string;
}) => {
  const allGroups = groupsList;
  // Get group names from global state
  const groupNames = allGroups.map((g) => g.group_data.name);

  // Helper to get day key (YYYY-MM-DD)
  function getDayKey(dateStr) {
    const d = new Date(dateStr);
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  }

  const formatDate = (dateStr, lang) => {
    const dateObj = new Date(dateStr);
    const formatted = dateObj.toLocaleDateString(lang || 'pt-PT', {
      day: 'numeric',
      weekday: 'short',
      month: 'short',
    });
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  };
  const formatTime = (dateStr, lang) => {
    const dateObj = new Date(dateStr);
    return dateObj.toLocaleTimeString(lang || 'pt-PT', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  // Group meetings by day
  const groupMeetingsRaw = meetings.filter(
    (m) => m.meeting_data.type === 'group'
  );
  const meetingsByDay = {};
  groupMeetingsRaw.forEach((item) => {
    const dayKey = getDayKey(item.meeting_data.date);
    if (!meetingsByDay[dayKey]) meetingsByDay[dayKey] = [];
    meetingsByDay[dayKey].push(item);
  });

  // Sort each day's meetings by group order
  let groupMeetings: FieldServiceMeetingDataType[] = [];
  Object.keys(meetingsByDay)
    .sort((a, b) => {
      // Sort by actual date value, not string
      const aDate = new Date(a);
      const bDate = new Date(b);
      return aDate.getTime() - bDate.getTime();
    })
    .forEach((dayKey) => {
      const meetings = meetingsByDay[dayKey];
      meetings.sort((a, b) => {
        const aIdx = groupNames.indexOf(a.meeting_data.group);
        const bIdx = groupNames.indexOf(b.meeting_data.group);
        return aIdx - bIdx;
      });
      groupMeetings = [...groupMeetings, ...meetings];
    });

  const filteredGroupMeetings = groupMeetings.filter((_, idx) => idx % 2 === 0);

  return (
    <View style={{ marginTop: 16 }}>
      <View
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 6,
          backgroundColor: '#6876BE',
          borderTopLeftRadius: '5px',
          borderTopRightRadius: '5px',
          width: '27%',
        }}
      >
        <Text
          style={{
            fontSize: 11,
            fontWeight: 'bold',
            color: 'white',
          }}
        >
          Saídas de grupo
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'column',
          width: '100%',
          borderWidth: 1,
          borderColor: '#D5DFFD',
          marginBottom: 16,
          borderRadius: '5px',
          borderTopLeftRadius: 0,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: '#D5DFFD',
            borderBottomWidth: 1,
            borderColor: '#D5DFFD',
            color: '#3B4CA3',
            overflow: 'hidden',
            borderTopRightRadius: '2px',
          }}
        >
          <Text
            style={{ flex: 0.8, fontSize: 10, fontWeight: 'bold', padding: 4 }}
          >
            Data
          </Text>
          <Text
            style={{ flex: 1, fontSize: 10, fontWeight: 'bold', padding: 4 }}
          >
            Dirigente
          </Text>
          <Text
            style={{ flex: 1, fontSize: 10, fontWeight: 'bold', padding: 4 }}
          >
            Local
          </Text>
          <Text
            style={{ flex: 2.2, fontSize: 10, fontWeight: 'bold', padding: 4 }}
          >
            Matéria
          </Text>
          <Text
            style={{ flex: 1, fontSize: 10, fontWeight: 'bold', padding: 4 }}
          >
            Grupo
          </Text>
        </View>
        {filteredGroupMeetings.length === 0 ? (
          <View style={{ padding: 8 }}>
            <Text style={{ fontSize: 10, color: '#888' }}>
              Nenhuma reunião de grupo
            </Text>
          </View>
        ) : (
          filteredGroupMeetings.map((meeting, idx) => {
            const otherGroup = groupMeetings[idx * 2 + 1];
            const otherGroupName = otherGroup
              ? otherGroup.meeting_data.group
              : null;
            const m = meeting.meeting_data;
            const isOdd = idx % 2 === 1;
            const cellBorder = {
              borderRightWidth: 1,
              borderRightColor: '#D5DFFD',
              height: '100%',
            };
            const isLast = idx === filteredGroupMeetings.length - 1;
            return (
              <View
                key={meeting.meeting_uid || idx}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  backgroundColor: isOdd ? '#F2F5FF' : undefined,
                  borderBottomLeftRadius: isLast ? 4 : 0,
                  borderBottomRightRadius: isLast ? 4 : 0,
                  borderBottom: isLast ? 'none' : '1px solid #D5DFFD',
                }}
              >
                {/* Date cell */}
                <View
                  style={{
                    flex: 0.8,
                    padding: 4,
                    height: '100%',
                    justifyContent: 'center',
                    ...cellBorder,
                  }}
                >
                  <View style={{ justifyContent: 'center' }}>
                    <Text style={{ fontSize: 10 }}>
                      {formatDate(m.date, lang)}
                    </Text>
                    <Text style={{ fontSize: 10 }}>
                      {formatTime(m.date, lang)}
                    </Text>
                  </View>
                </View>
                {/* Dirigente cell */}
                <View
                  style={{
                    flex: 1,
                    padding: 4,
                    height: '100%',
                    justifyContent: 'center',
                    ...cellBorder,
                  }}
                >
                  <Text style={{ fontSize: 10 }}>
                    {getPersonDisplay(m.conductor) || m.conductor || '-'}
                  </Text>
                </View>
                {/* Local cell */}
                <View
                  style={{
                    flex: 1,
                    padding: 4,
                    height: '100%',
                    justifyContent: 'center',
                    ...cellBorder,
                  }}
                >
                  <Text style={{ fontSize: 10 }}>
                    {m.location || 'Salão do Reino'}
                  </Text>
                </View>
                {/* Matéria cell */}
                <View
                  style={{
                    flex: 2.2,
                    padding: 4,
                    height: '100%',
                    justifyContent: 'center',
                    ...cellBorder,
                  }}
                >
                  <Text style={{ fontSize: 10 }}>{m.materials || '-'}</Text>
                </View>
                {/* Grupo cell */}
                <View
                  style={{
                    flex: 1,
                    padding: 4,
                    height: '100%',
                    justifyContent: 'center',
                  }}
                >
                  <Text
                    style={{ fontSize: 10 }}
                  >{`${m.group}, ${otherGroupName || ''}`}</Text>
                </View>
              </View>
            );
          })
        )}
      </View>
    </View>
  );
};
