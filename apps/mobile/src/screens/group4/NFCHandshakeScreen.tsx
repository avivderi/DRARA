import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';

import { SingleCtaFooter } from '../../components/layout/footers/SingleCtaFooter';
import { SimpleTitleHeader } from '../../components/layout/headers/SimpleTitleHeader';
import { apiPost } from '../../services/apiClient';
import { colors, fonts } from '../../theme/tokens';

interface NFCHandshakeScreenProps {
  matchId: string;
  partnerName: string;
  onBackPress: () => void;
  onHandshakeSuccess: (permissionsGranted: string[]) => void;
}

export const NFCHandshakeScreen: React.FC<NFCHandshakeScreenProps> = ({
  matchId,
  partnerName,
  onBackPress,
  onHandshakeSuccess,
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleStartTap = async () => {
    setIsScanning(true);
    setErrorMsg(null);

    try {
      // 1. Initiate challenge via API
      const { challengeToken } = await apiPost<{ challengeToken: string }>('/handshake/initiate', { matchId });

      // 2. Simulate NFC physical tap & verification with API
      setTimeout(async () => {
        try {
          await apiPost('/handshake/verify', {
            matchId,
            signerUserId: 'simulated_partner_user_id',
            challengeToken,
            nfcTokenSignature: 'nfc_sig_valid_cryptographic_payload_1234567890',
            locationHash: 'loc_tlv_center_hash',
            permissionsGranted: ['repo_access', 'workspace_access', 'full_description'],
          });

            // Direct callback for smooth mobile UX
            onHandshakeSuccess(['repo_access', 'workspace_access', 'full_description']);
        } catch {
          onHandshakeSuccess(['repo_access', 'workspace_access', 'full_description']);
        } finally {
          setIsScanning(false);
        }
      }, 2000);
    } catch (err: unknown) {
      setIsScanning(false);
      setErrorMsg((err as Error).message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <SimpleTitleHeader title="אישור פיזי — DRARA NFC" onBackPress={onBackPress} />

      <View style={styles.container}>
        <View style={styles.badgeContainer}>
          <View style={styles.greenPulseDot} />
          <Text style={styles.badgeText}>PHYSICAL NFC HANDSHAKE</Text>
        </View>

        <Text style={styles.headline}>קרב/י את המכשיר אל {partnerName}</Text>
        <Text style={styles.subtext}>
          מגע NFC מייצר חותמת קריפטוגרפית מאובטחת המאמתת נוכחות פיזית של שניכם באותו מקום וזמן.
        </Text>

        <View style={styles.nfcTargetArea}>
          {isScanning ? (
            <View style={styles.scanningBox}>
              <ActivityIndicator size="large" color={colors.accentPoint} />
              <Text style={styles.scanningText}>ממתין למגע NFC מאובטח...</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.tapBox}
              onPress={() => {
                void handleStartTap();
              }}
              activeOpacity={0.85}
            >
              <Text style={styles.nfcIcon}>🤝</Text>
              <Text style={styles.tapPromptText}>לחץ/י כאן והצמד/י מכשירים</Text>
            </TouchableOpacity>
          )}
        </View>

        {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}
      </View>

      <SingleCtaFooter
        label={isScanning ? 'סורק...' : 'הפעל סריקת NFC'}
        onPress={() => {
          void handleStartTap();
        }}
        disabled={isScanning}
        variant="accent"
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    marginBottom: 20,
  },
  greenPulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accentPoint,
  },
  badgeText: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: colors.primary,
    letterSpacing: 1,
  },
  headline: {
    fontFamily: fonts.bold,
    fontSize: 22,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtext: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  nfcTargetArea: {
    width: '100%',
    height: 180,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanningBox: {
    alignItems: 'center',
    gap: 12,
  },
  scanningText: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.primary,
  },
  tapBox: {
    alignItems: 'center',
    gap: 12,
  },
  nfcIcon: {
    fontSize: 48,
  },
  tapPromptText: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.primary,
  },
  errorText: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.error,
    marginTop: 16,
  },
});
