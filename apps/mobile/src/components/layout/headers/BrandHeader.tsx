import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import { colors, fonts } from '../../../theme/tokens';

interface BrandHeaderProps {
  onNotificationPress?: () => void;
  onProfilePress?: () => void;
  unreadNotificationsCount?: number;
  userAvatarUrl?: string;
}

export const BrandHeader: React.FC<BrandHeaderProps> = ({
  onNotificationPress,
  onProfilePress,
  unreadNotificationsCount = 0,
}) => {
  return (
    <View style={styles.headerContainer}>
      {/* Right side in RTL: Brand Logo */}
      <View style={styles.brandContainer}>
        <Text style={styles.brandText}>DRARA</Text>
        <View style={styles.accentDot} />
      </View>

      {/* Left side in RTL: Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onNotificationPress}
          activeOpacity={0.7}
        >
          <Text style={styles.iconText}>🔔</Text>
          {unreadNotificationsCount > 0 && <View style={styles.notificationBadge} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.avatarButton}
          onPress={onProfilePress}
          activeOpacity={0.7}
        >
          <Text style={styles.avatarText}>👤</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    height: 60,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceAlt,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandText: {
    fontFamily: fonts.bold,
    fontSize: 22,
    color: colors.primary,
    letterSpacing: 1,
  },
  accentDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accentPoint,
    marginLeft: 4,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 18,
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accentPoint,
  },
  avatarButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatarText: {
    fontSize: 18,
  },
});
