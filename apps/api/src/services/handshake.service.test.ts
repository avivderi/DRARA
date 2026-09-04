import assert from 'node:assert/strict';
import { describe, it, beforeEach } from 'node:test';

import { FakeHandshakeEventRepository } from '../repositories/handshake-event.repository.fake';
import { FakeMatchRepository } from '../repositories/match.repository.fake';
import { FakeUserRepository } from '../repositories/user.repository.fake';

import { HandshakeService } from './handshake.service';

describe('HandshakeService Unit Tests', () => {
  let matchRepo: FakeMatchRepository;
  let handshakeEventRepo: FakeHandshakeEventRepository;
  let userRepo: FakeUserRepository;
  let handshakeService: HandshakeService;

  beforeEach(() => {
    matchRepo = new FakeMatchRepository();
    handshakeEventRepo = new FakeHandshakeEventRepository();
    userRepo = new FakeUserRepository();
    handshakeService = new HandshakeService(matchRepo, handshakeEventRepo, userRepo);
  });

  it('initiates handshake and sets match status to pending_handshake', async () => {
    const user1 = await userRepo.create({
      name: 'User One',
      email: 'user1@drara.io',
      provider: 'github',
      provider_id: 'p_u1',
    });
    const user2 = await userRepo.create({
      name: 'User Two',
      email: 'user2@drara.io',
      provider: 'github',
      provider_id: 'p_u2',
    });

    const match = await matchRepo.create({
      idea_id: 'idea-123',
      user1_id: user1.id,
      user2_id: user2.id,
      status: 'intro',
    });

    const result = await handshakeService.initiateHandshake(match.id, user1.id);
    assert.ok(result.challengeToken);
    assert.ok(result.expiresAt > Date.now());

    const updatedMatch = await matchRepo.findById(match.id);
    assert.ok(updatedMatch);
    assert.equal(updatedMatch.status, 'pending_handshake');
  });

  it('verifies valid NFC handshake, transitions status to confirmed, and records handshake event', async () => {
    const user1 = await userRepo.create({
      name: 'User One',
      email: 'user1@drara.io',
      provider: 'github',
      provider_id: 'p_u1',
    });
    const user2 = await userRepo.create({
      name: 'User Two',
      email: 'user2@drara.io',
      provider: 'github',
      provider_id: 'p_u2',
    });

    const match = await matchRepo.create({
      idea_id: 'idea-123',
      user1_id: user1.id,
      user2_id: user2.id,
      status: 'pending_handshake',
    });

    const initResult = await handshakeService.initiateHandshake(match.id, user1.id);

    const verifyResult = await handshakeService.verifyHandshake({
      matchId: match.id,
      signerUserId: user2.id,
      challengeToken: initResult.challengeToken,
      nfcTokenSignature: 'valid_nfc_signature_token_123456789',
      locationHash: 'loc_tel_aviv_center_hash',
      permissionsGranted: ['repo_access', 'workspace_access'],
    });

    assert.equal(verifyResult.match.status, 'confirmed');
    assert.equal(verifyResult.handshakeEvent.initiator_id, user1.id);
    assert.equal(verifyResult.handshakeEvent.signer_id, user2.id);
    assert.deepEqual(verifyResult.handshakeEvent.permissions_granted, ['repo_access', 'workspace_access']);

    const statusResult = await handshakeService.getHandshakeStatus(match.id, user1.id);
    assert.equal(statusResult.isConfirmed, true);
    assert.equal(statusResult.matchStatus, 'confirmed');
    assert.deepEqual(statusResult.permissionsGranted, ['repo_access', 'workspace_access']);
  });

  it('fails verification if challenge token is expired', async () => {
    const user1 = await userRepo.create({
      name: 'User One',
      email: 'user1@drara.io',
      provider: 'github',
      provider_id: 'p_u1',
    });
    const user2 = await userRepo.create({
      name: 'User Two',
      email: 'user2@drara.io',
      provider: 'github',
      provider_id: 'p_u2',
    });

    const match = await matchRepo.create({
      idea_id: 'idea-123',
      user1_id: user1.id,
      user2_id: user2.id,
      status: 'pending_handshake',
    });

    const expiredToken = handshakeService.generateChallengeToken({
      matchId: match.id,
      initiatorUserId: user1.id,
      nonce: 'nonce_123',
      expiresAt: Date.now() - 1000, // Expired 1 second ago
    });

    await assert.rejects(
      async () => {
        await handshakeService.verifyHandshake({
          matchId: match.id,
          signerUserId: user2.id,
          challengeToken: expiredToken,
          nfcTokenSignature: 'valid_sig_123456789',
          locationHash: 'loc_hash',
        });
      },
      (err: Error) => {
        return err.message.includes('expired');
      },
    );
  });

  it('fails verification if initiator attempts to sign their own challenge', async () => {
    const user1 = await userRepo.create({
      name: 'User One',
      email: 'user1@drara.io',
      provider: 'github',
      provider_id: 'p_u1',
    });
    const user2 = await userRepo.create({
      name: 'User Two',
      email: 'user2@drara.io',
      provider: 'github',
      provider_id: 'p_u2',
    });

    const match = await matchRepo.create({
      idea_id: 'idea-123',
      user1_id: user1.id,
      user2_id: user2.id,
      status: 'pending_handshake',
    });

    const initResult = await handshakeService.initiateHandshake(match.id, user1.id);

    await assert.rejects(
      async () => {
        await handshakeService.verifyHandshake({
          matchId: match.id,
          signerUserId: user1.id, // Initiator tries to sign
          challengeToken: initResult.challengeToken,
          nfcTokenSignature: 'valid_sig_123456789',
          locationHash: 'loc_hash',
        });
      },
      (err: Error) => {
        return err.message.includes('Initiator cannot be the signer');
      },
    );
  });
});
