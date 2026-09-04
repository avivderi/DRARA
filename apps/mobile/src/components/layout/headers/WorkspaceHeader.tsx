import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import { colors, fonts } from '../../../theme/tokens';

interface WorkspaceHeaderProps {
  projectName: string;
  coFounders: Array<{ name: string; avatarUrl?: string }>;
  onBackPress?: () => void;
  onSettingsPress?: () => void;
}

export const WorkspaceHeader: React.FC<WorkspaceHeaderProps> = ({
  projectName,
  coFounders,
  onBackPress,
  onSettingsPress,
}) => {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity style={styles.backButton} onPress={onBackPress} activeOpacity={0.7}>
        <Text style={styles.backArrowText}>➔</Text>
      </TouchableOpacity>

      <View style={styles.projectInfo}>
        <Text style={styles.projectTitle} numberOfLines={1}>
          {projectName}
        </Text>

        {/* Overlapping Avatars */}
        <View style={styles.avatarsRow}>
          {coFounders.slice(0, 3).map((founder, index) => (
            <View
              key={index}
              style={[
                styles.avatarBadge,
                { marginLeft: index > 0 ? -10 : 0, zIndex: 10 - index },
              ]}
            >
              <Text style={styles.avatarInitial}>{founder.name.charAt(0)}</Text>
            </View>
          ))}
        </View>
      </View>

      <TouchableOpacity style={styles.settingsButton} onPress={onSettingsPress} activeOpacity={0.7}>
        <Text style={styles.settingsIcon}>⚙️</Text>
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
  projectInfo: {
    flex: 1,
    marginHorizontal: 12,
    alignItems: 'flex-end',
  },
  projectTitle: {
    fontFamily: fonts.bold,
    fontSize: 17,
    color: colors.textPrimary,
  },
  avatarsRow: {
    flexDirection: 'row-reverse',
    marginTop: 2,
  },
  avatarBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontFamily: fonts.bold,
    fontSize: 10,
    color: colors.white,
  },
  settingsButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsIcon: {
    fontSize: 18,
  },
});
