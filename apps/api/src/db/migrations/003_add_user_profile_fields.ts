import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', (table) => {
    table.specificType('skills', 'text[]').notNullable().defaultTo('{}');
    table.string('experience_level').nullable(); // 'junior' | 'mid' | 'senior'
    table.string('commitment_level').nullable(); // 'full-time' | 'part-time' | 'weekends'
    table.text('bio').nullable();
    table.string('github_username').nullable();
    table.string('device_public_key').nullable(); // Reserved for Module 4 NFC handshake
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', (table) => {
    table.dropColumn('skills');
    table.dropColumn('experience_level');
    table.dropColumn('commitment_level');
    table.dropColumn('bio');
    table.dropColumn('github_username');
    table.dropColumn('device_public_key');
  });
}
