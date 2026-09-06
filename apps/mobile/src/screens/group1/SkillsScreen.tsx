import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
} from 'react-native';

import { WizardFooter } from '../../components/layout/footers/WizardFooter';
import { WizardHeader } from '../../components/layout/headers/WizardHeader';
import { colors, fonts } from '../../theme/tokens';

const SUGGESTED_SKILLS = [
  'React / React Native',
  'Node.js / TypeScript',
  'Python / AI / LLMs',
  'DevOps / AWS / K8s',
  'UI/UX Design & Figma',
  'Product Strategy',
  'B2B Sales & Enterprise',
  'Performance Marketing',
  'SEO & Content',
  'Financial Modeling',
  'Legal & Fundraising',
  'Go / Microservices',
];

interface SkillsScreenProps {
  currentStep: number;
  totalSteps: number;
  initialSkills?: string[];
  onBackPress: () => void;
  onNext: (skills: string[]) => Promise<void> | void;
}

export const SkillsScreen: React.FC<SkillsScreenProps> = ({
  currentStep,
  totalSteps,
  initialSkills = [],
  onBackPress,
  onNext,
}) => {
  const [selectedSkills, setSelectedSkills] = useState<string[]>(initialSkills);
  const [customSkill, setCustomSkill] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      if (selectedSkills.length >= 8) {
        setError('ניתן לבחור עד 8 כישורים מרכזיים');
        return;
      }
      setSelectedSkills([...selectedSkills, skill]);
      if (error) setError('');
    }
  };

  const addCustomSkill = () => {
    const trimmed = customSkill.trim();
    if (!trimmed) return;
    if (selectedSkills.includes(trimmed)) {
      setCustomSkill('');
      return;
    }
    if (selectedSkills.length >= 8) {
      setError('ניתן לבחור עד 8 כישורים מרכזיים');
      return;
    }
    setSelectedSkills([...selectedSkills, trimmed]);
    setCustomSkill('');
    if (error) setError('');
  };

  const handleNext = async () => {
    if (selectedSkills.length === 0) {
      setError('אנא בחר לפחות כישור או תחום מומחיות אחד');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await onNext(selectedSkills);
    } catch (err: any) {
      setError(err?.message || 'אירעה שגיאה בשמירת הכישורים');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <WizardHeader
        currentStep={currentStep}
        totalSteps={totalSteps}
        onBackPress={onBackPress}
        title="כישורים ותחומי מומחיות"
      />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>
          בחר את תחומי החוזקה והכישורים הבולטים ביותר שלך (1-8 כישורים).
        </Text>

        <View style={styles.chipsContainer}>
          {SUGGESTED_SKILLS.map((skill) => {
            const isSelected = selectedSkills.includes(skill);
            return (
              <TouchableOpacity
                key={skill}
                style={[styles.chip, isSelected && styles.selectedChip]}
                onPress={() => toggleSkill(skill)}
                activeOpacity={0.7}
              >
                <Text style={[styles.chipText, isSelected && styles.selectedChipText]}>
                  {isSelected ? '✓ ' : '+ '}
                  {skill}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.customSection}>
          <Text style={styles.label}>הוספת כישור מותאם אישית</Text>
          <View style={styles.customInputRow}>
            <TouchableOpacity style={styles.addBtn} onPress={addCustomSkill}>
              <Text style={styles.addBtnText}>הוסף</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.customInput}
              placeholder="למשל: PostgreSQL Optimization"
              placeholderTextColor={colors.textSecondary}
              value={customSkill}
              onChangeText={setCustomSkill}
              onSubmitEditing={addCustomSkill}
              textAlign="right"
            />
          </View>
        </View>

        {selectedSkills.length > 0 && (
          <View style={styles.selectedSection}>
            <Text style={styles.selectedCount}>
              נבחרו {selectedSkills.length} מתוך 8 כישורים:
            </Text>
            <View style={styles.chipsContainer}>
              {selectedSkills.map((skill) => (
                <TouchableOpacity
                  key={skill}
                  style={[styles.chip, styles.activeSelectedChip]}
                  onPress={() => toggleSkill(skill)}
                >
                  <Text style={styles.activeSelectedChipText}>{skill} ✕</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </ScrollView>

      <WizardFooter
        onNext={handleNext}
        nextLabel={loading ? 'שומר...' : 'המשך לשלב הבא'}
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
  chipsContainer: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  chip: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  selectedChip: {
    borderColor: colors.primary,
    backgroundColor: colors.surfaceAlt,
  },
  chipText: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.textPrimary,
  },
  selectedChipText: {
    color: colors.primary,
  },
  customSection: {
    marginBottom: 24,
  },
  label: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.textPrimary,
    textAlign: 'right',
    marginBottom: 8,
  },
  customInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  customInput: {
    flex: 1,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textPrimary,
  },
  addBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  addBtnText: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.white,
  },
  selectedSection: {
    marginTop: 8,
    marginBottom: 16,
  },
  selectedCount: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'right',
    marginBottom: 8,
  },
  activeSelectedChip: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  activeSelectedChipText: {
    color: colors.white,
    fontFamily: fonts.medium,
    fontSize: 13,
  },
  errorText: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.error,
    textAlign: 'right',
    marginTop: 4,
  },
});
