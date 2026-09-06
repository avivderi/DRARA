// TODO: needs backend — Module 5 (Messaging/Public)
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';

import { SimpleTitleHeader } from '../../components/layout/headers/SimpleTitleHeader';
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
  onSelectNotification: (notif: AppNotification) => void;
}

const SAMPLE_NOTIFS: AppNotification[] = [
  {
    id: 'n1',
    title: '⭐ מאצ\' חדש באיכות 88%!',
    body: 'אלון מזרחי (Senior DevOps & Cloud) נמצא מתאים לרעיון שלך.',
    timestamp: 'לפני 10 דקות',
    type: 'match',
    isRead: false,
  },
  {
    id: 'n2',
    title: '🤝 אימות NFC Handshake הושלם',
    body: 'השותפות עם אלון מזרחי אושרה בהצלחה ב-NFC Tap פיזי.',
    timestamp: 'אתמול',
    type: 'handshake',
    isRead: true,
  },
];

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({
  notifications = SAMPLE_NOTIFS,
  onBackPress,
  onSelectNotification,
}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <SimpleTitleHeader title="התראות מערכת" onBackPress={onBackPress} />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.list}>
          {notifications.map((n) => (
            <TouchableOpacity
              key={n.id}
              style={[styles.card, !n.isRead && styles.unreadCard]}
              onPress={() => onSelectNotification(n)}
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
