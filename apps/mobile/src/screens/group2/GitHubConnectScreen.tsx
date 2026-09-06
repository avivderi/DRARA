import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

import { WizardFooter } from '../../components/layout/footers/WizardFooter';
import { WizardHeader } from '../../components/layout/headers/WizardHeader';
import { colors, fonts } from '../../theme/tokens';

interface GitHubConnectScreenProps {
  currentStep: number;
  totalSteps: number;
  isConnected?: boolean;
  connectedAccount?: string;
  onBackPress: () => void;
  onConnectGitHub: () => Promise<void> | void;
  onNext: () => void;
}

export const GitHubConnectScreen: React.FC<GitHubConnectScreenProps> = ({
  currentStep,
  totalSteps,
  isConnected = false,
  connectedAccount = '',
  onBackPress,
  onConnectGitHub,
  onNext,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConnect = () => {
    setError('');
    setLoading(true);
    Promise.resolve(onConnectGitHub())
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : 'אירעה שגיאה בחיבור ל-GitHub';
        setError(msg);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <WizardHeader
        currentStep={currentStep}
        totalSteps={totalSteps}
        onBackPress={onBackPress}
        title="חיבור חשבון GitHub"
      />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>
          אימות וחיבור מאובטח באמצעות GitHub OAuth לקריאת Repositories ציבוריים או פרטיים שתבחר בלבד.
        </Text>

        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <Text style={styles.githubLogo}>🐙</Text>
          </View>

          <Text style={styles.cardTitle}>DRARA GitHub AI Analyzer</Text>
          <Text style={styles.cardDesc}>
            הרשאות קריאה בלבד ל-Repositories נבחרים (Read-Only Code & Architecture Analysis).
          </Text>

          <View style={styles.featuresList}>
            <Text style={styles.featureItem}>✅ ניתוח שפת פיתוח, Frameworks ו-Dependencies</Text>
            <Text style={styles.featureItem}>✅ חישוב מדד מוכנות פרויקט (Readiness Score)</Text>
            <Text style={styles.featureItem}>🔒 אבטחה מלאה: הקוד שלך אינו נשמר בשרתי צד-שלישי</Text>
          </View>

          {isConnected ? (
            <View style={styles.connectedBox}>
              <Text style={styles.connectedIcon}>✓</Text>
              <Text style={styles.connectedText}>
                מחובר כ- <Text style={styles.accountName}>{connectedAccount || 'avivderi'}</Text>
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.connectBtn}
              onPress={handleConnect}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.connectBtnText}>🔑 התחבר עם GitHub</Text>
              )}
            </TouchableOpacity>
          )}

          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>
      </ScrollView>

      <WizardFooter
        onNext={onNext}
        nextLabel="המשך לבחירת Repository"
        disabled={!isConnected && !loading}
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
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1.5,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  githubLogo: {
    fontSize: 32,
  },
  cardTitle: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 6,
  },
  cardDesc: {
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  featuresList: {
    width: '100%',
    backgroundColor: colors.surfaceAlt,
    borderRadius: 12,
    padding: 14,
    gap: 8,
    marginBottom: 20,
  },
  featureItem: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.textPrimary,
    textAlign: 'right',
  },
  connectBtn: {
    backgroundColor: colors.textPrimary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  connectBtnText: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.white,
  },
  connectedBox: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.primary,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: '100%',
    justifyContent: 'center',
    gap: 8,
  },
  connectedIcon: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.primary,
  },
  connectedText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textPrimary,
  },
  accountName: {
    fontFamily: fonts.bold,
    color: colors.primary,
  },
  errorText: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.error,
    textAlign: 'center',
    marginTop: 8,
  },
});
