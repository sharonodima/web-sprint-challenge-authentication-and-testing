exports.seed = (knex) => {
    return knex("users").del()
}