"use strict";

const Balance = use("App/Models/Balance");
const { validate } = use("Validator");
const Database = use("Database");

class BalanceController {
  async index({ request, response, auth }) {
    const authID = auth.user.id;

    const { user_id, year } = request.only(["user_id", "year"]);

    if (Number(authID) !== Number(user_id)) {
      return response.status(404).send({
        error: "Você só pode visualizar as receitas da sua conta!",
      });
    }

    let balance;

    if (year) {
      balance = await Balance.query().where({ user_id, year }).fetch();
    }

    if (!year) {
      balance = await Balance.query().where({ user_id }).fetch();
    }

    const balanceArray = balance.toJSON();

    if (balanceArray.length > 0) {
      let formattedArray = [
        {
          january: [],
          february: [],
          march: [],
          april: [],
          may: [],
          june: [],
          july: [],
          august: [],
          september: [],
          october: [],
          november: [],
          december: [],
        },
      ];

      balanceArray.map((balance) => {
        const month = Number(balance.month);

        if (month === 10) {
          return formattedArray[0].october.push(balance);
        }
      });

      return formattedArray;
    }

    return balance;
  }

  async store({ request, response, auth, params }) {
    const authUser = auth.user;
    const addToUser = params.id;

    let balance = request.only([
      "amount",
      "description",
      "payment_type",
      "year",
      "month",
      "is_expense",
    ]);

    const rules = {
      amount: "required",
      payment_type: "required",
      year: "required",
      month: "required",
      description: "max:300",
    };

    const messages = {
      "amount.required": "O campo 'amount' é obrigatório",
      "payment_type.required": "O campo 'payment_type' é obrigatório",
      "year.required": "O campo 'year' é obrigatório",
      "month.required": "O campo 'month' é obrigatório",
      "description.max":
        "O número máximo de caractéres para a descrição é de 300",
    };

    const validation = await validate(request.all(), rules, messages);

    if (validation.fails()) {
      const message = await validation.messages();

      return response.status(400).send({ error: message[0].message });
    }

    if (Number(authUser.id) !== Number(addToUser)) {
      return response.status(404).send({
        error: "Você só pode criar uma nova receita a sua própria conta.",
      });
    }

    const newBalance = Balance.create({
      ...balance,
      user_id: Number(addToUser),
    });

    return newBalance;
  }
}

module.exports = BalanceController;
