import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // 1. Enable pgvector extension
  await knex.raw('CREATE EXTENSION IF NOT EXISTS vector;');

  // 2. Add embedding columns to users table
  await knex.schema.alterTable('users', (table) => {
    table.specificType('offering_embedding', 'vector(1024)').nullable();
    table.specificType('seeking_embedding', 'vector(1024)').nullable();
  });

  // 3. Add seeking_embedding column to ideas table
  await knex.schema.alterTable('ideas', (table) => {
    table.specificType('seeking_embedding', 'vector(1024)').nullable();
  });

  // 4. Create HNSW indexes for cosine distance performance (<=> operator)
  await knex.raw(
    'CREATE INDEX IF NOT EXISTS users_offering_embedding_hnsw_idx ON users USING hnsw (offering_embedding vector_cosine_ops);',
  );
  await knex.raw(
    'CREATE INDEX IF NOT EXISTS users_seeking_embedding_hnsw_idx ON users USING hnsw (seeking_embedding vector_cosine_ops);',
  );
  await knex.raw(
    'CREATE INDEX IF NOT EXISTS ideas_seeking_embedding_hnsw_idx ON ideas USING hnsw (seeking_embedding vector_cosine_ops);',
  );
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw('DROP INDEX IF EXISTS ideas_seeking_embedding_hnsw_idx;');
  await knex.raw('DROP INDEX IF EXISTS users_seeking_embedding_hnsw_idx;');
  await knex.raw('DROP INDEX IF EXISTS users_offering_embedding_hnsw_idx;');

  await knex.schema.alterTable('ideas', (table) => {
    table.dropColumn('seeking_embedding');
  });

  await knex.schema.alterTable('users', (table) => {
    table.dropColumn('seeking_embedding');
    table.dropColumn('offering_embedding');
  });
}
