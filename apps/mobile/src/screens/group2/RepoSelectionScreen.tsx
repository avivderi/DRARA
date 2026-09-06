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

export interface GitHubRepoItem {
  fullName: string; // e.g. "avivderi/DRARA"
  description: string;
  language: string;
  isPrivate: boolean;
  updatedAt: string;
}

const SAMPLE_REPOS: GitHubRepoItem[] = [
  {
    fullName: 'avivderi/DRARA',
    description: 'Co-Founder Matching Platform with pgvector and NFC physical handshake',
    language: 'TypeScript / Python',
    isPrivate: true,
    updatedAt: 'עודכן היום',
  },
  {
    fullName: 'avivderi/ai-agent-kit',
    description: 'Autonomous multi-agent framework built with Node.js and FastAPI',
    language: 'TypeScript',
    isPrivate: false,
    updatedAt: 'עודכן לפני יומיים',
  },
  {
    fullName: 'avivderi/fintech-microservices',
    description: 'High throughput payment engine with Go and PostgreSQL',
    language: 'Go',
    isPrivate: false,
    updatedAt: 'עודכן לפני שבוע',
  },
];

interface RepoSelectionScreenProps {
  currentStep: number;
  totalSteps: number;
  repos?: GitHubRepoItem[];
  selectedRepoFullName?: string;
  onBackPress: () => void;
  onSelectRepo: (repoFullName: string) => void;
}

export const RepoSelectionScreen: React.FC<RepoSelectionScreenProps> = ({
  currentStep,
  totalSteps,
  repos = SAMPLE_REPOS,
  selectedRepoFullName = '',
  onBackPress,
  onSelectRepo,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRepo, setSelectedRepo] = useState(selectedRepoFullName || repos[0]?.fullName || '');
  const [error, setError] = useState('');

  const filteredRepos = repos.filter((r) =>
    r.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNext = () => {
    if (!selectedRepo) {
      setError('אנא בחר Repository לסריקה');
      return;
    }
    setError('');
    onSelectRepo(selectedRepo);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <WizardHeader
        currentStep={currentStep}
        totalSteps={totalSteps}
        onBackPress={onBackPress}
        title="בחירת Repository לסריקת AI"
      />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>
          בחר את ה-Repository המייצג את המיזם. ה-AI יבצע ניתוח סמנטי בלבד.
        </Text>

        <View style={styles.searchBox}>
          <TextInput
            style={styles.searchInput}
            placeholder="🔍 חפש לפי שם repo או טכנולוגיה..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            textAlign="right"
          />
        </View>

        <View style={styles.repoList}>
          {filteredRepos.map((repo) => {
            const isSelected = selectedRepo === repo.fullName;
            return (
              <TouchableOpacity
                key={repo.fullName}
                style={[styles.repoCard, isSelected && styles.selectedRepoCard]}
                onPress={() => {
                  setSelectedRepo(repo.fullName);
                  if (error) setError('');
                }}
                activeOpacity={0.8}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.badgeRow}>
                    <Text style={styles.langBadge}>{repo.language}</Text>
                    {repo.isPrivate && <Text style={styles.privateBadge}>🔒 Private</Text>}
                  </View>
                  <View style={[styles.radioDot, isSelected && styles.selectedRadioDot]} />
                </View>

                <Text style={[styles.repoName, isSelected && styles.selectedRepoName]}>
                  {repo.fullName}
                </Text>
                <Text style={styles.repoDesc}>{repo.description}</Text>
                <Text style={styles.updatedAt}>{repo.updatedAt}</Text>
              </TouchableOpacity>
            );
          })}

          {filteredRepos.length === 0 && (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>לא נמצאו Repositories התואמים לחיפוש</Text>
            </View>
          )}
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </ScrollView>

      <WizardFooter onNext={handleNext} nextLabel="התחל סריקת AI ⚡" />
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
    marginBottom: 16,
  },
  searchBox: {
    marginBottom: 16,
  },
  searchInput: {
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
  repoList: {
    gap: 12,
    marginBottom: 16,
  },
  repoCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 16,
  },
  selectedRepoCard: {
    borderColor: colors.primary,
    backgroundColor: colors.surfaceAlt,
  },
  cardHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: 'row-reverse',
    gap: 6,
  },
  langBadge: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: colors.primary,
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  privateBadge: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: colors.textSecondary,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
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
  repoName: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.textPrimary,
    textAlign: 'right',
    marginBottom: 4,
  },
  selectedRepoName: {
    color: colors.primary,
  },
  repoDesc: {
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textSecondary,
    textAlign: 'right',
    marginBottom: 8,
  },
  updatedAt: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'right',
  },
  emptyBox: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textSecondary,
  },
  errorText: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.error,
    textAlign: 'right',
    marginTop: 4,
  },
});
