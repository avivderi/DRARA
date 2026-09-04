export interface HandshakeEvent {
  id: string;
  match_id: string;
  initiator_id: string;
  signer_id: string;
  nfc_token_signature: string;
  location_hash: string;
  verified_at: Date;
  permissions_granted: string[];
  created_at: Date;
  updated_at: Date;
}

export interface CreateHandshakeEventInput {
  match_id: string;
  initiator_id: string;
  signer_id: string;
  nfc_token_signature: string;
  location_hash: string;
  verified_at?: Date;
  permissions_granted: string[];
}

export interface IHandshakeEventRepository {
  create(input: CreateHandshakeEventInput): Promise<HandshakeEvent>;
  findByMatchId(matchId: string): Promise<HandshakeEvent | null>;
}
