import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';

import { SimpleTitleHeader } from '../../components/layout/headers/SimpleTitleHeader';
import { colors, fonts } from '../../theme/tokens';

export type NFCErrorType = 'timeout' | 'expired_token' | 'self_signature' | 'hmac_tampered';

interface NFCTimeoutErrorScreenProps {
  errorType?: NFCErrorType;
  errorMessage?: string;
  onRetry: () => void;
  onCancel: () => void;
}

export const NFCTimeoutErrorScreen: React.FC<NFCTimeoutErrorScreenProps> = ({
  errorType = 'timeout',
  errorMessage = '',
  onRetry,
  onCancel,
}) => {
  const getErrorDetails = () => {
    switch (errorType) {
      case 'expired_token':
        return {
          title: 'תוקף ה-Challenge פג',
          desc: 'הזמן הקצוב לאימות ה-NFC פג. אנא הפק Challenge Token חדש ונסה שוב.',
          icon: '⏳',
        };
      case 'self_signature':
        return {
          title: 'חתימה עצמית אסורה',
          desc: 'המאתחל לא יכול לחתום על ה-Challenge של עצמו. ה-Handshake דורש 2 מכשירים שונים.',
          icon: '🚫',
        };
      case 'hmac_tampered':
        return {
          title: 'כשל באימות החתימה (HMAC Failed)',
          desc: 'חתימת ה-HMAC אינה תואמת. התגלה ניסיון שינוי או טמפרינג ב-Token.',
          icon: '🔒',
        };
      default:
        return {
          title: 'הזמן הקצוב פג (NFC Timeout)',
          desc: 'לא זוהה הצמדת מכשיר תוך הזמן המוקצב. וודא ש-NFC פעיל בשני המכשירים ונסה שוב.',
          icon: '📡',
        };
    }
  };

  const details = getErrorDetails();

  return (
    <SafeAreaView style={styles.safeArea}>
      <SimpleTitleHeader title="כשל באימות NFC" onBackPress={onCancel} />

      <View style={styles.container}>
        <View style={styles.errorCard}>
          <Text style={styles.icon}>{details.icon}</Text>
          <Text style={styles.title}>{details.title}</Text>
          <Text style={styles.desc}>{errorMessage || details.desc}</Text>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.retryBtn} onPress={onRetry} activeOpacity={0.8}>
              <Text style={styles.retryBtnText}>🔄 נסה שוב (Retry Tap)</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelBtn} onPress={onCancel} activeOpacity={0.8}>
              <Text style={styles.cancelBtnText}>חזור למסך המאצ'ים</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    paddingHorizontal: 20,
  },
  errorCard: {
    width: '100%',
    backgroundColor: colors.surface,
    borderColor: colors.error,
    borderWidth: 1.5,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  icon: {
    fontSize: 48,
    marginBottom: 12,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 20,
    color: colors.error,
    textAlign: 'center',
    marginBottom: 8,
  },
  desc: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  actions: {
    width: '100%',
    gap: 10,
  },
  retryBtn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  retryBtnText: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.white,
  },
  cancelBtn: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelBtnText: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.textPrimary,
  },
});
