import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import Svg, { Circle, Path, G } from 'react-native-svg';

import { colors, fonts } from '../../theme/tokens';

interface WelcomeScreenProps {
  onGoogleSignIn: () => void;
  onGitHubSignIn: () => void;
  onEmailSignIn: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onGoogleSignIn,
  onGitHubSignIn,
  onEmailSignIn,
}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Brand Monogram Tag */}
        <View style={styles.tagBadge}>
          <View style={styles.tagDot} />
          <Text style={styles.tagText}>DRARA PLATFORM</Text>
        </View>

        {/* Minimal Vector Illustration */}
        <View style={styles.illustrationContainer}>
          <Svg width={180} height={180} viewBox="0 0 200 200" fill="none">
            <Circle cx="100" cy="100" r="82" stroke={colors.border} strokeWidth="1" strokeDasharray="3 4" opacity={0.45} />
            <Path d="M 52 118 C 76 68, 124 136, 148 82" stroke={colors.primary} strokeWidth="2" strokeLinecap="round" />
            <Path d="M 64 122 C 86 90, 114 110, 136 78" stroke={colors.primary} strokeWidth="1" opacity={0.25} strokeLinecap="round" />
            
            {/* Node 1: Origin */}
            <G>
              <Circle cx="148" cy="82" r="14" fill={colors.surface} stroke={colors.primary} strokeWidth="2" />
              <Circle cx="148" cy="82" r="5" fill={colors.primary} />
            </G>

            {/* Node 2: Partner */}
            <G>
              <Circle cx="52" cy="118" r="14" fill={colors.surface} stroke={colors.primary} strokeWidth="2" />
              <Circle cx="52" cy="118" r="5" fill={colors.primary} />
            </G>

            {/* Synergy Node */}
            <Circle cx="104" cy="98" r="3" fill={colors.accentPoint} />
          </Svg>
        </View>

        {/* Headline & Description */}
        <View style={styles.textContainer}>
          <Text style={styles.headline}>
            תמצא את השותף שיביא את הרעיון שלך לחיים
          </Text>
          <Text style={styles.description}>
            DRARA מבינה את הפרויקט שלך, מוצאת לך את האדם הנכון — והחיבור נחתם בלחיצת יד אמיתית, לא רק בהודעה.
          </Text>
        </View>

        {/* Action Stack */}
        <View style={styles.actionsStack}>
          <TouchableOpacity
            style={styles.googleButton}
            onPress={onGoogleSignIn}
            activeOpacity={0.85}
          >
            <Text style={styles.googleButtonText}>התחברות עם Google</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.githubButton}
            onPress={onGitHubSignIn}
            activeOpacity={0.85}
          >
            <Text style={styles.githubButtonText}>התחברות עם GitHub</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.emailButton}
            onPress={onEmailSignIn}
            activeOpacity={0.7}
          >
            <Text style={styles.emailButtonText}>התחברות באמצעות דוא"ל</Text>
          </TouchableOpacity>
        </View>
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
    paddingTop: 24,
    paddingBottom: 32,
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: '100%',
  },
  tagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  tagDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  tagText: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: colors.primary,
    letterSpacing: 1,
  },
  illustrationContainer: {
    marginVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  headline: {
    fontFamily: fonts.bold,
    fontSize: 26,
    lineHeight: 34,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 12,
  },
  actionsStack: {
    width: '100%',
    gap: 12,
  },
  googleButton: {
    height: 52,
    backgroundColor: colors.primary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleButtonText: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.white,
  },
  githubButton: {
    height: 52,
    backgroundColor: colors.textPrimary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  githubButtonText: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.white,
  },
  emailButton: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emailButtonText: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.textSecondary,
    textDecorationLine: 'underline',
  },
});
