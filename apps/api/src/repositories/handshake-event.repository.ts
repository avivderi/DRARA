import type { Knex } from 'knex';

import type {
  CreateHandshakeEventInput,
  HandshakeEvent,
  IHandshakeEventRepository,
} from './handshake-event.repository.interface';

export class KnexHandshakeEventRepository implements IHandshakeEventRepository {
  constructor(private readonly db: Knex) {}

  async create(input: CreateHandshakeEventInput): Promise<HandshakeEvent> {
    const [event] = await this.db<HandshakeEvent>('handshake_events')
      .insert({
        match_id: input.match_id,
        initiator_id: input.initiator_id,
        signer_id: input.signer_id,
        nfc_token_signature: input.nfc_token_signature,
        location_hash: input.location_hash,
        verified_at: input.verified_at ?? this.db.fn.now(),
        permissions_granted: input.permissions_granted,
      })
      .returning('*');

    if (!event) throw new Error('Failed to create handshake event');
    return event;
  }

  async findByMatchId(matchId: string): Promise<HandshakeEvent | null> {
    const event = await this.db<HandshakeEvent>('handshake_events')
      .where({ match_id: matchId })
      .orderBy('created_at', 'desc')
      .first();
    return event ?? null;
  }
}
