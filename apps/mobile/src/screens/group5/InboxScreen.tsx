import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
} from 'react-native';

import { UserAvatar } from '../../components/common/UserAvatar';
import { BottomTabBar, TabType } from '../../components/layout/footers/BottomTabBar';
import { SimpleTitleHeader } from '../../components/layout/headers/SimpleTitleHeader';
import { apiGet } from '../../services/apiClient';
import { colors, fonts } from '../../theme/tokens';

export interface ChatThread {
  id: string;
  partnerName: string;
  partnerAvatar?: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isConfirmedMatch: boolean;
}

interface InboxScreenProps {
  threads?: ChatThread[];
  activeTab?: TabType;
  onTabPress?: (tab: TabType) => void;
  onSelectThread: (threadId: string) => void;
}

export const InboxScreen: React.FC<InboxScreenProps> = ({
  threads: propThreads,
  activeTab = 'inbox',
  onTabPress,
  onSelectThread,
}) => {
  const [threadList, setThreadList] = useState<ChatThread[]>(propThreads || []);

  useEffect(() => {
    if (!propThreads) {
      apiGet<Record<string, unknown>>('/conversations')
        .then((res) => {
          const conversations = res['conversations'];
          if (Array.isArray(conversations)) {
            const mapped = conversations.map((item: unknown) => {
              const c = item as Record<string, unknown>;
              return {
                id: String(c['id'] ?? c['threadId'] ?? ''),
                partnerName: String(c['partner_name'] ?? c['partnerName'] ?? 'שותף'),
                partnerAvatar: c['partner_avatar'] ? String(c['partner_avatar']) : undefined,
                lastMessage: String(c['last_message'] ?? c['lastMessage'] ?? 'אין הודעות קודמות'),
                timestamp: typeof c['updated_at'] === 'string'
                  ? new Date(c['updated_at']).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })
                  : 'חדש',
                unreadCount: typeof c['unread_count'] === 'number' ? c['unread_count'] : 0,
                isConfirmedMatch: Boolean(c['nfc_confirmed'] ?? c['isConfirmedMatch']),
              };
            });
            setThreadList(mapped);
          }
        })
        .catch(() => {
          // Keep default fallback
        });
    }
  }, [propThreads]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <SimpleTitleHeader title="תיבת הודעות (Inbox)" />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.threadsList}>
          {threadList.map((thread) => (
            <TouchableOpacity

              key={thread.id}
              style={[styles.threadCard, thread.unreadCount > 0 && styles.unreadCard]}
              onPress={() => onSelectThread(thread.id)}
              activeOpacity={0.8}
            >
              <UserAvatar name={thread.partnerName} avatarUrl={thread.partnerAvatar} size={52} />

              <View style={styles.threadContent}>
                <View style={styles.threadHeader}>
                  <View style={styles.nameBadgeRow}>
                    <Text style={styles.partnerName}>{thread.partnerName}</Text>
                    {thread.isConfirmedMatch && (
                      <Text style={styles.confirmedBadge}>🤝 NFC Confirmed</Text>
                    )}
                  </View>
                  <Text style={styles.timestamp}>{thread.timestamp}</Text>
                </View>

                <Text
                  style={[styles.lastMessage, thread.unreadCount > 0 && styles.unreadMessageText]}
                  numberOfLines={2}
                >
                  {thread.lastMessage}
                </Text>
              </View>

              {thread.unreadCount > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadCountText}>{thread.unreadCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {onTabPress && <BottomTabBar activeTab={activeTab} onTabPress={onTabPress} unreadCount={2} />}
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
  threadsList: {
    gap: 12,
  },
  threadCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  unreadCard: {
    borderColor: colors.primary,
    backgroundColor: colors.surfaceAlt,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginLeft: 12,
  },
  threadContent: {
    flex: 1,
  },
  threadHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  nameBadgeRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
  },
  partnerName: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.textPrimary,
  },
  confirmedBadge: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: colors.primary,
    backgroundColor: colors.surface,
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  timestamp: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.textSecondary,
  },
  lastMessage: {
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textSecondary,
    textAlign: 'right',
  },
  unreadMessageText: {
    fontFamily: fonts.bold,
    color: colors.textPrimary,
  },
  unreadBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  unreadCountText: {
    fontFamily: fonts.bold,
    fontSize: 11,
    color: colors.white,
  },
});
