import crypto from 'crypto';

import type {
  CreateHandshakeEventInput,
  HandshakeEvent,
  IHandshakeEventRepository,
} from './handshake-event.repository.interface';

export class FakeHandshakeEventRepository implements IHandshakeEventRepository {
  private handshakeEvents: HandshakeEvent[] = [];

  async create(input: CreateHandshakeEventInput): Promise<HandshakeEvent> {
    const event: HandshakeEvent = {
      id: crypto.randomUUID(),
      match_id: input.match_id,
      initiator_id: input.initiator_id,
      signer_id: input.signer_id,
      nfc_token_signature: input.nfc_token_signature,
      location_hash: input.location_hash,
      verified_at: input.verified_at || new Date(),
      permissions_granted: [...input.permissions_granted],
      created_at: new Date(),
      updated_at: new Date(),
    };
    this.handshakeEvents.push(event);
    return { ...event };
  }

  async findByMatchId(matchId: string): Promise<HandshakeEvent | null> {
    const event = this.handshakeEvents.find((e) => e.match_id === matchId);
    return event ? { ...event } : null;
  }
}
