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

const GAP_OPTIONS = [
  { id: 'Backend', title: 'Backend / Architecture', desc: 'פיתוח API, מסדי נתונים ומיקרו-שירותים' },
  { id: 'DevOps', title: 'DevOps / Cloud / CI-CD', desc: 'ניהול ענן (AWS/GCP), Kubernetes ואינפרה' },
  { id: 'Frontend', title: 'Frontend / Mobile', desc: 'פיתוח אפליקציה ב-React Native / Web' },
  { id: 'Marketing', title: 'Growth / Marketing / SEO', desc: 'שיווק דיגיטלי, רכישת משתמשים ו-SEO' },
  { id: 'Sales', title: 'B2B Sales / Business Dev', desc: 'סגירת עסקאות Enterprise ומכירות B2B' },
  { id: 'Product', title: 'Product Manager / UI-UX', desc: 'עיצוב מוצר, ניתוח UX ואפיון פונקציונלי' },
  { id: 'Legal', title: 'Legal / Finance / Fundraising', desc: 'גיוס הון, הסכמי מייסדים ומשפטים' },
];

interface MissingGapsScreenProps {
  currentStep: number;
  totalSteps: number;
  initialSelectedGaps?: string[];
  onBackPress: () => void;
  onNext: (selectedGaps: string[]) => void;
}

export const MissingGapsScreen: React.FC<MissingGapsScreenProps> = ({
  currentStep,
  totalSteps,
  initialSelectedGaps = ['Marketing', 'Sales'],
  onBackPress,
  onNext,
}) => {
  const [selectedGaps, setSelectedGaps] = useState<string[]>(initialSelectedGaps);
  const [error, setError] = useState('');

  const toggleGap = (id: string) => {
    if (selectedGaps.includes(id)) {
      setSelectedGaps(selectedGaps.filter((g) => g !== id));
    } else {
      setSelectedGaps([...selectedGaps, id]);
      if (error) setError('');
    }
  };

  const handleNext = () => {
    if (selectedGaps.length === 0) {
      setError('אנא בחר לפחות תחום אחד שחסר במיזם (Seeking Gaps)');
      return;
    }
    setError('');
    onNext(selectedGaps);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <WizardHeader
        currentStep={currentStep}
        totalSteps={totalSteps}
        onBackPress={onBackPress}
        title="מה חסר למיזם? (Co-Founder Gaps)"
      />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>
          סימון התפקידים והיכולות שחסרים לך כעת יאפשר ל-AI למצוא לך שותפים בעלי פרופיל משלים (Complementary Match).
        </Text>

        <View style={styles.gapsList}>
          {GAP_OPTIONS.map((gap) => {
            const isSelected = selectedGaps.includes(gap.id);
            return (
              <TouchableOpacity
                key={gap.id}
                style={[styles.gapCard, isSelected && styles.selectedGapCard]}
                onPress={() => toggleGap(gap.id)}
                activeOpacity={0.8}
              >
                <View style={styles.cardHeader}>
                  <Text style={[styles.gapTitle, isSelected && styles.selectedGapTitle]}>
                    {gap.title}
                  </Text>
                  <View style={[styles.checkbox, isSelected && styles.selectedCheckbox]}>
                    {isSelected && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                </View>

                <Text style={styles.gapDesc}>{gap.desc}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </ScrollView>

      <WizardFooter onNext={handleNext} nextLabel="המשך להגדרת נראות הרעיון" />
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
  gapsList: {
    gap: 10,
    marginBottom: 16,
  },
  gapCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 16,
  },
  selectedGapCard: {
    borderColor: colors.primary,
    backgroundColor: colors.surfaceAlt,
  },
  cardHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  gapTitle: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.textPrimary,
    textAlign: 'right',
  },
  selectedGapTitle: {
    color: colors.primary,
  },
  gapDesc: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'right',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCheckbox: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkmark: {
    color: colors.white,
    fontFamily: fonts.bold,
    fontSize: 13,
  },
  errorText: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.error,
    textAlign: 'right',
    marginTop: 4,
  },
});
