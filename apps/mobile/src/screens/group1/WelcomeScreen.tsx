import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';

import { colors, fonts } from '../../theme/tokens';
import { DraraLogo } from '../../components/common/DraraLogo';
import { initAuthFromUrl } from '../../services/authService';
import { isAuthenticated } from '../../services/authStore';

interface WelcomeScreenProps {
  onGoogleSignIn: () => void;
  onGitHubSignIn: () => void;
  onEmailSignIn: () => void;
  onAuthSuccess?: () => void;
  onOpenDebugMenu?: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onGoogleSignIn,
  onGitHubSignIn,
  onEmailSignIn,
  onAuthSuccess,
  onOpenDebugMenu,
}) => {
  useEffect(() => {
    initAuthFromUrl().then((success) => {
      if (success) {
        if (onAuthSuccess) onAuthSuccess();
        return;
      }
      void isAuthenticated().then((authed) => {
        if (authed && onAuthSuccess) {
          onAuthSuccess();
        }
      });
    });
  }, []);
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Brand Logo Display */}
        <TouchableOpacity
          style={{ alignItems: 'center', marginVertical: 16 }}
          activeOpacity={0.9}
          onLongPress={onOpenDebugMenu}
        >
          <DraraLogo fontSize={44} />
        </TouchableOpacity>

        {/* Brand Monogram Tag */}
        <View style={styles.tagBadge}>
          <View style={styles.tagDot} />
          <Text style={styles.tagText}>drara platform</Text>
        </View>

        {__DEV__ && onOpenDebugMenu && (
          <TouchableOpacity
            style={styles.devBadge}
            onPress={onOpenDebugMenu}
            activeOpacity={0.8}
          >
            <Text style={styles.devBadgeText}>🛠️ DEV: תפריט 49 מסכים</Text>
          </TouchableOpacity>
        )}

        {/* Minimal Vector Illustration */}
        <View style={styles.illustrationContainer}>
          <View style={styles.outerCircle}>
            <View style={styles.innerCircle1} />
            <View style={styles.innerCircle2} />
            <View style={styles.synergyDot} />
          </View>
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
  outerCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  innerCircle1: {
    position: 'absolute',
    left: 10,
    top: 30,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  innerCircle2: {
    position: 'absolute',
    right: 10,
    bottom: 30,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  synergyDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.accentPoint,
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
  devBadge: {
    backgroundColor: '#FFFBEB',
    borderColor: '#F59E0B',
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    alignSelf: 'center',
    marginBottom: 16,
  },
  devBadgeText: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: '#B45309',
  },
});
