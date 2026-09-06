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

import { WizardFooter } from '../../components/layout/footers/WizardFooter';
import { WizardHeader } from '../../components/layout/headers/WizardHeader';
import { colors, fonts } from '../../theme/tokens';

export type PitchType = 'github_repo' | 'manual_pitch';

interface IdeaEntryScreenProps {
  currentStep: number;
  totalSteps: number;
  onBackPress: () => void;
  onSelectGitHub: (title: string, description?: string) => void;
  onSelectManual: (title: string, description: string) => void;
}

export const IdeaEntryScreen: React.FC<IdeaEntryScreenProps> = ({
  currentStep,
  totalSteps,
  onBackPress,
  onSelectGitHub,
  onSelectManual,
}) => {
  const [pitchType, setPitchType] = useState<PitchType>('github_repo');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleNext = () => {
    if (!title.trim()) {
      setError('אנא הזן שם או כותרת לרעיון/מיזם');
      return;
    }
    setError('');

    if (pitchType === 'github_repo') {
      onSelectGitHub(title.trim(), description.trim());
    } else {
      if (description.trim().length < 15) {
        setError('אנא כתוב פיץ\' טקסטואלי של 15 תווים לפחות');
        return;
      }
      onSelectManual(title.trim(), description.trim());
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <WizardHeader
        currentStep={currentStep}
        totalSteps={totalSteps}
        onBackPress={onBackPress}
        title="העלאת רעיון או מיזם חדש"
      />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>
          איך תרצה להציג את המיזם שלך ל-AI ולשותפים הפוטנציאליים?
        </Text>

        <View style={styles.cardGroup}>
          <TouchableOpacity
            style={[styles.card, pitchType === 'github_repo' && styles.selectedCard]}
            onPress={() => {
              setPitchType('github_repo');
              if (error) setError('');
            }}
            activeOpacity={0.8}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardIcon}>🐙</Text>
              <View style={[styles.radioDot, pitchType === 'github_repo' && styles.selectedRadioDot]} />
            </View>
            <Text style={[styles.cardTitle, pitchType === 'github_repo' && styles.selectedCardTitle]}>
              חיבור Repository מ-GitHub (מומלץ)
            </Text>
            <Text style={styles.cardDesc}>
              ה-AI יסרוק את הקוד, הארכיטקטורה וה-Stack שלך וינפק Readiness Score והתאמה סמנטית אוטומטית.
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.card, pitchType === 'manual_pitch' && styles.selectedCard]}
            onPress={() => {
              setPitchType('manual_pitch');
              if (error) setError('');
            }}
            activeOpacity={0.8}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardIcon}>📝</Text>
              <View style={[styles.radioDot, pitchType === 'manual_pitch' && styles.selectedRadioDot]} />
            </View>
            <Text style={[styles.cardTitle, pitchType === 'manual_pitch' && styles.selectedCardTitle]}>
              הזנת Pitch טקסטואלי (ידני)
            </Text>
            <Text style={styles.cardDesc}>
              הזן תיאור חופשי של הרעיון, הבעיה, השוק והטכנולוגיה (מתאים גם לרעיונות בשלב הראשוני).
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formSection}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>שם/כותרת המיזם</Text>
            <TextInput
              style={styles.input}
              placeholder="למשל: DRARA - Co-Founder Matching Platform"
              placeholderTextColor={colors.textSecondary}
              value={title}
              onChangeText={(text) => {
                setTitle(text);
                if (error) setError('');
              }}
              textAlign="right"
            />
          </View>

          {pitchType === 'manual_pitch' ? (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>תיאור הרעיון (Pitch)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="ספר על הבעיה, הפתרון, קהל היעד והיכולות הנדרשות..."
                placeholderTextColor={colors.textSecondary}
                value={description}
                onChangeText={(text) => {
                  setDescription(text);
                  if (error) setError('');
                }}
                multiline
                numberOfLines={5}
                textAlignVertical="top"
                textAlign="right"
              />
            </View>
          ) : (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>תיאור קצר (אופציונלי להוספה מעבר לסריקה)</Text>
              <TextInput
                style={styles.input}
                placeholder="למשל: SaaS platform with AI matching and NFC verification"
                placeholderTextColor={colors.textSecondary}
                value={description}
                onChangeText={setDescription}
                textAlign="right"
              />
            </View>
          )}

          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>
      </ScrollView>

      <WizardFooter
        onNext={handleNext}
        nextLabel={pitchType === 'github_repo' ? 'להתחברות ל-GitHub 🚀' : 'המשך להגדרות נראות'}
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
  cardGroup: {
    gap: 12,
    marginBottom: 24,
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
    fontSize: 26,
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
    fontSize: 16,
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
  formSection: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.textPrimary,
    textAlign: 'right',
    marginBottom: 8,
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
  textArea: {
    minHeight: 110,
  },
  errorText: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.error,
    textAlign: 'right',
    marginTop: 4,
  },
});
