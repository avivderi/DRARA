import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import { colors, fonts } from '../../../theme/tokens';

interface ChatHeaderProps {
  participantName: string;
  isOnline?: boolean;
  onBackPress?: () => void;
  onInfoPress?: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  participantName,
  isOnline = true,
  onBackPress,
  onInfoPress,
}) => {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity style={styles.backButton} onPress={onBackPress} activeOpacity={0.7}>
        <Text style={styles.backArrowText}>➔</Text>
      </TouchableOpacity>

      <View style={styles.userInfo}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{participantName.charAt(0)}</Text>
          {isOnline && <View style={styles.onlineDot} />}
        </View>
        <View style={styles.userDetails}>
          <Text style={styles.nameText}>{participantName}</Text>
          <Text style={styles.statusText}>{isOnline ? 'מחובר/ת עכשיו' : 'לא מחובר/ת'}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.infoButton} onPress={onInfoPress} activeOpacity={0.7}>
        <Text style={styles.infoIcon}>ℹ️</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    height: 64,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceAlt,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrowText: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    marginHorizontal: 12,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.white,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.accentPoint,
    borderWidth: 2,
    borderColor: colors.surface,
  },
  userDetails: {
    flex: 1,
  },
  nameText: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.textPrimary,
    textAlign: 'right',
  },
  statusText: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'right',
  },
  infoButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoIcon: {
    fontSize: 18,
  },
});
