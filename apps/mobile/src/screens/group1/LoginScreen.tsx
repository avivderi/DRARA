import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import { SingleCtaFooter } from '../../components/layout/footers/SingleCtaFooter';
import { SimpleTitleHeader } from '../../components/layout/headers/SimpleTitleHeader';
import { colors, fonts } from '../../theme/tokens';

interface LoginScreenProps {
  onBackPress: () => void;
  onLoginSubmit: (email: string, pass: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onBackPress,
  onLoginSubmit,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    if (!email || !password) return;
    onLoginSubmit(email, password);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <SimpleTitleHeader title="התחברות לחשבון" onBackPress={onBackPress} />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>
          <Text style={styles.subtitle}>
            הכנס/י את פרטי החשבון שלך כדי להתחבר ל-DRARA
          </Text>

          <View style={styles.formStack}>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>כתובת דוא"ל</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="name@company.com"
                placeholderTextColor={colors.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>סיסמה</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor={colors.textSecondary}
                secureTextEntry
              />
            </View>

            <TouchableOpacity style={styles.forgotPassword} activeOpacity={0.7}>
              <Text style={styles.forgotText}>שכחת סיסמה?</Text>
            </TouchableOpacity>
          </View>
        </View>

        <SingleCtaFooter
          label="התחבר/י"
          onPress={handleSubmit}
          disabled={!email.trim() || !password.trim()}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'right',
    marginBottom: 24,
  },
  formStack: {
    gap: 16,
  },
  fieldGroup: {
    gap: 6,
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.textPrimary,
    textAlign: 'right',
  },
  input: {
    height: 52,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.textPrimary,
    textAlign: 'right',
  },
  forgotPassword: {
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  forgotText: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.primary,
  },
});
