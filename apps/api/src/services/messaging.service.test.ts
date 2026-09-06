import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { FakeConversationRepository } from '../repositories/conversation.repository.fake';
import { FakeMatchRepository } from '../repositories/match.repository.fake';
import { FakeMessageRepository } from '../repositories/message.repository.fake';
import { FakeNotificationRepository } from '../repositories/notification.repository.fake';

import { MessagingService } from './messaging.service';

describe('MessagingService (Unit Tests)', () => {
  it('should auto-create a conversation when ensureConversationForMatch is called', async () => {
    const convRepo = new FakeConversationRepository();
    const msgRepo = new FakeMessageRepository();
    const matchRepo = new FakeMatchRepository();
    const notifRepo = new FakeNotificationRepository();
    const service = new MessagingService(convRepo, msgRepo, matchRepo, notifRepo);

    const conv = await service.ensureConversationForMatch('match-123');
    assert.ok(conv.id);
    assert.equal(conv.match_id, 'match-123');

    const found = await convRepo.findByMatchId('match-123');
    assert.equal(found?.id, conv.id);
  });

  it('should send a message and create a notification for the recipient', async () => {
    const convRepo = new FakeConversationRepository();
    const msgRepo = new FakeMessageRepository();
    const matchRepo = new FakeMatchRepository();
    const notifRepo = new FakeNotificationRepository();
    const service = new MessagingService(convRepo, msgRepo, matchRepo, notifRepo);

    const match = await matchRepo.create({ idea_id: 'idea-1', user1_id: 'user-A', user2_id: 'user-B', compatibility_score: 0.85 });
    const conv = await service.ensureConversationForMatch(match.id);

    const msg = await service.sendMessage(conv.id, 'user-A', 'Hello User B!');
    assert.equal(msg.sender_id, 'user-A');
    assert.equal(msg.content, 'Hello User B!');

    // Verify recipient (user-B) gets in-app notification
    assert.equal(notifRepo.notifications.length, 1);
    assert.equal(notifRepo.notifications[0]?.user_id, 'user-B');
    assert.equal(notifRepo.notifications[0]?.type, 'new_message');
  });

  it('should throw error when non-participant tries to send message', async () => {
    const convRepo = new FakeConversationRepository();
    const msgRepo = new FakeMessageRepository();
    const matchRepo = new FakeMatchRepository();
    const notifRepo = new FakeNotificationRepository();
    const service = new MessagingService(convRepo, msgRepo, matchRepo, notifRepo);

    const match = await matchRepo.create({ idea_id: 'idea-1', user1_id: 'user-A', user2_id: 'user-B', compatibility_score: 0.85 });
    const conv = await service.ensureConversationForMatch(match.id);

    await assert.rejects(
      () => service.sendMessage(conv.id, 'user-C', 'Intruder message'),
      /Unauthorized/
    );
  });
});
