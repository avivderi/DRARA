import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
} from 'react-native';

import { SingleCtaFooter } from '../../components/layout/footers/SingleCtaFooter';
import { SimpleTitleHeader } from '../../components/layout/headers/SimpleTitleHeader';
import { colors, fonts } from '../../theme/tokens';

export type MeetingOutcome = 'positive_proceed' | 'need_another_meeting' | 'not_a_fit';

interface MeetingFeedbackScreenProps {
  partnerName?: string;
  onBackPress: () => void;
  onSubmitFeedback: (outcome: MeetingOutcome, notes: string) => Promise<void> | void;
  onProceedToNFC: () => void;
}

export const MeetingFeedbackScreen: React.FC<MeetingFeedbackScreenProps> = ({
  partnerName = 'אלון מזרחי',
  onBackPress,
  onSubmitFeedback,
  onProceedToNFC,
}) => {
  const [outcome, setOutcome] = useState<MeetingOutcome>('positive_proceed');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    setError('');
    setLoading(true);
    Promise.resolve(onSubmitFeedback(outcome, notes.trim()))
      .then(() => {
        if (outcome === 'positive_proceed') {
          onProceedToNFC();
        }
      })
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : 'אירעה שגיאה בשמירת הפידבק';
        setError(msg);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <SimpleTitleHeader title="איך הייתה הפגישה?" onBackPress={onBackPress} />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>
          איך התרשמת מהפגישה הראשונה עם {partnerName}? הפידבק נשאר דיסקרטי ומסייע ל-AI לשפר את דיוק המאצ'ים.
        </Text>

        <View style={styles.optionsGroup}>
          <TouchableOpacity
            style={[styles.card, outcome === 'positive_proceed' && styles.selectedCard]}
            onPress={() => setOutcome('positive_proceed')}
            activeOpacity={0.8}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardIcon}>🚀</Text>
              <View style={[styles.radioDot, outcome === 'positive_proceed' && styles.selectedRadioDot]} />
            </View>
            <Text style={[styles.cardTitle, outcome === 'positive_proceed' && styles.selectedCardTitle]}>
              כימיה מעולה! רוצים להתקדם ל-NFC Handshake
            </Text>
            <Text style={styles.cardDesc}>
              הייתה פגישה מצוינת, יש חיבור אישי וטכנולוגי ואנחנו מוכנים לאמת את ה-Match במכשיר.
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.card, outcome === 'need_another_meeting' && styles.selectedCard]}
            onPress={() => setOutcome('need_another_meeting')}
            activeOpacity={0.8}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardIcon}>☕</Text>
              <View style={[styles.radioDot, outcome === 'need_another_meeting' && styles.selectedRadioDot]} />
            </View>
            <Text style={[styles.cardTitle, outcome === 'need_another_meeting' && styles.selectedCardTitle]}>
              פגישה טובה, נדרש מפגש נוסף
            </Text>
            <Text style={styles.cardDesc}>
              יש פוטנציאל, רוצים לתאם שיחה מורחבת על הארכיטקטורה/חלוקת התפקידים לפני NFC.
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.card, outcome === 'not_a_fit' && styles.selectedCard]}
            onPress={() => setOutcome('not_a_fit')}
            activeOpacity={0.8}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardIcon}>🤝</Text>
              <View style={[styles.radioDot, outcome === 'not_a_fit' && styles.selectedRadioDot]} />
            </View>
            <Text style={[styles.cardTitle, outcome === 'not_a_fit' && styles.selectedCardTitle]}>
              לא נמצאה התאמה מתאימה כרגע
            </Text>
            <Text style={styles.cardDesc}>
              תודה על המפגש, מעדיף להמשיך לחפש שותפים בעלי פרופיל אחר.
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.notesSection}>
          <Text style={styles.notesLabel}>הערות אישיות (דיסקרטי):</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="רשום נקודות מרכזיות מהשיחה, נושאים לעקוף או דגשים להמשך..."
            placeholderTextColor={colors.textSecondary}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            textAlign="right"
          />
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </ScrollView>

      <SingleCtaFooter
        label={
          loading
            ? 'שומר פידבק...'
            : outcome === 'positive_proceed'
            ? 'המשך ל-NFC Handshake 📲'
            : 'שמור פידבק וחזור למאצ\'ים'
        }
        onPress={handleSubmit}
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
  optionsGroup: {
    gap: 12,
    marginBottom: 20,
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 16,
  },
  selectedCard: {
    borderColor: colors.primary,
    backgroundColor: colors.surfaceAlt,
  },
  cardHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cardIcon: {
    fontSize: 24,
  },
  radioDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
  },
  selectedRadioDot: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  cardTitle: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.textPrimary,
    textAlign: 'right',
    marginBottom: 4,
  },
  selectedCardTitle: {
    color: colors.primary,
  },
  cardDesc: {
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textSecondary,
    textAlign: 'right',
  },
  notesSection: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  },
  notesLabel: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.textPrimary,
    textAlign: 'right',
    marginBottom: 8,
  },
  notesInput: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textPrimary,
    minHeight: 80,
  },
  errorText: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.error,
    textAlign: 'right',
    marginTop: 8,
  },
});
