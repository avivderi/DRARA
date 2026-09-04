import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  I18nManager,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// Enable RTL globally for Hebrew
try {
  if (!I18nManager.isRTL) {
    I18nManager.forceRTL(true);
  }
} catch {
  // Ignore on web
}

import { LoginScreen } from './src/screens/group1/LoginScreen';
import { RoleSelectionScreen } from './src/screens/group1/RoleSelectionScreen';
import { WelcomeScreen } from './src/screens/group1/WelcomeScreen';
import { AIScanLoadingScreen } from './src/screens/group2/AIScanLoadingScreen';
import { MatchesFeedScreen } from './src/screens/group3/MatchesFeedScreen';
import { NFCHandshakeScreen } from './src/screens/group4/NFCHandshakeScreen';
import { NFCSuccessScreen } from './src/screens/group4/NFCSuccessScreen';
import { colors, fonts } from './src/theme/tokens';

/* eslint-disable @typescript-eslint/no-var-requires */
const fontRegular = require('./assets/fonts/GoogleSans-Regular.ttf') as number;
const fontMedium = require('./assets/fonts/GoogleSans-Medium.ttf') as number;
const fontSemiBold = require('./assets/fonts/GoogleSans-SemiBold.ttf') as number;
const fontBold = require('./assets/fonts/GoogleSans-Bold.ttf') as number;
/* eslint-enable @typescript-eslint/no-var-requires */

type ScreenId =
  | 'welcome'
  | 'login'
  | 'role_selection'
  | 'ai_scan'
  | 'matches_feed'
  | 'nfc_handshake'
  | 'nfc_success';

const SCREENS: { id: ScreenId; title: string }[] = [
  { id: 'welcome', title: '1. ברוכים הבאים' },
  { id: 'login', title: '2. התחברות' },
  { id: 'role_selection', title: '5. בחירת תפקיד' },
  { id: 'ai_scan', title: '14. ניתוח AI' },
  { id: 'matches_feed', title: '19. פיד התאמות' },
  { id: 'nfc_handshake', title: '44. NFC Handshake' },
  { id: 'nfc_success', title: '46. הצלחת NFC' },
];

export default function App() {
  const [fontsLoaded] = useFonts({
    'GoogleSans-Regular': fontRegular,
    'GoogleSans-Medium': fontMedium,
    'GoogleSans-SemiBold': fontSemiBold,
    'GoogleSans-Bold': fontBold,
  });

  const [currentScreen, setCurrentScreen] = useState<ScreenId>('welcome');


  if (!fontsLoaded) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return (
          <WelcomeScreen
            onNavigateLogin={() => setCurrentScreen('login')}
            onNavigateRegister={() => setCurrentScreen('role_selection')}
          />
        );
      case 'login':
        return (
          <LoginScreen
            onBack={() => setCurrentScreen('welcome')}
            onLoginSuccess={() => setCurrentScreen('matches_feed')}
          />
        );
      case 'role_selection':
        return (
          <RoleSelectionScreen
            onBack={() => setCurrentScreen('welcome')}
            onSelectRole={() => setCurrentScreen('ai_scan')}
          />
        );
      case 'ai_scan':
        return (
          <AIScanLoadingScreen
            githubUsername="avivderi"
            onScanComplete={() => setCurrentScreen('matches_feed')}
          />
        );
      case 'matches_feed':
        return (
          <MatchesFeedScreen
            ideaId="demo-idea-1"
            onSelectCandidate={() => setCurrentScreen('nfc_handshake')}
          />
        );
      case 'nfc_handshake':
        return (
          <NFCHandshakeScreen
            targetUserId="user-456"
            targetUserName="רועי כהן"
            onHandshakeSuccess={() => setCurrentScreen('nfc_success')}
            onCancel={() => setCurrentScreen('matches_feed')}
          />
        );
      case 'nfc_success':
        return (
          <NFCSuccessScreen
            partnerName="רועי כהן"
            onContinueToWorkspace={() => setCurrentScreen('matches_feed')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      {/* Screen Preview Switcher Bar */}
      <View style={styles.switcherBar}>
        <Text style={styles.switcherLabel}>תצוגת מסכים:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.switcherScroll}>
          {SCREENS.map((s) => (
            <TouchableOpacity
              key={s.id}
              style={[
                styles.switcherChip,
                currentScreen === s.id && styles.switcherChipActive,
              ]}
              onPress={() => setCurrentScreen(s.id)}
            >
              <Text
                style={[
                  styles.switcherChipText,
                  currentScreen === s.id && styles.switcherChipTextActive,
                ]}
              >
                {s.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Screen Content */}
      <View style={styles.screenContainer}>{renderCurrentScreen()}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingScreen: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  switcherBar: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  switcherLabel: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.primary,
  },
  switcherScroll: {
    gap: 6,
    paddingRight: 8,
  },
  switcherChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.surfaceAlt,
  },
  switcherChipActive: {
    backgroundColor: colors.primary,
  },
  switcherChipText: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.textSecondary,
  },
  switcherChipTextActive: {
    color: colors.surface,
    fontFamily: fonts.bold,
  },
  screenContainer: {
    flex: 1,
  },
});

