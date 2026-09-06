import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TextInput,
} from 'react-native';

import { SingleCtaFooter } from '../../components/layout/footers/SingleCtaFooter';
import { SimpleTitleHeader } from '../../components/layout/headers/SimpleTitleHeader';
import { colors, fonts } from '../../theme/tokens';

interface ScheduleMeetingScreenProps {
  partnerName?: string;
  onBackPress: () => void;
  onScheduleConfirm: (location: string, dateTime: string) => Promise<void> | void;
}

export const ScheduleMeetingScreen: React.FC<ScheduleMeetingScreenProps> = ({
  partnerName = 'שותף',
  onBackPress,
  onScheduleConfirm,
}) => {
  const [location, setLocation] = useState('WeWork Sarona, Tel Aviv (קומת לובי)');
  const [dateTime, setDateTime] = useState('יום שלישי, 10 בספטמבר ב-16:00');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConfirm = () => {
    if (!location.trim() || !dateTime.trim()) {
      setError('אנא הזן מיקום ותאריך לפגישה');
      return;
    }
    setError('');
    setLoading(true);
    Promise.resolve(onScheduleConfirm(location.trim(), dateTime.trim()))
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : 'אירעה שגיאה בקביעת המפגש';
        setError(msg);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <SimpleTitleHeader title={`קביעת מפגש עם ${partnerName}`} onBackPress={onBackPress} />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>
          קביעת מפגש פיזי במקום ציבורי ונוח לביצוע אימות NFC Handshake.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardIcon}>📍</Text>
          <Text style={styles.inputLabel}>מיקום המפגש המוצע</Text>
          <TextInput
            style={styles.input}
            value={location}
            onChangeText={(text) => {
              setLocation(text);
              if (error) setError('');
            }}
            placeholder="למשל: WeWork Sarona / בית קפה קרוב"
            placeholderTextColor={colors.textSecondary}
            textAlign="right"
          />

          <View style={styles.divider} />

          <Text style={styles.cardIcon}>📅</Text>
          <Text style={styles.inputLabel}>תאריך ושעה</Text>
          <TextInput
            style={styles.input}
            value={dateTime}
            onChangeText={(text) => {
              setDateTime(text);
              if (error) setError('');
            }}
            placeholder="למשל: יום שלישי בשעה 16:00"
            placeholderTextColor={colors.textSecondary}
            textAlign="right"
          />
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>💡 למה מפגש פיזי?</Text>
          <Text style={styles.infoText}>
            פרוטוקול NFC Handshake דורש שהיית 2 המכשירים באותו מיקום פיזי. האימות מבטיח דיסקרטיות מלאה ואמינות של 100% לפני חשיפת קוד ונתונים רגישים.
          </Text>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </ScrollView>

      <SingleCtaFooter
        label={loading ? 'קובע מפגש...' : 'אישור ושלח זימון ל-NFC Handshake 📲'}
        onPress={handleConfirm}
        disabled={loading}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 90,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'right',
    marginBottom: 20,
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1.5,
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
  },
  cardIcon: {
    fontSize: 24,
    textAlign: 'right',
    marginBottom: 4,
  },
  inputLabel: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.textPrimary,
    textAlign: 'right',
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
  },
  infoBox: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  },
  infoTitle: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.primary,
    textAlign: 'right',
    marginBottom: 4,
  },
  infoText: {
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textSecondary,
    textAlign: 'right',
  },
  errorText: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.error,
    textAlign: 'right',
    marginTop: 8,
  },
});
