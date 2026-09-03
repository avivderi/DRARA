import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name').notNullable();
    table.string('email').notNullable().unique();
    table.string('avatar_url').nullable();

    // OAuth provider info
    table.string('provider').notNullable(); // 'google' | 'github'
    table.string('provider_id').notNullable();

    table.timestamps(true, true); // created_at, updated_at (auto-managed)

    table.unique(['provider', 'provider_id']);
    table.index('email');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users');
}
