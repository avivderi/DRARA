import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import { colors, fonts } from '../../../theme/tokens';

export type WorkspaceTabType = 'idea_board' | 'roadmap' | 'decisions';

interface WorkspaceSubNavProps {
  activeTab: WorkspaceTabType;
  onTabPress: (tab: WorkspaceTabType) => void;
}

export const WorkspaceSubNav: React.FC<WorkspaceSubNavProps> = ({
  activeTab,
  onTabPress,
}) => {
  const tabs: Array<{ id: WorkspaceTabType; label: string }> = [
    { id: 'idea_board', label: 'Idea Board' },
    { id: 'roadmap', label: 'Roadmap' },
    { id: 'decisions', label: 'Decisions Log' },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tabButton, isActive && styles.activeTabButton]}
            onPress={() => onTabPress(tab.id)}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, isActive && styles.activeTabText]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 48,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceAlt,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
  },
  tabButton: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTabButton: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.textSecondary,
  },
  activeTabText: {
    fontFamily: fonts.bold,
    color: colors.primary,
  },
});
