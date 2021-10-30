"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class BalanceSchema extends Schema {
  up() {
    this.create("balances", (table) => {
      table.increments();
      table
        .integer("user_id")
        .unsigned()
        .references("id")
        .inTable("users")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table.integer("amount").notNullable();
      table.string("description", 300);
      table.string("payment_type").notNullable();
      table.integer("year").notNullable();
      table.integer("month").notNullable();
      table.boolean("is_expense").defaultTo(true);
      table.timestamps();
    });
  }

  down() {
    this.drop("balances");
  }
}

module.exports = BalanceSchema;
