import { StyleSheet } from 'react-native';

export const colors = {
  background: '#FAFBFA',
  surface: '#FFFFFF',
  surfaceAlt: '#F0F4F2',
  primary: '#00684A',
  primaryHover: '#00543C',
  accentPoint: '#00ED64', // Exclusive indicator & NFC success flash
  textPrimary: '#001E2B',
  textSecondary: '#5C6C75',
  border: '#C1C7C6',
  error: '#DB3030',
  white: '#FFFFFF',
  black: '#000000',
  cardShadow: 'rgba(0, 30, 43, 0.08)',
};

export const fonts = {
  display: 'GoogleSans-Bold',
  body: 'GoogleSans-Regular',
  medium: 'GoogleSans-Medium',
  semiBold: 'GoogleSans-SemiBold',
  bold: 'GoogleSans-Bold',
};

export const typography = StyleSheet.create({
  h1: {
    fontFamily: fonts.bold,
    fontSize: 28,
    lineHeight: 36,
    color: colors.textPrimary,
    textAlign: 'right',
  },
  h2: {
    fontFamily: fonts.semiBold,
    fontSize: 22,
    lineHeight: 30,
    color: colors.textPrimary,
    textAlign: 'right',
  },
  h3: {
    fontFamily: fonts.medium,
    fontSize: 18,
    lineHeight: 26,
    color: colors.textPrimary,
    textAlign: 'right',
  },
  body: {
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSecondary,
    textAlign: 'right',
  },
  bodyBold: {
    fontFamily: fonts.medium,
    fontSize: 15,
    lineHeight: 22,
    color: colors.textPrimary,
    textAlign: 'right',
  },
  caption: {
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textSecondary,
    textAlign: 'right',
  },
  button: {
    fontFamily: fonts.medium,
    fontSize: 16,
    lineHeight: 22,
    color: colors.white,
    textAlign: 'center',
  },
});
