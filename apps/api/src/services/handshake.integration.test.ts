import assert from 'node:assert/strict';
import { describe, it, before, after } from 'node:test';

import { db } from '../db/connection';
import { KnexHandshakeEventRepository } from '../repositories/handshake-event.repository';
import { KnexMatchRepository } from '../repositories/match.repository';
import { KnexUserRepository } from '../repositories/user.repository';

import { HandshakeService } from './handshake.service';

describe('Module 4 Integration Verification: Physical NFC Handshake Layer', () => {
  let userRepo: KnexUserRepository;
  let matchRepo: KnexMatchRepository;
  let handshakeEventRepo: KnexHandshakeEventRepository;
  let handshakeService: HandshakeService;

  let ownerId: string;
  let candidateId: string;
  let ideaId: string;
  let matchId: string;

  before(async () => {
    // 1. Verify PostgreSQL connection
    await db.raw('SELECT 1');

    userRepo = new KnexUserRepository(db);
    matchRepo = new KnexMatchRepository(db);
    handshakeEventRepo = new KnexHandshakeEventRepository(db);
    handshakeService = new HandshakeService(matchRepo, handshakeEventRepo, userRepo);

    // Clean up any stale records from previous test runs
    await db('users')
      .whereIn('email', ['founder.m4@drara.io', 'candidate.m4@drara.io'])
      .del();

    // 2. Create test users in Postgres
    const owner = await userRepo.create({
      name: 'Founder User M4',
      email: 'founder.m4@drara.io',
      provider: 'github',
      provider_id: 'gh_m4_owner',
    });
    ownerId = owner.id;

    const candidate = await userRepo.create({
      name: 'Candidate User M4',
      email: 'candidate.m4@drara.io',
      provider: 'github',
      provider_id: 'gh_m4_cand',
    });
    candidateId = candidate.id;

    // Register candidate device public key
    await userRepo.update(candidateId, {
      bio: 'Ready for physical handshake verification',
    });

    // Create an Idea
    const [idea] = await db('ideas')
      .insert({
        user_id: ownerId,
        title: 'NFC Secured Startup Idea',
        visibility: 'private_ai_recommend',
      })
      .returning('*');
    ideaId = idea.id;

    // Create a Match in status 'pending_handshake'
    const match = await matchRepo.create({
      idea_id: ideaId,
      user1_id: ownerId,
      user2_id: candidateId,
      status: 'pending_handshake',
      compatibility_score: 0.95,
      compatibility_report: 'Excellent match in technical and execution skills',
    });
    matchId = match.id;
  });

  after(async () => {
    // Clean up records from Postgres DB
    if (matchId) await db('handshake_events').where({ match_id: matchId }).del();
    if (matchId) await db('matches').where({ id: matchId }).del();
    if (ideaId) await db('ideas').where({ id: ideaId }).del();
    if (ownerId) await db('users').where({ id: ownerId }).del();
    if (candidateId) await db('users').where({ id: candidateId }).del();
    await db.destroy();
  });

  it('verifies end-to-end physical NFC handshake challenge, persistence in Postgres, and match status update to confirmed', async () => {
    // 1. Initiator (Owner) requests handshake challenge token
    const initiateResult = await handshakeService.initiateHandshake(matchId, ownerId);
    assert.ok(initiateResult.challengeToken, 'Challenge token must be generated');
    assert.ok(initiateResult.expiresAt > Date.now(), 'Token expiry must be in the future');

    // 2. Candidate signs challenge token payload and submits NFC verification
    const locationHash = 'loc_tlv_tech_hub_hash_99';
    const nfcTokenSignature = 'nfc_sig_valid_cryptographic_payload_1234567890';
    const permissionsGranted = ['repo_access', 'workspace_access', 'full_description'];

    const verifyResult = await handshakeService.verifyHandshake({
      matchId,
      signerUserId: candidateId,
      challengeToken: initiateResult.challengeToken,
      nfcTokenSignature,
      locationHash,
      permissionsGranted,
    });

    assert.equal(verifyResult.match.status, 'confirmed', 'Match status in Postgres must be updated to confirmed');
    assert.equal(verifyResult.handshakeEvent.match_id, matchId);
    assert.equal(verifyResult.handshakeEvent.initiator_id, ownerId);
    assert.equal(verifyResult.handshakeEvent.signer_id, candidateId);
    assert.equal(verifyResult.handshakeEvent.location_hash, locationHash);
    assert.deepEqual(verifyResult.handshakeEvent.permissions_granted, permissionsGranted);

    // 3. Verify record directly in PostgreSQL table
    const dbHandshakeEvent = await db('handshake_events').where({ match_id: matchId }).first();
    assert.ok(dbHandshakeEvent, 'Handshake event must be persisted in Postgres');
    assert.equal(dbHandshakeEvent.signer_id, candidateId);

    // 4. Check handshake status query API
    const status = await handshakeService.getHandshakeStatus(matchId, ownerId);
    assert.equal(status.isConfirmed, true);
    assert.equal(status.matchStatus, 'confirmed');
    assert.deepEqual(status.permissionsGranted, permissionsGranted);
  });
});
