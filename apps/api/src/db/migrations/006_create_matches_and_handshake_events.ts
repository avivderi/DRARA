import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // ── 1. Add device_public_key to users table ──────────────
  const hasDevicePublicKey = await knex.schema.hasColumn('users', 'device_public_key');
  if (!hasDevicePublicKey) {
    await knex.schema.alterTable('users', (table) => {
      table.text('device_public_key').nullable();
    });
  }

  // ── 2. Create matches table ─────────────────────────────
  const hasMatchesTable = await knex.schema.hasTable('matches');
  if (!hasMatchesTable) {
    await knex.schema.createTable('matches', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table
        .uuid('idea_id')
        .notNullable()
        .references('id')
        .inTable('ideas')
        .onDelete('CASCADE');
      table
        .uuid('user1_id')
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');
      table
        .uuid('user2_id')
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');
      table
        .string('status', 50)
        .notNullable()
        .defaultTo('suggested'); // 'suggested' | 'intro' | 'deep_dive' | 'pending_handshake' | 'confirmed' | 'rejected'
      table.float('compatibility_score').nullable();
      table.text('compatibility_report').nullable();

      table.timestamps(true, true);

      table.index('idea_id');
      table.index('user1_id');
      table.index('user2_id');
      table.index('status');
      table.unique(['idea_id', 'user1_id', 'user2_id']);
    });
  }

  // ── 3. Create handshake_events table ─────────────────────
  const hasHandshakeTable = await knex.schema.hasTable('handshake_events');
  if (!hasHandshakeTable) {
    await knex.schema.createTable('handshake_events', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table
        .uuid('match_id')
        .notNullable()
        .references('id')
        .inTable('matches')
        .onDelete('CASCADE');
      table
        .uuid('initiator_id')
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');
      table
        .uuid('signer_id')
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');
      table.text('nfc_token_signature').notNullable();
      table.string('location_hash', 255).notNullable();
      table.timestamp('verified_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
      table.specificType('permissions_granted', 'text[]').notNullable().defaultTo('{}');

      table.timestamps(true, true);

      table.index('match_id');
      table.index('initiator_id');
      table.index('signer_id');
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('handshake_events');
  await knex.schema.dropTableIfExists('matches');

  const hasDevicePublicKey = await knex.schema.hasColumn('users', 'device_public_key');
  if (hasDevicePublicKey) {
    await knex.schema.alterTable('users', (table) => {
      table.dropColumn('device_public_key');
    });
  }
}
