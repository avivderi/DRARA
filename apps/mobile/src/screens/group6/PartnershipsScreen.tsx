import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';

import { BottomTabBar, TabType } from '../../components/layout/footers/BottomTabBar';
import { BrandHeader } from '../../components/layout/headers/BrandHeader';
import { apiClient } from '../../services/apiClient';
import { colors, fonts } from '../../theme/tokens';

export interface PartnershipItem {
  id: string;
  ideaTitle: string;
  tagline: string;
  partnerName: string;
  partnerAvatar: string;
  myAvatar: string;
  handshakeDate: string;
  isConfirmed: boolean;
}

interface PartnershipsScreenProps {
  partnerships?: PartnershipItem[];
  onSelectPartnership: (partnershipId: string) => void;
  onNavigateTab: (tab: TabType) => void;
  onNotificationsPress?: () => void;
  onProfilePress?: () => void;
}

const SAMPLE_PARTNERSHIPS: PartnershipItem[] = [
  {
    id: 'p1',
    ideaTitle: 'DRARA - Co-Founder Matchmaker',
    tagline: 'פלטפורמת מאצ\'ינג חכמה ליזמים מבוססת AI וקוד ב-GitHub',
    partnerName: 'אלון מזרחי',
    partnerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    myAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    handshakeDate: '04 ספטמבר 2026',
    isConfirmed: true,
  },
  {
    id: 'p2',
    ideaTitle: 'CyberShield AI',
    tagline: 'מערכת אוטונומית לזיהוי איומים בסביבות Multi-Cloud',
    partnerName: 'שירה כהן',
    partnerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
    myAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    handshakeDate: '28 אוגוסט 2026',
    isConfirmed: true,
  },
];

export const PartnershipsScreen: React.FC<PartnershipsScreenProps> = ({
  partnerships: initialPartnerships,
  onSelectPartnership,
  onNavigateTab,
  onNotificationsPress,
  onProfilePress,
}) => {
  const [partnershipsData, setPartnershipsData] = useState<PartnershipItem[]>(
    initialPartnerships ?? SAMPLE_PARTNERSHIPS,
  );

  useEffect(() => {
    if (!initialPartnerships) {
      let isMounted = true;
      apiClient
        .get<Record<string, unknown>>('/workspaces')
        .then((res) => {
          if (!isMounted) return;
          const raw = res?.['data'] ?? res;
          if (Array.isArray(raw) && raw.length > 0) {
            setPartnershipsData(
              raw.map((item: unknown) => {
                const w = item as Record<string, unknown>;
                return {
                  id: String(w['id'] ?? 'p'),
                  ideaTitle: String(w['idea_title'] ?? w['title'] ?? 'Co-Founder Partnership'),
                  tagline: String(w['tagline'] ?? w['description'] ?? 'מיזם משותף פעיל'),
                  partnerName: String(w['partner_name'] ?? 'אלון מזרחי'),
                  partnerAvatar: String(w['partner_avatar'] ?? SAMPLE_PARTNERSHIPS[0].partnerAvatar),
                  myAvatar: String(w['my_avatar'] ?? SAMPLE_PARTNERSHIPS[0].myAvatar),
                  handshakeDate: typeof w['created_at'] === 'string'
                    ? new Date(w['created_at']).toLocaleDateString('he-IL')
                    : '2026',
                  isConfirmed: true,
                };
              }),
            );
          }
        })
        .catch(() => {
          // Keep sample partnerships fallback on network error
        });

      return () => {
        isMounted = false;
      };
    }
  }, [initialPartnerships]);

  const partnerships = partnershipsData;
  return (
    <SafeAreaView style={styles.safeArea}>
      <BrandHeader
        onNotificationPress={onNotificationsPress}
        onProfilePress={onProfilePress}
        unreadNotificationsCount={1}
      />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>
          מיזמים פעילים שאומתו פיזית ב-NFC Handshake ופתחו מרחב עבודה משותף (Workspace)
        </Text>

        {partnerships.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>🤝</Text>
            <Text style={styles.emptyTitle}>אין עדיין שותפויות מאומתות</Text>
            <Text style={styles.emptyDesc}>
              בצע מפגש פרונטלי ואימות NFC Handshake עם מועמד מתאים כדי לפתוח מרחב עבודה משותף.
            </Text>
          </View>
        ) : (
          <View style={styles.list}>
            {partnerships.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.card}
                onPress={() => onSelectPartnership(item.id)}
                activeOpacity={0.85}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.handshakeBadge}>
                    <Text style={styles.handshakeBadgeText}>🤝 NFC Verified</Text>
                  </View>
                  <Text style={styles.dateText}>{item.handshakeDate}</Text>
                </View>

                <Text style={styles.title}>{item.ideaTitle}</Text>
                <Text style={styles.tagline}>{item.tagline}</Text>

                <View style={styles.footerRow}>
                  {/* Co-founders avatar stack */}
                  <View style={styles.avatarStack}>
                    <Image source={{ uri: item.myAvatar }} style={[styles.avatar, styles.myAvatarOverlay]} />
                    <Image source={{ uri: item.partnerAvatar }} style={styles.avatar} />
                    <Text style={styles.partnerNameText}>עם {item.partnerName}</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.workspaceBtn}
                    onPress={() => onSelectPartnership(item.id)}
                  >
                    <Text style={styles.workspaceBtnText}>כניסה ל-Workspace ➔</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      <BottomTabBar activeTab="partnerships" onTabPress={onNavigateTab} />
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
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'right',
    marginBottom: 18,
  },
  list: {
    gap: 16,
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1.5,
    borderRadius: 18,
    padding: 18,
  },
  cardHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  handshakeBadge: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  handshakeBadgeText: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.primary,
  },
  dateText: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.textSecondary,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.textPrimary,
    textAlign: 'right',
    marginBottom: 4,
  },
  tagline: {
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textSecondary,
    textAlign: 'right',
    marginBottom: 16,
  },
  footerRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
  },
  avatarStack: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 2,
    borderColor: colors.surface,
  },
  myAvatarOverlay: {
    marginRight: -10,
    zIndex: 1,
  },
  partnerNameText: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.textPrimary,
    marginRight: 6,
  },
  workspaceBtn: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  workspaceBtnText: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.white,
  },
  emptyCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1.5,
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    marginTop: 20,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 6,
  },
  emptyDesc: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});
