import { useAppTranslation } from '@hooks/index';
import { Text, View } from '@react-pdf/renderer';
import styles from './index.styles';
import IconFootprint from '@views/components/icons/IconFootprint';
import React from 'react';

type HeaderProps = {
  monthDate?: string | number | Date;
};

const Header: React.FC<HeaderProps> = ({ monthDate }) => {
  const { t } = useAppTranslation();
  const dateObj = monthDate ? new Date(monthDate) : new Date();
  let formattedMonth = dateObj.toLocaleDateString('pt-PT', {
    month: 'long',
    year: 'numeric',
  });
  formattedMonth =
    formattedMonth.charAt(0).toUpperCase() + formattedMonth.slice(1);

  return (
    <View fixed style={styles.header}>
      <View style={styles.headerTitleContainer}>
        <IconFootprint />
        <Text style={styles.headerTittle}>
          {t('tr_fieldServiceMeetingSchedule')}
        </Text>
      </View>
      <View style={styles.headerMonth}>
        <Text style={styles.headerCongregation}>{formattedMonth}</Text>
      </View>
    </View>
  );
};

export default Header;
