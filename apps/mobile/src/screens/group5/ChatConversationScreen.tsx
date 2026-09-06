import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
} from 'react-native';

import { ChatInputFooter } from '../../components/layout/footers/ChatInputFooter';
import { ChatHeader } from '../../components/layout/headers/ChatHeader';
import { apiGet, apiPost } from '../../services/apiClient';
import { colors, fonts } from '../../theme/tokens';

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isMe: boolean;
}

interface ChatConversationScreenProps {
  threadId?: string;
  partnerName?: string;
  partnerAvatar?: string;
  ideaTitle?: string;
  isVettingMode?: boolean;
  messages?: ChatMessage[];
  onBackPress: () => void;
  onSendMessage?: (text: string) => void;
  onInitiateHandshake?: () => void;
}

export const ChatConversationScreen: React.FC<ChatConversationScreenProps> = ({
  threadId = 'thread-1',
  partnerName = 'אלון מזרחי',
  ideaTitle = 'DRARA - Co-Founder Platform',
  isVettingMode = false,
  messages: propMessages,
  onBackPress,
  onSendMessage,
  onInitiateHandshake,
}) => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(propMessages || []);

  useEffect(() => {
    if (!propMessages && threadId) {
      apiGet<Record<string, unknown>>(`/conversations/${threadId}/messages`)
        .then((res) => {
          const messages = res['messages'];
          if (Array.isArray(messages)) {
            const mapped = messages.map((item: unknown) => {
              const m = item as Record<string, unknown>;
              return {
                id: String(m['id'] ?? ''),
                senderId: String(m['sender_id'] ?? ''),
                text: String(m['content'] ?? m['text'] ?? ''),
                timestamp: typeof m['created_at'] === 'string'
                  ? new Date(m['created_at']).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })
                  : 'עכשיו',
                isMe: Boolean(m['is_me'] ?? m['isMe']),
              };
            });
            setChatMessages(mapped);
          }
        })
        .catch(() => {
          // Keep default fallback
        });
    }
  }, [propMessages, threadId]);

  const handleSend = (text: string) => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'me',
      text,
      timestamp: 'עכשיו',
      isMe: true,
    };
    setChatMessages((prev) => [...prev, newMsg]);

    if (threadId) {
      apiPost(`/conversations/${threadId}/messages`, { content: text }).catch(() => {});
    }
    if (onSendMessage) {
      onSendMessage(text);
    }
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      <ChatHeader
        participantName={partnerName}
        isOnline={true}
        onBackPress={onBackPress}
        onInfoPress={onInitiateHandshake}
      />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {isVettingMode && (
          <View style={styles.vettingBanner}>
            <Text style={styles.vettingBannerTitle}>🔍 שיחת Deep Dive & Vetting</Text>
            <Text style={styles.vettingBannerText}>
              דיון מעמיק סביב המיזם &quot;{ideaTitle}&quot;. הוסף פרטים חסרים ובדוק התאמה הדדית לפני קביעת מפגש NFC Handshake.
            </Text>
          </View>
        )}

        {chatMessages.map((msg) => (
          <View
            key={msg.id}
            style={[styles.messageBubble, msg.isMe ? styles.myBubble : styles.partnerBubble]}
          >
            <Text style={[styles.messageText, msg.isMe ? styles.myText : styles.partnerText]}>
              {msg.text}
            </Text>
            <Text style={[styles.timestamp, msg.isMe ? styles.myTimestamp : styles.partnerTimestamp]}>
              {msg.timestamp}
            </Text>
          </View>
        ))}
      </ScrollView>

      <ChatInputFooter onSend={handleSend} placeholder="רשום הודעה..." />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
    gap: 10,
  },
  vettingBanner: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.primary,
    borderWidth: 1.5,
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
  },
  vettingBannerTitle: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.primary,
    textAlign: 'right',
    marginBottom: 4,
  },
  vettingBannerText: {
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 18,
    color: colors.textSecondary,
    textAlign: 'right',
  },
  messageBubble: {
    maxWidth: '80%',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  myBubble: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 4,
  },
  partnerBubble: {
    alignSelf: 'flex-end',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'right',
  },
  myText: {
    color: colors.white,
  },
  partnerText: {
    color: colors.textPrimary,
  },
  timestamp: {
    fontFamily: fonts.body,
    fontSize: 10,
    marginTop: 4,
    textAlign: 'left',
  },
  myTimestamp: {
    color: colors.surfaceAlt,
  },
  partnerTimestamp: {
    color: colors.textSecondary,
  },
});
