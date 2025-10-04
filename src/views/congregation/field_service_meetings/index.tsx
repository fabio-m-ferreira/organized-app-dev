import { Page } from '@react-pdf/renderer';
import { Document } from '@views/components';
import { FieldServiceMeetingTemplateType } from './index.types';
import registerFonts from '@views/registerFonts';
import Header from './Header';
import { JointWeekData } from './JointWeekData';
import styles from './index.styles';
import { GroupWeekData } from './GroupWeekData';

registerFonts();

const FieldServiceMeetingTemplate = ({
  data,
  lang,
  groupsList,
}: FieldServiceMeetingTemplateType) => {
  if (!Array.isArray(data) || data.length === 0) return null;

  // Separate meetings
  const jointMeetings = data.filter(
    (m) => m.meeting_data.type === 'joint' || m.meeting_data.type === 'zoom'
  );

  return (
    <Document title={`Field Service Meeting Schedule (${lang})`}>
      <Page size="A4" style={[styles.page]}>
        <Header />
        <JointWeekData meetings={jointMeetings} lang={lang} />
      </Page>
      <Page size="A4" style={[styles.page]}>
        <Header />
        <GroupWeekData meetings={data} lang={lang} groupsList={groupsList} />
      </Page>
    </Document>
  );
};

export default FieldServiceMeetingTemplate;
