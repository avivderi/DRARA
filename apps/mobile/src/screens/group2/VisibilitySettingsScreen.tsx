import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';

import { WizardFooter } from '../../components/layout/footers/WizardFooter';
import { WizardHeader } from '../../components/layout/headers/WizardHeader';
import { colors, fonts } from '../../theme/tokens';

export type VisibilityLevel = 'public' | 'invite_only' | 'private_ai_recommend';

interface VisibilityOption {
  id: VisibilityLevel;
  title: string;
  badge: string;
  desc: string;
  privacyNotice: string;
}

const VISIBILITY_OPTIONS: VisibilityOption[] = [
  {
    id: 'public',
    title: 'ציבורי (Public)',
    badge: '🌐 מומלץ לחשיפה מקסימלית',
    desc: 'כל משתמש מאומת בפלטפורמה יוכל לראות את הרעיון ולבקש ליצור קשר.',
    privacyNotice: 'חובה: ניתוח סריקת AI או פיץ\' טקסטואלי.',
  },
  {
    id: 'invite_only',
    title: 'הזמנה בלבד (Invite Only)',
    badge: '🔒 חשיפה מבוקרת',
    desc: 'רק שותפים שאישרת להם גישה באופן יזום יוכלו לצפות בפרטי הרעיון המובילים.',
    privacyNotice: 'המאצ\'ים נוצרים ב-AI אך דורשים אישור ידני שלך.',
  },
  {
    id: 'private_ai_recommend',
    title: 'המלצת AI פרטית (Stealth / Private)',
    badge: '🕵️ דיסקרטיות מלאה',
    desc: 'פרטי הרעיון והקוד נשארים חסויים לחלוטין. ה-AI ממליץ על שותפים ללא חשיפת פרטי המיזם.',
    privacyNotice: 'רק לאחר NFC Handshake פיזי ייחשפו פרטי המיזם.',
  },
];

interface VisibilitySettingsScreenProps {
  currentStep: number;
  totalSteps: number;
  initialVisibility?: VisibilityLevel;
  onBackPress: () => void;
  onNext: (visibility: VisibilityLevel) => Promise<void> | void;
}

export const VisibilitySettingsScreen: React.FC<VisibilitySettingsScreenProps> = ({
  currentStep,
  totalSteps,
  initialVisibility = 'public',
  onBackPress,
  onNext,
}) => {
  const [visibility, setVisibility] = useState<VisibilityLevel>(initialVisibility);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleNext = () => {
    setError('');
    setLoading(true);
    Promise.resolve(onNext(visibility))
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : 'אירעה שגיאה בעדכון הגדרות הנראות';
        setError(msg);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <WizardHeader
        currentStep={currentStep}
        totalSteps={totalSteps}
        onBackPress={onBackPress}
        title="הגדרות נראות ופרטיות (Visibility)"
      />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>
          אתה שולט לחלוטין ברמת הדיסקרטיות של המיזם. תוכל לשנות הגדרה זו בכל עת.
        </Text>

        <View style={styles.optionsList}>
          {VISIBILITY_OPTIONS.map((opt) => {
            const isSelected = visibility === opt.id;
            return (
              <TouchableOpacity
                key={opt.id}
                style={[styles.card, isSelected && styles.selectedCard]}
                onPress={() => setVisibility(opt.id)}
                activeOpacity={0.8}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.badgeBox}>
                    <Text style={styles.badgeText}>{opt.badge}</Text>
                  </View>
                  <View style={[styles.radioDot, isSelected && styles.selectedRadioDot]} />
                </View>

                <Text style={[styles.cardTitle, isSelected && styles.selectedCardTitle]}>
                  {opt.title}
                </Text>
                <Text style={styles.cardDesc}>{opt.desc}</Text>
                <Text style={styles.privacyNotice}>{opt.privacyNotice}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </ScrollView>

      <WizardFooter
        onNext={handleNext}
        nextLabel={loading ? 'שומר...' : 'סקור ואשר פרסום 🚀'}
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
    paddingBottom: 24,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'right',
    marginBottom: 20,
  },
  optionsList: {
    gap: 12,
    marginBottom: 16,
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 16,
  },
  selectedCard: {
    borderColor: colors.primary,
    backgroundColor: colors.surfaceAlt,
  },
  cardHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  badgeBox: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  badgeText: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.textPrimary,
  },
  radioDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
  },
  selectedRadioDot: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  cardTitle: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.textPrimary,
    textAlign: 'right',
    marginBottom: 4,
  },
  selectedCardTitle: {
    color: colors.primary,
  },
  cardDesc: {
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textSecondary,
    textAlign: 'right',
    marginBottom: 8,
  },
  privacyNotice: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.primary,
    textAlign: 'right',
  },
  errorText: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.error,
    textAlign: 'right',
    marginTop: 4,
  },
});
