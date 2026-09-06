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

export type RoleIntent = 'technical' | 'business_product' | 'domain_expert';

interface RoleOption {
  id: RoleIntent;
  title: string;
  subtitle: string;
  icon: string;
}

interface RoleSelectionScreenProps {
  currentStep: number;
  totalSteps: number;
  onBackPress: () => void;
  onNext: (selectedIntent: RoleIntent) => void;
}

export const RoleSelectionScreen: React.FC<RoleSelectionScreenProps> = ({
  currentStep,
  totalSteps,
  onBackPress,
  onNext,
}) => {
  const [selectedIntent, setSelectedIntent] = useState<RoleIntent>('technical');

  const intents: RoleOption[] = [
    {
      id: 'technical',
      title: 'פיתוח שטכנולוגיה (Tech & Engineering)',
      subtitle: 'מתמקד/ת בקוד, ארכיטקטורה, תשתיות ומוצר טכנולוגי',
      icon: '💻',
    },
    {
      id: 'business_product',
      title: 'מוצר, שיווק ועסקים (Business & Product)',
      subtitle: 'מתמקד/ת באפיון מוצר, אסטרטגיה, גיוס לקוחות ומכירות',
      icon: '📈',
    },
    {
      id: 'domain_expert',
      title: 'מומחה/ית תחום (Domain & Market Expert)',
      subtitle: 'בעל/ת ניסיון מעמיק בתעשייה ספציפית (FinTech, AI, Health וכו\')',
      icon: '🧠',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <WizardHeader
        currentStep={currentStep}
        totalSteps={totalSteps}
        onBackPress={onBackPress}
        title="מה הכי מתאר אותך היום?"
      />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>
          💡 זוהי העדפת UX רכה בלבד להתאמת התצוגה, ואינה מהווה מגבלה או הגדרת תפקיד קבועה במערכת.
        </Text>

        <View style={styles.rolesGrid}>
          {intents.map((role) => {
            const isSelected = selectedIntent === role.id;
            return (
              <TouchableOpacity
                key={role.id}
                style={[styles.roleCard, isSelected && styles.selectedCard]}
                onPress={() => setSelectedIntent(role.id)}
                activeOpacity={0.8}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.icon}>{role.icon}</Text>
                  <View style={[styles.radioDot, isSelected && styles.selectedRadioDot]} />
                </View>

                <Text style={[styles.roleTitle, isSelected && styles.selectedRoleTitle]}>
                  {role.title}
                </Text>
                <Text style={styles.roleSubtitle}>{role.subtitle}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <WizardFooter onNext={() => onNext(selectedIntent)} nextLabel="המשך לשלב הבא" />
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
  rolesGrid: {
    gap: 12,
  },
  roleCard: {
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  icon: {
    fontSize: 24,
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
  roleTitle: {
    fontFamily: fonts.bold,
    fontSize: 17,
    color: colors.textPrimary,
    textAlign: 'right',
    marginBottom: 4,
  },
  selectedRoleTitle: {
    color: colors.primary,
  },
  roleSubtitle: {
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textSecondary,
    textAlign: 'right',
  },
});
