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

import { SimpleTitleHeader } from '../../components/layout/headers/SimpleTitleHeader';
import { colors, fonts } from '../../theme/tokens';
import { UserAvatar } from '../../components/common/UserAvatar';

interface MatchIntroModalScreenProps {
  candidateName?: string;
  candidateAvatar?: string;
  matchScore?: number;
  onBackPress: () => void;
  onSendIntro: (message: string) => Promise<void> | void;
  onScheduleNFC: () => void;
}

export const MatchIntroModalScreen: React.FC<MatchIntroModalScreenProps> = ({
  candidateName = 'מועמד',
  candidateAvatar,
  matchScore = 0.85,
  onBackPress,
  onSendIntro,
  onScheduleNFC,
}) => {
  const [message, setMessage] = useState(
    `היי ${candidateName}, ראיתי את ההתאמה בינינו ב-DRARA (התאמה סמנטית של ${Math.round(matchScore * 100)}%). אשמח שנשוחח ואף נקבע מפגש NFC Handshake!`,
  );
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSend = () => {
    if (!message.trim()) {
      setError('אנא הזן הודעת פנייה קצרה');
      return;
    }
    setError('');
    setLoading(true);
    Promise.resolve(onSendIntro(message))
      .then(() => {
        setSent(true);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'שגיאה בשליחת הפנייה');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <SimpleTitleHeader title={`פנייה ל-${candidateName}`} onBackPress={onBackPress} />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.candidateHeader}>
          <UserAvatar name={candidateName} avatarUrl={candidateAvatar} size={64} />
          <Text style={styles.candidateName}>{candidateName}</Text>
          <Text style={styles.matchBadge}>
            ⭐ {Math.round(matchScore * 100)}% Cosine Similarity
          </Text>
        </View>

        {sent ? (
          <View style={styles.successCard}>
            <Text style={styles.successIcon}>🎉</Text>
            <Text style={styles.successTitle}>הפנייה נשלחה בהצלחה!</Text>
            <Text style={styles.successDesc}>
              הודעת ה-Intro שלך הועברה ל-{candidateName}. כעת תוכלו לקבוע מפגש פיזי ולאמת את השותפות ב-NFC Tap.
            </Text>

            <TouchableOpacity style={styles.nfcBtn} onPress={onScheduleNFC}>
              <Text style={styles.nfcBtnText}>📲 קבע מפגש NFC Handshake</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>הודעת פנייה ראשונית (Intro Message)</Text>
            <Text style={styles.formSubtitle}>
              ההודעה תישלח למועמד יחד עם כרטיס המאצ' והסבר ה-AI.
            </Text>

            <TextInput
              style={styles.textArea}
              value={message}
              onChangeText={(text) => {
                setMessage(text);
                if (error) setError('');
              }}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              textAlign="right"
            />

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity
              style={styles.sendBtn}
              onPress={handleSend}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={styles.sendBtnText}>
                {loading ? 'שולח פנייה...' : '📩 שלח הודעת Intro'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
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
    paddingBottom: 30,
  },
  candidateHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: colors.primary,
    marginBottom: 8,
  },
  candidateName: {
    fontFamily: fonts.bold,
    fontSize: 20,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 4,
  },
  matchBadge: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.primary,
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  formCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1.5,
    borderRadius: 20,
    padding: 18,
  },
  formTitle: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.textPrimary,
    textAlign: 'right',
    marginBottom: 4,
  },
  formSubtitle: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'right',
    marginBottom: 12,
  },
  textArea: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textPrimary,
    minHeight: 110,
    marginBottom: 12,
  },
  sendBtn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  sendBtnText: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.white,
  },
  successCard: {
    backgroundColor: colors.surface,
    borderColor: colors.primary,
    borderWidth: 2,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  successIcon: {
    fontSize: 44,
    marginBottom: 12,
  },
  successTitle: {
    fontFamily: fonts.bold,
    fontSize: 20,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 6,
  },
  successDesc: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  nfcBtn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    width: '100%',
    alignItems: 'center',
  },
  nfcBtnText: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.white,
  },
  errorText: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.error,
    textAlign: 'right',
    marginBottom: 8,
  },
});
