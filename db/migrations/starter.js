exports.up = async (db) => {
  await db.schema.createTable('users', (table) => {
    table
      .uuid('id')
      .notNullable()
      .defaultTo(db.raw('uuid_generate_v4()'))
      .primary();
  });

  await db.schema.createTable('user_contacts', (table) => {
    // table.uuid('id').notNullable().defaultTo(db.raw('uuid_generate_v4()')).primary();
    // table.uuid('author_id').notNullable().references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE');
    // table.string('slug', 120).notNullable();
    // table.string('title', 120).notNullable();
    // table.string('text', 2000);
    // table.boolean('is_url').notNullable().defaultTo(false);
    // table.boolean('approved').notNullable().defaultTo(false);
    // table.timestamps(false, true);
  });
};
