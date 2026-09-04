import React from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';

import { SingleCtaFooter } from '../../components/layout/footers/SingleCtaFooter';
import { colors, fonts } from '../../theme/tokens';

interface NFCSuccessScreenProps {
  partnerName: string;
  permissionsGranted: string[];
  onOpenWorkspace: () => void;
}

export const NFCSuccessScreen: React.FC<NFCSuccessScreenProps> = ({
  partnerName,
  permissionsGranted,
  onOpenWorkspace,
}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Flash Circle Badge */}
        <View style={styles.successIconBadge}>
          <Text style={styles.checkIcon}>✓</Text>
        </View>

        <Text style={styles.headline}>החיבור נחתם בהצלחה!</Text>
        <Text style={styles.subtext}>
          אימתתם נוכחות פיזית עם {partnerName}. הרשאות הפרויקט נפתחו כעת בהתאם לשליטת היזם.
        </Text>

        <View style={styles.permissionsCard}>
          <Text style={styles.cardTitle}>הרשאות שנפתחו למעקב:</Text>
          {permissionsGranted.map((perm, idx) => (
            <View key={idx} style={styles.permRow}>
              <Text style={styles.permCheck}>✓</Text>
              <Text style={styles.permText}>
                {perm === 'repo_access'
                  ? 'גישה ל-GitHub Repository המלא'
                  : perm === 'workspace_access'
                  ? 'גישה ל-Co-Building Workspace (Idea Board, Roadmap)'
                  : 'צפייה בתיאור המלא ובמסמכי הארכיטקטורה'}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <SingleCtaFooter label="כניסה ל-Workspace המשותף" onPress={onOpenWorkspace} />
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  successIconBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.accentPoint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: colors.accentPoint,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  checkIcon: {
    fontFamily: fonts.bold,
    fontSize: 40,
    color: colors.textPrimary,
  },
  headline: {
    fontFamily: fonts.bold,
    fontSize: 24,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtext: {
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  permissionsCard: {
    width: '100%',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
    gap: 12,
  },
  cardTitle: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.textPrimary,
    textAlign: 'right',
    marginBottom: 4,
  },
  permRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 10,
  },
  permCheck: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.primary,
  },
  permText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textPrimary,
    flex: 1,
    textAlign: 'right',
  },
});
