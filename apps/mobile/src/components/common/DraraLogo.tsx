import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useFonts, Pacifico_400Regular } from '@expo-google-fonts/pacifico';
import { colors } from '../../theme/tokens';

interface DraraLogoProps {
  fontSize?: number;
  showDot?: boolean;
}

export const DraraLogo: React.FC<DraraLogoProps> = ({
  fontSize = 24,
  showDot = true,
}) => {
  const [fontsLoaded] = useFonts({
    Pacifico_400Regular,
  });

  const fontStyle = fontsLoaded ? styles.pacificoFont : styles.fallbackFont;
  const dotSize = Math.max(5, Math.round(fontSize * 0.22));

  return (
    <View style={styles.container}>
      <Text style={[styles.text, fontStyle, { fontSize }]}>
        drara
      </Text>
      {showDot && (
        <View
          style={[
            styles.accentDot,
            {
              width: dotSize,
              height: dotSize,
              borderRadius: dotSize / 2,
              marginBottom: fontSize * 0.15,
            },
          ]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  text: {
    color: colors.primary, // #00684A Forest Green
    textTransform: 'lowercase',
  },
  pacificoFont: {
    fontFamily: 'Pacifico_400Regular',
  },
  fallbackFont: {
    fontFamily: 'System',
    fontWeight: 'bold',
  },
  accentDot: {
    backgroundColor: colors.accentPoint, // #00ED64 Glowing Green
    marginLeft: 3,
  },
});
