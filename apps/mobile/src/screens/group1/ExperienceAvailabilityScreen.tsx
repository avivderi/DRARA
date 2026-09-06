import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';

import { WizardFooter } from '../../components/layout/footers/WizardFooter';
import { WizardHeader } from '../../components/layout/headers/WizardHeader';
import { colors, fonts } from '../../theme/tokens';

const EXPERIENCE_OPTIONS = [
  { id: '1-3', label: '1-3 שנים', detail: 'תחילת הדרך המקצועית / ג"וניור מתקדם' },
  { id: '3-5', label: '3-5 שנים', detail: 'ניסיון משמעותי בפיתוח / מוצר / שיווק' },
  { id: '5-10', label: '5-10 שנים', detail: 'ניסיון בכיר, הובלת צוותים וארכיטקטורה' },
  { id: '10+', label: '+10 שנים', detail: 'Senior / Executive / יזם סדרתי' },
];

const AVAILABILITY_OPTIONS = [
  { id: 'part_time_low', label: '10-20 שעות בשבוע', detail: 'לצד עבודה במשרה מלאה / ערבים וסופ"ש' },
  { id: 'part_time_high', label: '20-30 שעות בשבוע', detail: 'חצי משרה מוקדשת למיזם' },
  { id: 'full_time', label: 'משרה מלאה (40+ שעות)', detail: 'All-In: מוקדש באופן מלא להקמת המיזם' },
];

interface ExperienceAvailabilityScreenProps {
  currentStep: number;
  totalSteps: number;
  initialExperience?: string;
  initialAvailability?: string;
  onBackPress: () => void;
  onNext: (data: { experienceYears: string; availability: string }) => Promise<void> | void;
}

export const ExperienceAvailabilityScreen: React.FC<ExperienceAvailabilityScreenProps> = ({
  currentStep,
  totalSteps,
  initialExperience = '3-5',
  initialAvailability = 'part_time_high',
  onBackPress,
  onNext,
}) => {
  const [experience, setExperience] = useState(initialExperience);
  const [availability, setAvailability] = useState(initialAvailability);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleNext = async () => {
    setError('');
    setLoading(true);
    try {
      await onNext({ experienceYears: experience, availability });
    } catch (err: any) {
      setError(err?.message || 'אירעה שגיאה בשמירת הזמינות והניסיון');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <WizardHeader
        currentStep={currentStep}
        totalSteps={totalSteps}
        onBackPress={onBackPress}
        title="ניסיון מקצועי וזמינות"
      />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>
          תיאום ציפיות מדויק לגבי שנות הניסיון והזמינות השבועית ימנע חיכוכים בחיבור השותפים.
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>שנות ניסיון מקצועי</Text>
          <View style={styles.optionsList}>
            {EXPERIENCE_OPTIONS.map((opt) => {
              const isSelected = experience === opt.id;
              return (
                <TouchableOpacity
                  key={opt.id}
                  style={[styles.card, isSelected && styles.selectedCard]}
                  onPress={() => setExperience(opt.id)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.radioDot, isSelected && styles.selectedRadioDot]} />
                  <View style={styles.cardContent}>
                    <Text style={[styles.cardTitle, isSelected && styles.selectedCardTitle]}>
                      {opt.label}
                    </Text>
                    <Text style={styles.cardDetail}>{opt.detail}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>זמינות שבועית למיזם</Text>
          <View style={styles.optionsList}>
            {AVAILABILITY_OPTIONS.map((opt) => {
              const isSelected = availability === opt.id;
              return (
                <TouchableOpacity
                  key={opt.id}
                  style={[styles.card, isSelected && styles.selectedCard]}
                  onPress={() => setAvailability(opt.id)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.radioDot, isSelected && styles.selectedRadioDot]} />
                  <View style={styles.cardContent}>
                    <Text style={[styles.cardTitle, isSelected && styles.selectedCardTitle]}>
                      {opt.label}
                    </Text>
                    <Text style={styles.cardDetail}>{opt.detail}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </ScrollView>

      <WizardFooter
        onNext={handleNext}
        nextLabel={loading ? 'שומר...' : 'המשך לשלב הבא'}
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
    paddingBottom: 24,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'right',
    marginBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.textPrimary,
    textAlign: 'right',
    marginBottom: 12,
  },
  optionsList: {
    gap: 10,
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1.5,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedCard: {
    borderColor: colors.primary,
    backgroundColor: colors.surfaceAlt,
  },
  cardContent: {
    flex: 1,
    paddingRight: 10,
  },
  cardTitle: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.textPrimary,
    textAlign: 'right',
    marginBottom: 2,
  },
  selectedCardTitle: {
    color: colors.primary,
  },
  cardDetail: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'right',
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
  errorText: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.error,
    textAlign: 'right',
    marginTop: 4,
  },
});
