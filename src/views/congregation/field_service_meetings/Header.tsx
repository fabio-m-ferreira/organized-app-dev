import { useAppTranslation } from '@hooks/index';
import { Text, View } from '@react-pdf/renderer';
import styles from './index.styles';
import IconFootprint from '@views/components/icons/IconFootprint';

const Header = () => {
  const { t } = useAppTranslation();

  return (
    <View fixed style={styles.header}>
      <View style={styles.headerTitleContainer}>
        <IconFootprint />
        <Text style={styles.headerTittle}>
          {t('tr_fieldServiceMeetingSchedule')}
        </Text>
      </View>
      <View style={styles.headerMonth}>
        <Text style={styles.headerCongregation}>{`Outubro 2025`}</Text>
      </View>
    </View>
  );
};

export default Header;
