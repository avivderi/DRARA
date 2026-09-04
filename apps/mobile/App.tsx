import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { LoginScreen } from './src/screens/group1/LoginScreen';
import { RoleSelectionScreen } from './src/screens/group1/RoleSelectionScreen';
import { WelcomeScreen } from './src/screens/group1/WelcomeScreen';
import { AIScanLoadingScreen } from './src/screens/group2/AIScanLoadingScreen';
import { MatchesFeedScreen } from './src/screens/group3/MatchesFeedScreen';
import { NFCHandshakeScreen } from './src/screens/group4/NFCHandshakeScreen';
import { NFCSuccessScreen } from './src/screens/group4/NFCSuccessScreen';
import { colors, fonts } from './src/theme/tokens';

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
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('welcome');
  const [activeTab, setActiveTab] = useState<'home' | 'discover' | 'inbox' | 'profile'>('home');

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
      <View style={styles.screenContainer}>
        {currentScreen === 'welcome' && (
          <WelcomeScreen
            onGoogleSignIn={() => setCurrentScreen('role_selection')}
            onGitHubSignIn={() => setCurrentScreen('role_selection')}
            onEmailSignIn={() => setCurrentScreen('login')}
          />
        )}
        {currentScreen === 'login' && (
          <LoginScreen
            onBackPress={() => setCurrentScreen('welcome')}
            onLoginSubmit={() => setCurrentScreen('matches_feed')}
          />
        )}
        {currentScreen === 'role_selection' && (
          <RoleSelectionScreen
            currentStep={1}
            totalSteps={4}
            onBackPress={() => setCurrentScreen('welcome')}
            onNext={() => setCurrentScreen('ai_scan')}
          />
        )}
        {currentScreen === 'ai_scan' && (
          <AIScanLoadingScreen
            ideaId="demo-idea-1"
            onScanComplete={() => setCurrentScreen('matches_feed')}
            onScanFailed={() => setCurrentScreen('matches_feed')}
          />
        )}
        {currentScreen === 'matches_feed' && (
          <MatchesFeedScreen
            ideaId="demo-idea-1"
            activeTab={activeTab}
            onTabPress={setActiveTab}
            onCandidatePress={() => setCurrentScreen('nfc_handshake')}
          />
        )}
        {currentScreen === 'nfc_handshake' && (
          <NFCHandshakeScreen
            matchId="match-123"
            partnerName="רועי כהן"
            onBackPress={() => setCurrentScreen('matches_feed')}
            onHandshakeSuccess={() => setCurrentScreen('nfc_success')}
          />
        )}
        {currentScreen === 'nfc_success' && (
          <NFCSuccessScreen
            partnerName="רועי כהן"
            permissionsGranted={['GitHub Read Access', 'Roadmap Access']}
            onOpenWorkspace={() => setCurrentScreen('matches_feed')}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
