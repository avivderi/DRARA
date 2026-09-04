import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';

import { colors, fonts } from '../../../theme/tokens';

interface ChatInputFooterProps {
  onSend: (message: string) => void;
  placeholder?: string;
}

export const ChatInputFooter: React.FC<ChatInputFooterProps> = ({
  onSend,
  placeholder = 'קלד/י הודעה...',
}) => {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text.trim());
    setText('');
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        value={text}
        onChangeText={setText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        multiline
      />

      <TouchableOpacity
        style={[styles.sendButton, !text.trim() && styles.disabledSend]}
        onPress={handleSend}
        disabled={!text.trim()}
        activeOpacity={0.8}
      >
        <Text style={styles.sendIcon}>➔</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 60,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceAlt,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  textInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: colors.surfaceAlt,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.textPrimary,
    textAlign: 'right',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledSend: {
    backgroundColor: colors.border,
  },
  sendIcon: {
    fontSize: 18,
    color: colors.white,
  },
});
