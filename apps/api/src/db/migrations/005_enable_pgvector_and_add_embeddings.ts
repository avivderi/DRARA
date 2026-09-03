import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // 1. Enable pgvector extension
  await knex.raw('CREATE EXTENSION IF NOT EXISTS vector;');

  // 2. Add offering_tags, seeking_tags, offering_embedding, seeking_embedding to users table
  await knex.schema.alterTable('users', (table) => {
    table.specificType('offering_tags', 'text[]').nullable();
    table.specificType('seeking_tags', 'text[]').nullable();
    table.specificType('offering_embedding', 'vector(1024)');
    table.specificType('seeking_embedding', 'vector(1024)');
  });

  // 3. Add seeking_tags & seeking_embedding to ideas table
  await knex.schema.alterTable('ideas', (table) => {
    table.specificType('seeking_tags', 'text[]').nullable();
    table.specificType('seeking_embedding', 'vector(1024)');
  });

  // 4. Create HNSW vector index for cosine distance (<=> operator)
  await knex.raw('CREATE INDEX IF NOT EXISTS users_offering_embedding_hnsw_idx ON users USING hnsw (offering_embedding vector_cosine_ops);');
  await knex.raw('CREATE INDEX IF NOT EXISTS users_seeking_embedding_hnsw_idx ON users USING hnsw (seeking_embedding vector_cosine_ops);');
  await knex.raw('CREATE INDEX IF NOT EXISTS ideas_seeking_embedding_hnsw_idx ON ideas USING hnsw (seeking_embedding vector_cosine_ops);');
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw('DROP INDEX IF EXISTS ideas_seeking_embedding_hnsw_idx;');
  await knex.raw('DROP INDEX IF EXISTS users_seeking_embedding_hnsw_idx;');
  await knex.raw('DROP INDEX IF EXISTS users_offering_embedding_hnsw_idx;');

  const hasSeekingTagsIdeas = await knex.schema.hasColumn('ideas', 'seeking_tags');

  await knex.schema.alterTable('ideas', (table) => {
    table.dropColumn('seeking_embedding');
    if (hasSeekingTagsIdeas) table.dropColumn('seeking_tags');
  });

  const hasOfferingTags = await knex.schema.hasColumn('users', 'offering_tags');
  const hasSeekingTags = await knex.schema.hasColumn('users', 'seeking_tags');

  await knex.schema.alterTable('users', (table) => {
    table.dropColumn('seeking_embedding');
    table.dropColumn('offering_embedding');
    if (hasSeekingTags) table.dropColumn('seeking_tags');
    if (hasOfferingTags) table.dropColumn('offering_tags');
  });
}
