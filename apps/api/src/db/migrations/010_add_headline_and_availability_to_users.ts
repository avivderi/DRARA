import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  const hasHeadline = await knex.schema.hasColumn('users', 'headline');
  if (!hasHeadline) {
    await knex.schema.alterTable('users', (table) => {
      table.string('headline', 255).nullable();
      table.integer('availability_hours_per_week').nullable();
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  const hasHeadline = await knex.schema.hasColumn('users', 'headline');
  if (hasHeadline) {
    await knex.schema.alterTable('users', (table) => {
      table.dropColumn('headline');
      table.dropColumn('availability_hours_per_week');
    });
  }
}
