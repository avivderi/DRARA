import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  const hasNotificationsTable = await knex.schema.hasTable('notifications');
  if (!hasNotificationsTable) {
    await knex.schema.createTable('notifications', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table
        .uuid('user_id')
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');
      table.string('type', 50).notNullable(); // 'new_match' | 'new_message' | 'handshake_confirmed' | 'scan_completed'
      table.jsonb('payload').notNullable().defaultTo('{}');
      table.timestamp('read_at', { useTz: true }).nullable();

      table.timestamps(true, true);

      table.index('user_id');
      table.index('read_at');
      table.index('type');
      table.index('created_at');
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('notifications');
}
