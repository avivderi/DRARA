import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import { SimpleTitleHeader } from '../../components/layout/headers/SimpleTitleHeader';
import { colors, fonts } from '../../theme/tokens';

interface NFCPreparationScreenProps {
  partnerName?: string;
  onBackPress: () => void;
  onStartTap: () => void;
}

export const NFCPreparationScreen: React.FC<NFCPreparationScreenProps> = ({
  partnerName = 'שותף',
  onBackPress,
  onStartTap,
}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <SimpleTitleHeader title="הכנה ל-NFC Handshake" onBackPress={onBackPress} />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeIcon}>📲</Text>
          <Text style={styles.badgeTitle}>הכן את המכשיר ל-Tap</Text>
          <Text style={styles.badgeSubtitle}>
            אתה עומד לבצע אימות NFC פיזי חתום ב-HMAC-SHA256 מול המכשיר של {partnerName}.
          </Text>
        </View>

        <View style={styles.stepsCard}>
          <Text style={styles.cardTitle}>📋 שלבי האימות הפיזי:</Text>

          <View style={styles.stepRow}>
            <Text style={styles.stepNum}>1</Text>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>ודא ש-NFC מופעל במכשיר</Text>
              <Text style={styles.stepDesc}>וודא שכיסוי המכשיר אינו חוסם רכיבי NFC במכשירך.</Text>
            </View>
          </View>

          <View style={styles.stepRow}>
            <Text style={styles.stepNum}>2</Text>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>קרבו את גב המכשירים</Text>
              <Text style={styles.stepDesc}>בצעו קירוב קל בין גב המכשיר שלך לגב המכשיר של {partnerName}.</Text>
            </View>
          </View>

          <View style={styles.stepRow}>
            <Text style={styles.stepNum}>3</Text>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>אימות Challenge/Response חתום</Text>
              <Text style={styles.stepDesc}>האפליקציה תפיק Challenge Token חתום ותשמור את אירוע ה-Handshake ב-DB.</Text>
            </View>
          </View>
        </View>

        <View style={styles.securityBanner}>
          <Text style={styles.securityTitle}>🔒 אבטחה קריפטוגרפית</Text>
          <Text style={styles.securityText}>
            אימות ה-NFC מונע זיוף מיקום (Self-Signature Prevention) ומבטיח תוקף קצוב (Challenge Expiry TTL).
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footerBar}>
        <TouchableOpacity style={styles.startBtn} onPress={onStartTap} activeOpacity={0.8}>
          <Text style={styles.startBtnText}>⚡ לחץ והצמד מכשירים (Start NFC Tap)</Text>
        </TouchableOpacity>
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
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 90,
  },
  badgeContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  badgeIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  badgeTitle: {
    fontFamily: fonts.bold,
    fontSize: 22,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 4,
  },
  badgeSubtitle: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 12,
  },
  stepsCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1.5,
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
  },
  cardTitle: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.textPrimary,
    textAlign: 'right',
    marginBottom: 14,
  },
  stepRow: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  stepNum: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    color: colors.white,
    fontFamily: fonts.bold,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 28,
    marginLeft: 12,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.textPrimary,
    textAlign: 'right',
    marginBottom: 2,
  },
  stepDesc: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'right',
  },
  securityBanner: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
  },
  securityTitle: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.primary,
    textAlign: 'right',
    marginBottom: 2,
  },
  securityText: {
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 16,
    color: colors.textSecondary,
    textAlign: 'right',
  },
  footerBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  startBtn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  startBtnText: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.white,
  },
});
