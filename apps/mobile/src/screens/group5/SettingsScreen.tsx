import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Switch,
} from 'react-native';

import { SimpleTitleHeader } from '../../components/layout/headers/SimpleTitleHeader';
import { apiClient } from '../../services/apiClient';
import { colors, fonts } from '../../theme/tokens';

interface SettingsScreenProps {
  onBackPress: () => void;
  onLogout: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onBackPress,
  onLogout,
}) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [nfcAutoPairing, setNfcAutoPairing] = useState(true);

  const handleLogoutPress = async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // Ignore network errors during logout
    }
    onLogout();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <SimpleTitleHeader title="הגדרות חשבון ואפליקציה" onBackPress={onBackPress} />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>🔔 התראות והודעות</Text>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>התראות PUSH על מאצ'ים חדשים</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>📲 NFC & אבטחה</Text>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>אימות NFC Handshake מהיר</Text>
            <Switch
              value={nfcAutoPairing}
              onValueChange={setNfcAutoPairing}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>ℹ️ אודות DRARA Platform</Text>
          <Text style={styles.infoText}>גרסה: 1.0.0 (Build 2026)</Text>
          <Text style={styles.infoText}>מנוע AI: Voyage AI (`voyage-3-lite`) + pgvector</Text>
          <Text style={styles.infoText}>אבטחת אימות: HMAC-SHA256 Challenge/Response</Text>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={() => { void handleLogoutPress(); }} activeOpacity={0.8}>
          <Text style={styles.logoutBtnText}>🚪 התנתקות מהחשבון</Text>
        </TouchableOpacity>
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
    gap: 14,
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 16,
  },
  sectionTitle: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.textPrimary,
    textAlign: 'right',
    marginBottom: 12,
  },
  settingRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingLabel: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.textPrimary,
  },
  infoText: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'right',
    marginBottom: 4,
  },
  logoutBtn: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.error,
    borderWidth: 1.5,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  logoutBtnText: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.error,
  },
});
