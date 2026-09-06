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

export interface DeepDiveReportData {
  candidateName: string;
  ideaTitle: string;
  overallScore: number;
  technicalOverlap: string;
  businessComplement: string;
  riskFactors: string[];
  swotAnalysis: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  recommendedNextSteps: string[];
}

interface DeepDiveReportScreenProps {
  report?: DeepDiveReportData;
  onBackPress: () => void;
  onInitiateHandshake: () => void;
}

const DEFAULT_REPORT: DeepDiveReportData = {
  candidateName: 'אלון מזרחי',
  ideaTitle: 'DRARA Co-Founder Platform',
  overallScore: 88,
  technicalOverlap: 'חפיפת Stack מעולה ב-TypeScript ו-Python, עם יתרון משמעותי לאלון בתשתיות ענן (AWS/K8s) המכסה 100% מהחסר ברעיון.',
  businessComplement: 'אלון מחפש הובלת מוצר ושיווק, בעוד אתה מביא ניסיון ב-Product Strategy ו-B2B Sales. השלמה מלאה של 100%.',
  riskFactors: [
    'שני השותפים פועלים כרגע במשרה חלקית לצד עבודה נוספת — יש לתאם ציפיות לגבי שעות שבועיות.',
    'נדרש סנכרון לגבי חלוקת האקוויטי והאחריות המשפטית לפני חתימה.',
  ],
  swotAnalysis: {
    strengths: ['כיסוי טכנולוגי ועסקי מלא', 'ניסיון קודם מוכח בהקמת מערכות ב-Scale גבוה'],
    weaknesses: ['אין ניסיון עבודה משותף קודם בין המייסדים'],
    opportunities: ['כניסה מהירה לשוק עם MVP יציב תוך 6 שבועות'],
    threats: ['מגבלת זמן של משרה חלקית בשלב הראשוני'],
  },
  recommendedNextSteps: [
    'קיום מפגש פיזי ראשון וביצוע NFC Handshake לאימות זהות.',
    'תיאום ציפיות והגדרת Equity Framework במרחב העבודה (Workspace).',
  ],
};

export const DeepDiveReportScreen: React.FC<DeepDiveReportScreenProps> = ({
  report = DEFAULT_REPORT,
  onBackPress,
  onInitiateHandshake,
}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <SimpleTitleHeader title="דוח AI DeepDive מורחב" onBackPress={onBackPress} />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerCard}>
          <Text style={styles.scoreNumber}>{report.overallScore}%</Text>
          <Text style={styles.scoreTitle}>ציון התאמה משוכלל (AI Match Index)</Text>
          <Text style={styles.scoreSubtitle}>
            השוואה בין {report.candidateName} למיזם &quot;{report.ideaTitle}&quot;
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>💻 ניתוח חפיפה טכנולוגית (Technical Overlap)</Text>
          <Text style={styles.cardText}>{report.technicalOverlap}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>📈 ניתוח השלמה עסקית (Business Complement)</Text>
          <Text style={styles.cardText}>{report.businessComplement}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>📊 ניתוח SWOT של הצמד</Text>
          
          <View style={styles.swotBox}>
            <Text style={styles.swotLabel}>💪 חוזקות (Strengths):</Text>
            {report.swotAnalysis.strengths.map((item) => (
              <Text key={`str-${item}`} style={styles.swotItem}>• {item}</Text>
            ))}
          </View>

          <View style={styles.swotBox}>
            <Text style={styles.swotLabel}>⚠️ נקודות תורפה (Weaknesses):</Text>
            {report.swotAnalysis.weaknesses.map((item) => (
              <Text key={`weak-${item}`} style={styles.swotItem}>• {item}</Text>
            ))}
          </View>

          <View style={styles.swotBox}>
            <Text style={styles.swotLabel}>🚀 הזדמנויות (Opportunities):</Text>
            {report.swotAnalysis.opportunities.map((item) => (
              <Text key={`opp-${item}`} style={styles.swotItem}>• {item}</Text>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>🛡️ גורמי סיכון (Risk Factors)</Text>
          {report.riskFactors.map((risk) => (
            <Text key={`risk-${risk}`} style={styles.riskItem}>⚠️ {risk}</Text>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>🎯 צעדים מומלצים להמשך</Text>
          {report.recommendedNextSteps.map((step) => (
            <Text key={`step-${step}`} style={styles.stepItem}>✅ {step}</Text>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footerBar}>
        <TouchableOpacity style={styles.actionBtn} onPress={onInitiateHandshake} activeOpacity={0.8}>
          <Text style={styles.actionBtnText}>📲 עשה NFC Handshake עכשיו</Text>
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
  headerCard: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  scoreNumber: {
    fontFamily: fonts.bold,
    fontSize: 40,
    color: colors.accentPoint,
    marginBottom: 4,
  },
  scoreTitle: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.white,
    textAlign: 'center',
    marginBottom: 2,
  },
  scoreSubtitle: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.surfaceAlt,
    textAlign: 'center',
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
    marginBottom: 8,
  },
  cardText: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
    textAlign: 'right',
  },
  swotBox: {
    marginBottom: 10,
  },
  swotLabel: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.primary,
    textAlign: 'right',
    marginBottom: 4,
  },
  swotItem: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textPrimary,
    textAlign: 'right',
    marginRight: 8,
    marginBottom: 2,
  },
  riskItem: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.error,
    textAlign: 'right',
    marginBottom: 6,
  },
  stepItem: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.primary,
    textAlign: 'right',
    marginBottom: 6,
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
  actionBtn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  actionBtnText: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.white,
  },
});
