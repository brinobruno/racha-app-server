import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('teams', (table) => {
    table.uuid('user_id')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('teams', (table) => {
    table.dropColumn('user_id')
  })
}
