import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('players', (table) => {
    table.text('picture_url')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('players', (table) => {
    table.dropColumn('picture_url')
  })
}
