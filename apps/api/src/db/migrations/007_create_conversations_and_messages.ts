import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // ── 1. Create conversations table ─────────────────────────
  const hasConversationsTable = await knex.schema.hasTable('conversations');
  if (!hasConversationsTable) {
    await knex.schema.createTable('conversations', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table
        .uuid('match_id')
        .notNullable()
        .references('id')
        .inTable('matches')
        .onDelete('CASCADE');

      table.timestamps(true, true);

      table.unique(['match_id']);
      table.index('match_id');
    });
  }

  // ── 2. Create messages table ──────────────────────────────
  const hasMessagesTable = await knex.schema.hasTable('messages');
  if (!hasMessagesTable) {
    await knex.schema.createTable('messages', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table
        .uuid('conversation_id')
        .notNullable()
        .references('id')
        .inTable('conversations')
        .onDelete('CASCADE');
      table
        .uuid('sender_id')
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');
      table.text('content').notNullable();
      table.timestamp('read_at', { useTz: true }).nullable();

      table.timestamps(true, true);

      table.index('conversation_id');
      table.index('sender_id');
      table.index('created_at');
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('messages');
  await knex.schema.dropTableIfExists('conversations');
}
