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

export type UserRole = 'builder' | 'advisor' | 'specialist' | 'repeater';

interface RoleOption {
  id: UserRole;
  title: string;
  subtitle: string;
  icon: string;
}

interface RoleSelectionScreenProps {
  currentStep: number;
  totalSteps: number;
  onBackPress: () => void;
  onNext: (selectedRole: UserRole) => void;
}

export const RoleSelectionScreen: React.FC<RoleSelectionScreenProps> = ({
  currentStep,
  totalSteps,
  onBackPress,
  onNext,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('builder');

  const roles: RoleOption[] = [
    {
      id: 'builder',
      title: 'The Builder',
      subtitle: 'מפתח/ת עם רעיון ו-Repo קוד, מחפש/ת שותף עסקי/מוצר',
      icon: '💻',
    },
    {
      id: 'advisor',
      title: 'The Advisor / Mentor',
      subtitle: 'בעל/ת ניסיון שרוצה לייעץ ולבחון הצטרפות כשותף/ה',
      icon: '🧠',
    },
    {
      id: 'specialist',
      title: 'The Specialist',
      subtitle: 'מומחה DevOps / עיצוב / שיווק ומכירות שמחפש מיזם קונקרטי',
      icon: '🎯',
    },
    {
      id: 'repeater',
      title: 'The Repeater',
      subtitle: 'יזם/ית סדרתי/ת עם מספר רעיונות ובוחר/ת מה לחשוף ולמי',
      icon: '🚀',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <WizardHeader
        currentStep={currentStep}
        totalSteps={totalSteps}
        onBackPress={onBackPress}
        title="מהי ההגדרה שהכי מתאימה לך?"
      />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>
          בחירת התפקיד הראשי תעזור ל-AI להמליץ לך על השותפים והפרויקטים המתאימים ביותר
        </Text>

        <View style={styles.rolesGrid}>
          {roles.map((role) => {
            const isSelected = selectedRole === role.id;
            return (
              <TouchableOpacity
                key={role.id}
                style={[styles.roleCard, isSelected && styles.selectedCard]}
                onPress={() => setSelectedRole(role.id)}
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

      <WizardFooter onNext={() => onNext(selectedRole)} nextLabel="המשך לשלב הבא" />
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
