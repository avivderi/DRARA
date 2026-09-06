import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

import { SimpleTitleHeader } from '../../components/layout/headers/SimpleTitleHeader';
import { apiGet, apiPatch } from '../../services/apiClient';
import { colors, fonts } from '../../theme/tokens';

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  type: 'match' | 'handshake' | 'system';
  isRead: boolean;
}

interface NotificationsScreenProps {
  notifications?: AppNotification[];
  onBackPress: () => void;
  onSelectNotification?: (notif: AppNotification) => void;
}

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({
  notifications: propNotifications,
  onBackPress,
  onSelectNotification,
}) => {
  const [notifList, setNotifList] = useState<AppNotification[]>(propNotifications || []);
  const [loading, setLoading] = useState(!propNotifications);

  useEffect(() => {
    if (!propNotifications) {
      setLoading(true);
      apiGet<{ notifications: any[] }>('/notifications')
        .then((res) => {
          if (Array.isArray(res.notifications)) {
            const mapped = res.notifications.map((n: any) => ({
              id: n.id,
              title: n.title || 'התראת מערכת',
              body: n.body || n.content || '',
              timestamp: n.created_at ? new Date(n.created_at).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }) : 'חדש',
              type: n.type || 'system',
              isRead: Boolean(n.read_at || n.is_read || n.isRead),
            }));
            setNotifList(mapped);
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, []);

  const handleSelect = (n: AppNotification) => {
    if (!n.isRead) {
      apiPatch(`/notifications/${n.id}/read`).catch(() => {});
      setNotifList((prev) => prev.map((item) => (item.id === n.id ? { ...item, isRead: true } : item)));
    }
    if (onSelectNotification) {
      onSelectNotification(n);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <SimpleTitleHeader title="התראות מערכת" onBackPress={onBackPress} />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.list}>
          {notifList.map((n) => (
            <TouchableOpacity
              key={n.id}
              style={[styles.card, !n.isRead && styles.unreadCard]}
              onPress={() => handleSelect(n)}
              activeOpacity={0.8}
            >

              <View style={styles.cardHeader}>
                <Text style={styles.title}>{n.title}</Text>
                <Text style={styles.timestamp}>{n.timestamp}</Text>
              </View>

              <Text style={styles.body}>{n.body}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
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
    paddingBottom: 30,
  },
  list: {
    gap: 12,
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 16,
  },
  unreadCard: {
    borderColor: colors.primary,
    backgroundColor: colors.surfaceAlt,
  },
  cardHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.textPrimary,
    textAlign: 'right',
  },
  timestamp: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.textSecondary,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textSecondary,
    textAlign: 'right',
  },
});
