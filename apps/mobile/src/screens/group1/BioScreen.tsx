import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  SafeAreaView,
  ScrollView,
} from 'react-native';

import { WizardFooter } from '../../components/layout/footers/WizardFooter';
import { WizardHeader } from '../../components/layout/headers/WizardHeader';
import { colors, fonts } from '../../theme/tokens';

interface BioScreenProps {
  currentStep: number;
  totalSteps: number;
  initialBio?: string;
  onBackPress: () => void;
  onNext: (bio: string) => Promise<void> | void;
}

export const BioScreen: React.FC<BioScreenProps> = ({
  currentStep,
  totalSteps,
  initialBio = '',
  onBackPress,
  onNext,
}) => {
  const [bio, setBio] = useState(initialBio);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleNext = async () => {
    if (bio.trim().length < 15) {
      setError('אנא כתוב לפחות 15 תווים על הניסיון והרקע שלך');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await onNext(bio.trim());
    } catch (err: any) {
      setError(err?.message || 'אירעה שגיאה בשמירת ה-Bio');
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
        title="אודות והרקע המקצועי"
      />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>
          ספר בקצרה על הניסיון שלך, פרויקטים קודמים שבנית, ומה מניע אותך להקים מיזם חדש.
        </Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>קצת עלי (Bio)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="לדוגמה: מפתח Fullstack עם 8 שנות ניסיון בהקמת מערכות Distributed ב-Scale גבוה. הובלתי צוותי פיתוח בסטארטאפ שנרכש, כעת מחפש שותף/ה עסקי/ת להקמת מיזם FinTech חדש..."
            placeholderTextColor={colors.textSecondary}
            value={bio}
            onChangeText={(text) => {
              setBio(text);
              if (error) setError('');
            }}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            textAlign="right"
          />
          <Text style={styles.charCount}>{bio.length}/500 תווים</Text>
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
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.textPrimary,
    textAlign: 'right',
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.textPrimary,
  },
  textArea: {
    minHeight: 140,
  },
  charCount: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'left',
    marginTop: 6,
  },
  errorText: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.error,
    textAlign: 'right',
    marginTop: 4,
  },
});
