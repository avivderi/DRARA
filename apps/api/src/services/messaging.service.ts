import {
  ConversationRecord,
  ConversationSummary,
  IConversationRepository,
} from '../repositories/conversation.repository.interface';
import { IMatchRepository } from '../repositories/match.repository.interface';
import { IMessageRepository, MessageRecord } from '../repositories/message.repository.interface';
import { INotificationRepository } from '../repositories/notification.repository.interface';

export class MessagingService {
  constructor(
    private conversationRepo: IConversationRepository,
    private messageRepo: IMessageRepository,
    private matchRepo: IMatchRepository,
    private notificationRepo?: INotificationRepository
  ) {}

  /**
   * Ensures a conversation exists for a match (side-effect when match enters intro/deep_dive)
   */
  async ensureConversationForMatch(matchId: string): Promise<ConversationRecord> {
    let conversation = await this.conversationRepo.findByMatchId(matchId);
    if (!conversation) {
      conversation = await this.conversationRepo.create(matchId);
    }
    return conversation;
  }

  /**
   * Get list of active conversations for a user
   */
  async getConversationsForUser(userId: string): Promise<ConversationSummary[]> {
    return this.conversationRepo.findUserConversations(userId);
  }

  /**
   * Get paginated messages for a conversation thread, verifying user is a participant
   */
  async getMessages(
    conversationId: string,
    userId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<{ conversation_id: string; match_id: string; messages: MessageRecord[] }> {
    const conversation = await this.conversationRepo.findById(conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    const match = await this.matchRepo.findById(conversation.match_id);
    if (!match || (match.user1_id !== userId && match.user2_id !== userId)) {
      throw new Error('Unauthorized to view this conversation');
    }

    // Mark messages as read for this user
    await this.messageRepo.markAsRead(conversationId, userId);

    const messages = await this.messageRepo.findPaginated(conversationId, limit, offset);

    return {
      conversation_id: conversationId,
      match_id: conversation.match_id,
      messages,
    };
  }

  /**
   * Send a message in a conversation thread
   */
  async sendMessage(conversationId: string, senderId: string, content: string): Promise<MessageRecord> {
    if (!content || !content.trim()) {
      throw new Error('Message content cannot be empty');
    }

    const conversation = await this.conversationRepo.findById(conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    const match = await this.matchRepo.findById(conversation.match_id);
    if (!match || (match.user1_id !== senderId && match.user2_id !== senderId)) {
      throw new Error('Unauthorized to send message in this conversation');
    }

    const message = await this.messageRepo.create(conversationId, senderId, content.trim());

    // Trigger in-app notification to the recipient
    const recipientId = match.user1_id === senderId ? match.user2_id : match.user1_id;
    if (this.notificationRepo) {
      await this.notificationRepo.create(recipientId, 'new_message', {
        conversation_id: conversationId,
        sender_id: senderId,
        match_id: match.id,
        content_preview: content.trim().substring(0, 80),
      });
    }

    return message;
  }

  /**
   * Send first Intro message for a match
   */
  async sendMatchIntro(
    matchId: string,
    senderId: string,
    introContent?: string
  ): Promise<{ conversation_id: string; message: MessageRecord }> {
    const match = await this.matchRepo.findById(matchId);
    if (!match || (match.user1_id !== senderId && match.user2_id !== senderId)) {
      throw new Error('Match not found or user unauthorized');
    }

    // Update match status to 'intro' if still 'suggested'
    if (match.status === 'suggested') {
      await this.matchRepo.updateStatus(matchId, 'intro');
    }

    // Ensure conversation exists
    const conversation = await this.ensureConversationForMatch(matchId);

    const text = introContent && introContent.trim()
      ? introContent.trim()
      : 'היי! ראיתי את ההתאמה בינינו ב-DRARA ואשמח להכיר ולבחון שיתוף פעולה במיזם.';

    // Send the first message
    const message = await this.sendMessage(conversation.id, senderId, text);

    return {
      conversation_id: conversation.id,
      message,
    };
  }
}
