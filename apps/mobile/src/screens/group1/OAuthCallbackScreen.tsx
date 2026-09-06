import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';

import { SimpleTitleHeader } from '../../components/layout/headers/SimpleTitleHeader';
import { colors, fonts } from '../../theme/tokens';

interface OAuthCallbackScreenProps {
  status?: 'authenticating' | 'success' | 'error';
  errorMessage?: string;
  onRetry?: () => void;
  onContinue?: () => void;
}

export const OAuthCallbackScreen: React.FC<OAuthCallbackScreenProps> = ({
  status = 'authenticating',
  errorMessage = '',
  onRetry,
  onContinue,
}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <SimpleTitleHeader title="התחברות באמצעות GitHub" />

      <View style={styles.container}>
        {status === 'authenticating' && (
          <View style={styles.stateCard}>
            <ActivityIndicator size="large" color={colors.primary} style={styles.spinner} />
            <Text style={styles.title}>מאמת פרטי התחברות...</Text>
            <Text style={styles.subtitle}>
              אנא המתן בזמן שאנו מאמתים את מפתח ה-OAuth מול GitHub ושומרים את הסשן המאובטח.
            </Text>
          </View>
        )}

        {status === 'success' && (
          <View style={styles.stateCard}>
            <Text style={styles.icon}>✅</Text>
            <Text style={styles.title}>התחברת בהצלחה!</Text>
            <Text style={styles.subtitle}>
              חשבון ה-GitHub שלך קושר בהצלחה. כעת נעבור להשלמת פרופיל היזם.
            </Text>

            <TouchableOpacity style={styles.primaryBtn} onPress={onContinue}>
              <Text style={styles.primaryBtnText}>המשך להשלמת פרופיל 🚀</Text>
            </TouchableOpacity>
          </View>
        )}

        {status === 'error' && (
          <View style={styles.stateCard}>
            <Text style={styles.icon}>⚠️</Text>
            <Text style={[styles.title, { color: colors.error }]}>שגיאה בהתחברות</Text>
            <Text style={styles.subtitle}>
              {errorMessage || 'אירעה שגיאה באימות מול שרת ה-OAuth. אנא נסה שוב.'}
            </Text>

            <TouchableOpacity style={styles.retryBtn} onPress={onRetry}>
              <Text style={styles.retryBtnText}>🔄 נסה להתחבר שוב</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  stateCard: {
    width: '100%',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1.5,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  spinner: {
    marginBottom: 16,
  },
  icon: {
    fontSize: 44,
    marginBottom: 12,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 20,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  primaryBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  primaryBtnText: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.white,
  },
  retryBtn: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.border,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  retryBtnText: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.textPrimary,
  },
});
