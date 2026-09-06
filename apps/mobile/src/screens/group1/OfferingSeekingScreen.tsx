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

const TAG_OPTIONS = [
  'Backend',
  'Frontend',
  'DevOps',
  'AWS',
  'AI / ML',
  'Mobile',
  'Marketing',
  'Sales',
  'Product',
  'UI/UX',
  'Finance',
  'Legal',
  'Growth',
  'Content',
];

interface OfferingSeekingScreenProps {
  currentStep: number;
  totalSteps: number;
  initialOfferingTags?: string[];
  initialSeekingTags?: string[];
  onBackPress: () => void;
  onNext: (data: { offeringTags: string[]; seekingTags: string[] }) => Promise<void> | void;
}

export const OfferingSeekingScreen: React.FC<OfferingSeekingScreenProps> = ({
  currentStep,
  totalSteps,
  initialOfferingTags = ['Backend', 'DevOps'],
  initialSeekingTags = ['Marketing', 'Product'],
  onBackPress,
  onNext,
}) => {
  const [offeringTags, setOfferingTags] = useState<string[]>(initialOfferingTags);
  const [seekingTags, setSeekingTags] = useState<string[]>(initialSeekingTags);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleOffering = (tag: string) => {
    if (offeringTags.includes(tag)) {
      setOfferingTags(offeringTags.filter((t) => t !== tag));
    } else {
      setOfferingTags([...offeringTags, tag]);
    }
  };

  const toggleSeeking = (tag: string) => {
    if (seekingTags.includes(tag)) {
      setSeekingTags(seekingTags.filter((t) => t !== tag));
    } else {
      setSeekingTags([...seekingTags, tag]);
    }
  };

  const handleNext = async () => {
    if (offeringTags.length === 0) {
      setError('אנא בחר לפחות תגית אחת למה שאתה מציע (Offering Tags)');
      return;
    }
    if (seekingTags.length === 0) {
      setError('אנא בחר לפחות תגית אחת למה שאתה מחפש בשותף (Seeking Tags)');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await onNext({ offeringTags, seekingTags });
    } catch (err: any) {
      setError(err?.message || 'אירעה שגיאה בשמירת התגיות');
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
        title="מה אני מציע מול מה אני מחפש"
      />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>
          תגיות ה-Offering וה-Seeking שלך ישמשו את מנוע ה-pgvector להשוואה סמנטית ולדירוג המאצ'ים המדויקים ביותר.
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💡 מה אתה מביא לשולחן (Offering Tags)</Text>
          <Text style={styles.sectionDesc}>בחר את היכולות הטכניות או העסקיות שאתה מציע במיזם</Text>
          <View style={styles.chipsContainer}>
            {TAG_OPTIONS.map((tag) => {
              const isSelected = offeringTags.includes(tag);
              return (
                <TouchableOpacity
                  key={`offering-${tag}`}
                  style={[styles.chip, isSelected && styles.offeringSelectedChip]}
                  onPress={() => toggleOffering(tag)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.chipText, isSelected && styles.offeringSelectedChipText]}>
                    {isSelected ? '✓ ' : '+ '}
                    {tag}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎯 מה אתה מחפש בשותף (Seeking Tags)</Text>
          <Text style={styles.sectionDesc}>בחר את היכולות המשלימות שחסרות לך ואותן אתה מחפש בשותף/ה</Text>
          <View style={styles.chipsContainer}>
            {TAG_OPTIONS.map((tag) => {
              const isSelected = seekingTags.includes(tag);
              return (
                <TouchableOpacity
                  key={`seeking-${tag}`}
                  style={[styles.chip, isSelected && styles.seekingSelectedChip]}
                  onPress={() => toggleSeeking(tag)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.chipText, isSelected && styles.seekingSelectedChipText]}>
                    {isSelected ? '✓ ' : '+ '}
                    {tag}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </ScrollView>

      <WizardFooter
        onNext={handleNext}
        nextLabel={loading ? 'שומר ומעדכן...' : 'סים השלמת פרופיל'}
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
    marginBottom: 4,
  },
  sectionDesc: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'right',
    marginBottom: 12,
  },
  chipsContainer: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  offeringSelectedChip: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  offeringSelectedChipText: {
    color: colors.white,
    fontFamily: fonts.bold,
  },
  seekingSelectedChip: {
    borderColor: colors.accentPoint,
    backgroundColor: '#00543C',
  },
  seekingSelectedChipText: {
    color: colors.accentPoint,
    fontFamily: fonts.bold,
  },
  chipText: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.textPrimary,
  },
  errorText: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.error,
    textAlign: 'right',
    marginTop: 4,
  },
});
