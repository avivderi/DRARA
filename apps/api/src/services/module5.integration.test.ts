import assert from 'node:assert/strict';
import { describe, it, before, after } from 'node:test';

import { db } from '../db/connection';
import { FakeConnectedRepoRepository } from '../repositories/connected-repo.repository.fake';
import { ConversationRepository } from '../repositories/conversation.repository';
import { KnexIdeaRepository } from '../repositories/idea.repository';
import { KnexMatchRepository } from '../repositories/match.repository';
import { MessageRepository } from '../repositories/message.repository';
import { NotificationRepository } from '../repositories/notification.repository';
import { KnexUserRepository } from '../repositories/user.repository';

import { AIServiceClient } from './ai-service.client';
import { IdeasService } from './ideas.service';
import { MessagingService } from './messaging.service';
import { NotificationService } from './notification.service';

describe('Module 5 Integration Tests (Live PostgreSQL DB)', () => {
  let userRepo: KnexUserRepository;
  let ideaRepo: KnexIdeaRepository;
  let matchRepo: KnexMatchRepository;
  let convRepo: ConversationRepository;
  let msgRepo: MessageRepository;
  let notifRepo: NotificationRepository;

  let messagingService: MessagingService;
  let notificationService: NotificationService;
  let ideasService: IdeasService;

  let testUserAId: string;
  let testUserBId: string;
  let testUserCId: string;
  let publicIdeaId: string;
  let privateIdeaId: string;
  let testMatchId: string;

  before(async () => {
    userRepo = new KnexUserRepository(db);
    ideaRepo = new KnexIdeaRepository(db);
    matchRepo = new KnexMatchRepository(db);
    convRepo = new ConversationRepository(db);
    msgRepo = new MessageRepository(db);
    notifRepo = new NotificationRepository(db);

    messagingService = new MessagingService(convRepo, msgRepo, matchRepo, notifRepo);
    notificationService = new NotificationService(notifRepo);
    ideasService = new IdeasService(ideaRepo, new FakeConnectedRepoRepository(), new AIServiceClient());

    // Create 3 real test users in Postgres
    const userA = await userRepo.create({
      name: 'Mod5 User A',
      email: `mod5a-${Date.now()}@example.com`,
      avatar_url: 'https://example.com/avatarA.png',
      provider: 'github',
      provider_id: `gh-a-${Date.now()}`,
      githubUsername: 'Mod5UserA',
    });
    const userB = await userRepo.create({
      name: 'Mod5 User B',
      email: `mod5b-${Date.now()}@example.com`,
      avatar_url: 'https://example.com/avatarB.png',
      provider: 'github',
      provider_id: `gh-b-${Date.now()}`,
      githubUsername: 'Mod5UserB',
    });
    const userC = await userRepo.create({
      name: 'Mod5 User C',
      email: `mod5c-${Date.now()}@example.com`,
      avatar_url: 'https://example.com/avatarC.png',
      provider: 'github',
      provider_id: `gh-c-${Date.now()}`,
      githubUsername: 'Mod5UserC',
    });

    testUserAId = userA.id;
    testUserBId = userB.id;
    testUserCId = userC.id;

    // Create 1 public idea and 1 private idea
    const pubIdea = await ideaRepo.create({
      user_id: testUserAId,
      title: 'Public Innovation Platform',
      description: 'Open source co-founder matchmaker',
      manual_description: 'Detailed public manual description',
      visibility: 'public',
    });
    publicIdeaId = pubIdea.id;

    const privIdea = await ideaRepo.create({
      user_id: testUserAId,
      title: 'Top Secret Stealth Project',
      description: 'Private confidential idea',
      visibility: 'private_ai_recommend',
    });
    privateIdeaId = privIdea.id;

    // Create match between User A and User B
    const match = await matchRepo.create({
      idea_id: publicIdeaId,
      user1_id: testUserAId,
      user2_id: testUserBId,
      compatibility_score: 0.88,
    });
    testMatchId = match.id;
  });

  after(async () => {
    // Clean up test data
    if (testMatchId) await db('matches').where({ id: testMatchId }).del();
    if (publicIdeaId) await db('ideas').where({ id: publicIdeaId }).del();
    if (privateIdeaId) await db('ideas').where({ id: privateIdeaId }).del();
    if (testUserAId) await db('users').where({ id: testUserAId }).del();
    if (testUserBId) await db('users').where({ id: testUserBId }).del();
    if (testUserCId) await db('users').where({ id: testUserCId }).del();
  });

  it('DoD 1: Messaging E2E — Match intro creates conversation, sends message & reads via Postgres', async () => {
    // 1. Send match intro from User A to User B
    const introRes = await messagingService.sendMatchIntro(testMatchId, testUserAId, 'Hello User B, glad to connect!');
    assert.ok(introRes.conversation_id);
    assert.equal(introRes.message.content, 'Hello User B, glad to connect!');

    // 2. User B fetches messages in conversation
    const fetched = await messagingService.getMessages(introRes.conversation_id, testUserBId, 50, 0);
    assert.equal(fetched.messages.length, 1);
    assert.equal(fetched.messages[0]!.content, 'Hello User B, glad to connect!');

    // 3. User B sends reply
    const reply = await messagingService.sendMessage(introRes.conversation_id, testUserBId, 'Hey User A! Excited to work together.');
    assert.equal(reply.sender_id, testUserBId);

    // 4. Verify conversation summary for User A
    const userAConvs = await messagingService.getConversationsForUser(testUserAId);
    assert.ok(userAConvs.length >= 1);
    const convSummary = userAConvs.find((c) => c.id === introRes.conversation_id);
    assert.ok(convSummary);
    assert.equal(convSummary.last_message, 'Hey User A! Excited to work together.');
  });

  it('DoD 2: Access Control — Public ideas accessible, Private idea returns 403 Forbidden for non-owner', async () => {
    // Public idea accessible to anyone
    const pubRes = await ideasService.getPublicIdeaById(publicIdeaId, testUserCId);
    assert.equal(pubRes.id, publicIdeaId);
    assert.equal(pubRes.title, 'Public Innovation Platform');

    // Private idea accessible to owner (User A)
    const ownerRes = await ideasService.getPublicIdeaById(privateIdeaId, testUserAId);
    assert.equal(ownerRes.id, privateIdeaId);

    // Private idea blocked for non-owner (User C) -> Throws 403 Forbidden
    await assert.rejects(
      () => ideasService.getPublicIdeaById(privateIdeaId, testUserCId),
      /Access denied to private idea/
    );
  });

  it('DoD 3: Notifications E2E — Automatic notification generated for recipient on new message', async () => {
    // Check notifications for User A after User B sent reply in DoD 1
    const notifs = await notificationService.getUserNotifications(testUserAId);
    assert.ok(notifs.notifications.length >= 1);

    const msgNotif = notifs.notifications.find((n) => n.type === 'new_message');
    assert.ok(msgNotif);
    assert.equal(msgNotif.user_id, testUserAId);
    assert.ok(msgNotif.payload['content_preview']);
  });
});
