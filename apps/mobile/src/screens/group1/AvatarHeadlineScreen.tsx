import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import { WizardFooter } from '../../components/layout/footers/WizardFooter';
import { WizardHeader } from '../../components/layout/headers/WizardHeader';
import { colors, fonts } from '../../theme/tokens';

interface AvatarHeadlineScreenProps {
  currentStep: number;
  totalSteps: number;
  initialHeadline?: string;
  initialAvatarUrl?: string;
  onBackPress: () => void;
  onNext: (data: { headline: string; avatarUrl: string }) => Promise<void> | void;
}

export const AvatarHeadlineScreen: React.FC<AvatarHeadlineScreenProps> = ({
  currentStep,
  totalSteps,
  initialHeadline = '',
  initialAvatarUrl = '',
  onBackPress,
  onNext,
}) => {
  const [headline, setHeadline] = useState(initialHeadline);
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const defaultAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80';

  const handleNext = async () => {
    if (!headline.trim()) {
      setError('אנא הזן כותרת מקצועית מקצרת');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await onNext({
        headline: headline.trim(),
        avatarUrl: avatarUrl.trim() || defaultAvatar,
      });
    } catch (err: any) {
      setError(err?.message || 'אירעה שגיאה בעדכון הפרופיל');
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
        title="תמונה וכותרת אישית"
      />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>
          תמונה וכותרת חדה יעזרו לשותפים פוטנציאליים להבין מיד מה ה-Value שיש לך להציע.
        </Text>

        <View style={styles.avatarSection}>
          <Image
            source={{ uri: avatarUrl.trim() || defaultAvatar }}
            style={styles.avatarImage}
          />
          <TouchableOpacity
            style={styles.changeAvatarBtn}
            onPress={() => {
              // Toggle sample avatars for demonstration
              const samples = [
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
              ];
              const nextIndex = (samples.indexOf(avatarUrl) + 1) % samples.length;
              setAvatarUrl(samples[nextIndex]);
            }}
          >
            <Text style={styles.changeAvatarText}>📷 החלף תמונה</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>כותרת מקצועית (Headline)</Text>
          <TextInput
            style={styles.input}
            placeholder="לדוגמה: Fullstack Developer & AWS Architect (10y exp)"
            placeholderTextColor={colors.textSecondary}
            value={headline}
            onChangeText={(text) => {
              setHeadline(text);
              if (error) setError('');
            }}
            textAlign="right"
          />
          <Text style={styles.hint}>
            מומלץ: תפקיד מרכזי + שנות ניסיון או טכנולוגיה מובילה
          </Text>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </ScrollView>

      <WizardFooter
        onNext={handleNext}
        nextLabel={loading ? 'מעדכן...' : 'המשך לשלב הבא'}
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
    marginBottom: 24,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 28,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: colors.primary,
    backgroundColor: colors.surfaceAlt,
    marginBottom: 12,
  },
  changeAvatarBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
  changeAvatarText: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.primary,
  },
  inputGroup: {
    marginBottom: 20,
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
  hint: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'right',
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
