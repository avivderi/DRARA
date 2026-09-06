// TODO: needs backend — Module 5 (Messaging/Public)
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  SafeAreaView,
  ScrollView,
} from 'react-native';

import { SingleCtaFooter } from '../../components/layout/footers/SingleCtaFooter';
import { SimpleTitleHeader } from '../../components/layout/headers/SimpleTitleHeader';
import { colors, fonts } from '../../theme/tokens';

interface EditProfileScreenProps {
  initialName?: string;
  initialHeadline?: string;
  initialBio?: string;
  onBackPress: () => void;
  onSaveProfile: (name: string, headline: string, bio: string) => Promise<void> | void;
}

export const EditProfileScreen: React.FC<EditProfileScreenProps> = ({
  initialName = 'אביב דרי',
  initialHeadline = 'Fullstack Architect & AI Agent Builder',
  initialBio = 'מפתח מערכות ענן ואינטליגנציה מלאכותית. הקמתי מוצרים מבוססי AI, pgvector ו-Microservices.',
  onBackPress,
  onSaveProfile,
}) => {
  const [name, setName] = useState(initialName);
  const [headline, setHeadline] = useState(initialHeadline);
  const [bio, setBio] = useState(initialBio);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!name.trim() || !headline.trim()) {
      setError('אנא הזן שם וכותרת מקצועית');
      return;
    }
    setError('');
    setLoading(true);
    Promise.resolve(onSaveProfile(name.trim(), headline.trim(), bio.trim()))
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : 'אירעה שגיאה בשמירת הפרופיל';
        setError(msg);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <SimpleTitleHeader title="עריכת פרטי פרופיל" onBackPress={onBackPress} />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>שם מלא</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (error) setError('');
              }}
              textAlign="right"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>כותרת אישית (Headline)</Text>
            <TextInput
              style={styles.input}
              value={headline}
              onChangeText={(text) => {
                setHeadline(text);
                if (error) setError('');
              }}
              textAlign="right"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>אודות (Bio)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={bio}
              onChangeText={setBio}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              textAlign="right"
            />
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>
      </ScrollView>

      <SingleCtaFooter
        label={loading ? 'שומר שינויים...' : 'שמור שינויים 💾'}
        onPress={handleSave}
        disabled={loading}
      />
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
    paddingTop: 16,
    paddingBottom: 90,
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1.5,
    borderRadius: 20,
    padding: 18,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.textPrimary,
    textAlign: 'right',
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textPrimary,
  },
  textArea: {
    minHeight: 100,
  },
  errorText: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.error,
    textAlign: 'right',
    marginTop: 4,
  },
});
