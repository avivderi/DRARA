import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import { colors, fonts } from '../../../theme/tokens';

interface SimpleTitleHeaderProps {
  title: string;
  onBackPress?: () => void;
  rightAction?: React.ReactNode;
}

export const SimpleTitleHeader: React.FC<SimpleTitleHeaderProps> = ({
  title,
  onBackPress,
  rightAction,
}) => {
  return (
    <View style={styles.headerContainer}>
      {onBackPress ? (
        <TouchableOpacity style={styles.backButton} onPress={onBackPress} activeOpacity={0.7}>
          <Text style={styles.backArrowText}>➔</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}

      <Text style={styles.titleText} numberOfLines={1}>
        {title}
      </Text>

      {rightAction ? rightAction : <View style={styles.placeholder} />}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    height: 56,
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
  titleText: {
    fontFamily: fonts.semiBold,
    fontSize: 18,
    color: colors.textPrimary,
    textAlign: 'center',
    flex: 1,
    marginHorizontal: 12,
  },
  placeholder: {
    width: 36,
  },
});
