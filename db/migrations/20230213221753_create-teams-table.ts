import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('teams', (table) => {
    table.uuid('id').primary()
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable()
    table.timestamp('deleted_at').defaultTo(knex.fn.now()).notNullable()
    table.text('title').unique().notNullable()
    table.text('owner').unique().notNullable()
    table.text('badge_url')
    table.boolean('active').defaultTo(true).notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('teams')
}
