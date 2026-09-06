import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
} from 'react-native';

import { WorkspaceSubNav, WorkspaceTabType } from '../../components/layout/footers/WorkspaceSubNav';
import { WorkspaceHeader } from '../../components/layout/headers/WorkspaceHeader';
import { apiClient } from '../../services/apiClient';
import { colors, fonts } from '../../theme/tokens';

export interface EquitySplit {
  mySharePercent: number;
  partnerSharePercent: number;
  vestingYears: number;
  cliffMonths: number;
}

interface EquityFrameworkScreenProps {
  workspaceId?: string;
  ideaTitle?: string;
  partnerName?: string;
  equitySplit?: EquitySplit;
  onBackPress: () => void;
  onNavigateSubTab?: (tab: WorkspaceTabType) => void;
}

const DEFAULT_EQUITY: EquitySplit = {
  mySharePercent: 50,
  partnerSharePercent: 50,
  vestingYears: 4,
  cliffMonths: 12,
};

export const EquityFrameworkScreen: React.FC<EquityFrameworkScreenProps> = ({
  workspaceId,
  ideaTitle = 'DRARA - Co-Founder Platform',
  partnerName = 'אלון מזרחי',
  equitySplit: initialEquity = DEFAULT_EQUITY,
  onBackPress,
  onNavigateSubTab,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<WorkspaceTabType>('decisions');
  const [equity, setEquity] = useState<EquitySplit>(initialEquity);

  useEffect(() => {
    if (workspaceId) {
      let isMounted = true;
      apiClient
        .get<Record<string, unknown>>(`/workspaces/${workspaceId}/equity`)
        .then((res) => {
          if (!isMounted) return;
          const data = (res?.['data'] ?? res) as Record<string, unknown>;
          if (data) {
            setEquity({
              mySharePercent: typeof data['my_share_percent'] === 'number' ? data['my_share_percent'] : 50,
              partnerSharePercent: typeof data['partner_share_percent'] === 'number' ? data['partner_share_percent'] : 50,
              vestingYears: typeof data['vesting_years'] === 'number' ? data['vesting_years'] : 4,
              cliffMonths: typeof data['cliff_months'] === 'number' ? data['cliff_months'] : 12,
            });
          }
        })
        .catch(() => {
          // Keep default fallback on network error
        });

      return () => {
        isMounted = false;
      };
    }
  }, [workspaceId]);

  const equitySplit = equity;

  const handleSubTabChange = (tab: WorkspaceTabType) => {
    setActiveSubTab(tab);
    if (onNavigateSubTab) onNavigateSubTab(tab);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <WorkspaceHeader
        projectName={ideaTitle}
        coFounders={[{ name: partnerName }, { name: 'אביב דרי' }]}
        onBackPress={onBackPress}
      />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>מודל חלוקת אקוויטי ולוח זמנים ל-Vesting</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>⚖️ חלוקת מניות מוצעת (Equity Split)</Text>
          
          <View style={styles.equityRow}>
            <View style={styles.equityBox}>
              <Text style={styles.equityPercent}>{equitySplit.mySharePercent}%</Text>
              <Text style={styles.equityLabel}>החלק שלך</Text>
            </View>

            <View style={styles.equityBox}>
              <Text style={styles.equityPercent}>{equitySplit.partnerSharePercent}%</Text>
              <Text style={styles.equityLabel}>החלק של {partnerName}</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>⏳ מנגנון Vesting & Cliff</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoValue}>{equitySplit.vestingYears} שנים</Text>
            <Text style={styles.infoLabel}>תקופת Vesting מלאה:</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoValue}>{equitySplit.cliffMonths} חודשים (1 שנה)</Text>
            <Text style={styles.infoLabel}>תקופת Cliff:</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.vestingDesc}>
            מנגנון ה-Cliff מבטיח כי 25% מהמניות יבשילו בתום השנה הראשונה, והיתרה תבשיל באופן חודשי שווה לאורך 3 השנים הבאות.
          </Text>
        </View>
      </ScrollView>

      <WorkspaceSubNav activeTab={activeSubTab} onTabPress={handleSubTabChange} />
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
    marginBottom: 16,
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.textPrimary,
    textAlign: 'right',
    marginBottom: 12,
  },
  equityRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-around',
    gap: 12,
  },
  equityBox: {
    flex: 1,
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  equityPercent: {
    fontFamily: fonts.bold,
    fontSize: 28,
    color: colors.primary,
    marginBottom: 4,
  },
  equityLabel: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.textSecondary,
  },
  infoValue: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
  vestingDesc: {
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textSecondary,
    textAlign: 'right',
  },
});
