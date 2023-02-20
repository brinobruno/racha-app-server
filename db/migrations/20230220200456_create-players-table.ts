import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('players', (table) => {
    table.uuid('id').primary()
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable()
    table.timestamp('deleted_at').defaultTo(knex.fn.now()).notNullable()
    table.text('name').notNullable()
    table.text('known_as')
    table.text('position').notNullable()
    table.integer('nationality').notNullable()
    table.integer('overall').notNullable()
    table.integer('pace')
    table.integer('shooting')
    table.integer('passing')
    table.integer('dribbling')
    table.integer('defending')
    table.integer('physical')
    table.boolean('active').defaultTo(true).notNullable()
    table.uuid('team_id')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('players')
}
