import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // 1. workspaces table
  const hasWorkspacesTable = await knex.schema.hasTable('workspaces');
  if (!hasWorkspacesTable) {
    await knex.schema.createTable('workspaces', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table
        .uuid('match_id')
        .notNullable()
        .unique()
        .references('id')
        .inTable('matches')
        .onDelete('CASCADE');
      table.string('project_name', 255).notNullable().defaultTo('Co-Founding Workspace');
      table.timestamps(true, true);

      table.index('match_id');
    });
  }

  // 2. idea_board_entries table
  const hasIdeaBoardTable = await knex.schema.hasTable('idea_board_entries');
  if (!hasIdeaBoardTable) {
    await knex.schema.createTable('idea_board_entries', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table
        .uuid('workspace_id')
        .notNullable()
        .references('id')
        .inTable('workspaces')
        .onDelete('CASCADE');
      table.string('section', 50).notNullable(); // 'vision' | 'problem' | 'audience' | 'solution' | 'business_model'
      table.text('content').notNullable().defaultTo('');
      table
        .uuid('updated_by')
        .nullable()
        .references('id')
        .inTable('users')
        .onDelete('SET NULL');
      table.timestamps(true, true);

      table.unique(['workspace_id', 'section']);
      table.index('workspace_id');
    });
  }

  // 3. roadmap_milestones table
  const hasRoadmapTable = await knex.schema.hasTable('roadmap_milestones');
  if (!hasRoadmapTable) {
    await knex.schema.createTable('roadmap_milestones', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table
        .uuid('workspace_id')
        .notNullable()
        .references('id')
        .inTable('workspaces')
        .onDelete('CASCADE');
      table.string('title', 255).notNullable();
      table.text('description').nullable();
      table.timestamp('due_date', { useTz: true }).nullable();
      table.string('status', 50).notNullable().defaultTo('not_started'); // 'not_started' | 'in_progress' | 'done'
      table
        .uuid('assigned_to')
        .nullable()
        .references('id')
        .inTable('users')
        .onDelete('SET NULL');
      table
        .uuid('created_by')
        .nullable()
        .references('id')
        .inTable('users')
        .onDelete('SET NULL');
      table.timestamps(true, true);

      table.index('workspace_id');
      table.index('status');
    });
  }

  // 4. decisions table
  const hasDecisionsTable = await knex.schema.hasTable('decisions');
  if (!hasDecisionsTable) {
    await knex.schema.createTable('decisions', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table
        .uuid('workspace_id')
        .notNullable()
        .references('id')
        .inTable('workspaces')
        .onDelete('CASCADE');
      table.string('title', 255).notNullable();
      table.text('rationale').notNullable();
      table
        .uuid('decided_by')
        .nullable()
        .references('id')
        .inTable('users')
        .onDelete('SET NULL');
      table.timestamps(true, true);

      table.index('workspace_id');
    });
  }

  // 5. equity_discussion_topics table
  const hasEquityTable = await knex.schema.hasTable('equity_discussion_topics');
  if (!hasEquityTable) {
    await knex.schema.createTable('equity_discussion_topics', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table
        .uuid('workspace_id')
        .notNullable()
        .references('id')
        .inTable('workspaces')
        .onDelete('CASCADE');
      table.string('topic', 100).notNullable(); // 'equity_split' | 'vesting_schedule' | 'departure_terms' | 'ip_ownership'
      table.boolean('discussed').notNullable().defaultTo(false);
      table.timestamp('discussed_at', { useTz: true }).nullable();
      table.timestamps(true, true);

      table.unique(['workspace_id', 'topic']);
      table.index('workspace_id');
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('equity_discussion_topics');
  await knex.schema.dropTableIfExists('decisions');
  await knex.schema.dropTableIfExists('roadmap_milestones');
  await knex.schema.dropTableIfExists('idea_board_entries');
  await knex.schema.dropTableIfExists('workspaces');
}
