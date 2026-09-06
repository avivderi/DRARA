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

import { SimpleTitleHeader } from '../../components/layout/headers/SimpleTitleHeader';
import { apiGet } from '../../services/apiClient';
import { colors, fonts } from '../../theme/tokens';

const POPULAR_TAGS = ['Backend', 'DevOps', 'AI / ML', 'React Native', 'FinTech', 'Python', 'B2B Sales'];

interface IdeaSearchScreenProps {
  onBackPress: () => void;
  onSearchSubmit: (query: string, selectedTags: string[]) => void;
}


export const IdeaSearchScreen: React.FC<IdeaSearchScreenProps> = ({
  onBackPress,
  onSearchSubmit,
}) => {
  const [query, setQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSearch = () => {
    const tagsParam = selectedTags.join(',');
    apiGet(`/ideas/public/search?q=${encodeURIComponent(query.trim())}&tags=${encodeURIComponent(tagsParam)}`).catch(() => {});
    onSearchSubmit(query.trim(), selectedTags);
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      <SimpleTitleHeader title="חיפושים וסינון מתקדם" onBackPress={onBackPress} />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>מילות מפתח</Text>
          <TextInput
            style={styles.input}
            placeholder="חפש לפי שם מיזם, טכנולוגיה או תיאור..."
            placeholderTextColor={colors.textSecondary}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch}
            textAlign="right"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>תגיות פופולריות</Text>
          <View style={styles.chipsRow}>
            {POPULAR_TAGS.map((tag) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <TouchableOpacity
                  key={tag}
                  style={[styles.chip, isSelected && styles.selectedChip]}
                  onPress={() => toggleTag(tag)}
                >
                  <Text style={[styles.chipText, isSelected && styles.selectedChipText]}>
                    {isSelected ? '✓ ' : '+ '}
                    {tag}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footerBar}>
        <TouchableOpacity style={styles.searchBtn} onPress={handleSearch} activeOpacity={0.8}>
          <Text style={styles.searchBtnText}>🔍 חפש מיזמים ציבוריים</Text>
        </TouchableOpacity>
      </View>
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
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.textPrimary,
    textAlign: 'right',
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1.5,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textPrimary,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.textPrimary,
    textAlign: 'right',
    marginBottom: 10,
  },
  chipsRow: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  selectedChip: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  chipText: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.textPrimary,
  },
  selectedChipText: {
    color: colors.white,
  },
  footerBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  searchBtn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  searchBtnText: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.white,
  },
});
