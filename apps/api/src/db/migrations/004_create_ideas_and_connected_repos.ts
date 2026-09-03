import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // ── 1. Ideas Table ───────────────────────────────────────
  await knex.schema.createTable('ideas', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table
      .uuid('user_id')
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table.string('title', 200).notNullable();
    table.text('description').nullable();
    table.text('manual_description').nullable();
    table
      .string('visibility', 50)
      .notNullable()
      .defaultTo('private_ai_recommend'); // 'public' | 'private_ai_recommend' | 'invite_only'

    // AI scan results
    table.text('ai_summary').nullable();
    table.specificType('stack_detected', 'text[]').notNullable().defaultTo('{}');
    table.integer('readiness_score').nullable(); // 1-10
    table.text('readiness_rationale').nullable();
    table.timestamp('last_scanned_at', { useTz: true }).nullable();

    table.timestamps(true, true);

    table.index('user_id');
    table.index('visibility');
  });

  // ── 2. Connected Repos Table ─────────────────────────────
  await knex.schema.createTable('connected_repos', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table
      .uuid('user_id')
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table
      .uuid('idea_id')
      .nullable()
      .references('id')
      .inTable('ideas')
      .onDelete('SET NULL');
    table.string('github_repo_full_name', 255).notNullable(); // e.g. "avivderi/DRARA"
    table.string('installation_id', 100).notNullable();
    table.timestamp('last_scanned_at', { useTz: true }).nullable();

    table.timestamps(true, true);

    table.unique(['user_id', 'github_repo_full_name']);
    table.index('user_id');
    table.index('idea_id');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('connected_repos');
  await knex.schema.dropTableIfExists('ideas');
}
