import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { colors, fonts } from '../../theme/tokens';

interface UserAvatarProps {
  size?: number;
  avatarUrl?: string | null;
  name?: string | null;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  size = 40,
  avatarUrl,
  name,
}) => {
  const [imageError, setImageError] = React.useState(false);

  const getInitials = (userName?: string | null): string => {
    if (!userName) return '👤';
    const parts = userName.trim().split(' ');
    if (parts.length >= 2 && parts[0] && parts[1]) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return userName.slice(0, 2).toUpperCase();
  };

  const hasValidUrl = Boolean(avatarUrl && !imageError && avatarUrl.startsWith('http'));

  if (hasValidUrl && avatarUrl) {
    return (
      <Image
        source={{ uri: avatarUrl }}
        style={[
          styles.image,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
          },
        ]}
        onError={() => setImageError(true)}
      />
    );
  }

  const fontSize = Math.max(12, Math.round(size * 0.38));

  return (
    <View
      style={[
        styles.fallbackContainer,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}
    >
      <Text style={[styles.fallbackText, { fontSize }]}>
        {getInitials(name)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    backgroundColor: colors.surfaceAlt,
  },
  fallbackContainer: {
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackText: {
    fontFamily: fonts.bold,
    color: colors.primary,
  },
});
