import { FieldServiceMeetingDataType } from '@definition/field_service_meetings';
import { View, Text } from '@react-pdf/renderer';

export const JointWeekData = ({
  meetings,
  lang,
}: {
  meetings: FieldServiceMeetingDataType[];
  lang: string;
}) => {
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

  // Filter meetings by type
  const jointMeetings = meetings.filter(
    (meeting) => meeting.meeting_data.type === 'joint'
  );
  const zoomMeetings = meetings.filter(
    (meeting) => meeting.meeting_data.type === 'zoom'
  );

  // Table rendering helper
  const renderTable = (title, filteredMeetings) => (
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
          {title}
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
          {/* Only show 'Ajudante' for non-zoom tables */}
          {title !== 'Saídas por Zoom' && (
            <Text
              style={{ flex: 1, fontSize: 10, fontWeight: 'bold', padding: 4 }}
            >
              Ajudante
            </Text>
          )}
          <Text
            style={{ flex: 2.2, fontSize: 10, fontWeight: 'bold', padding: 4 }}
          >
            Matéria
          </Text>
        </View>
        {filteredMeetings.length === 0 ? (
          <View style={{ padding: 8 }}>
            <Text style={{ fontSize: 10, color: '#888' }}>Nenhuma reunião</Text>
          </View>
        ) : (
          filteredMeetings.map((meeting, idx) => {
            const m = meeting.meeting_data;
            const isOdd = idx % 2 === 1;
            const cellBorder = {
              borderRightWidth: 1,
              borderRightColor: '#D5DFFD',
              height: '100%',
            };
            const isLast = idx === filteredMeetings.length - 1;
            return (
              <View
                key={meeting.meeting_uid || idx}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderColor: '#D5DFFD',
                  backgroundColor: isOdd ? '#F2F5FF' : undefined,
                  borderBottomWidth: isLast ? 0 : 1,
                  borderBottomColor: '#D5DFFD',
                  borderBottomLeftRadius: isLast ? 4 : 0,
                  borderBottomRightRadius: isLast ? 4 : 0,
                }}
              >
                {/* Date cell */}
                <View
                  style={{
                    flex: 0.8,
                    padding: 4,
                    height: '100%',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    ...cellBorder,
                  }}
                >
                  <View>
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
                    height: '100%',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    ...cellBorder,
                  }}
                >
                  <Text style={{ fontSize: 10, padding: 4 }}>
                    {m.conductor || '-'}
                  </Text>
                </View>
                {/* Only show 'Ajudante' for non-zoom tables */}
                {title !== 'Saídas por Zoom' && (
                  <View
                    style={{
                      flex: 1,
                      height: '100%',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      ...cellBorder,
                    }}
                  >
                    <Text style={{ fontSize: 10, padding: 4 }}>
                      {m.assistant || '-'}
                    </Text>
                  </View>
                )}
                {/* Matéria cell (no separator at end) */}
                <View
                  style={{
                    flex: 2.2,
                    height: '100%',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                  }}
                >
                  <Text style={{ fontSize: 10, padding: 4 }}>
                    {m.materials || '-'}
                  </Text>
                </View>
              </View>
            );
          })
        )}
      </View>
    </View>
  );

  return (
    <>
      {renderTable('Saídas Congregacionais', jointMeetings)}
      {zoomMeetings.length > 0 && renderTable('Saídas por Zoom', zoomMeetings)}
    </>
  );
};
