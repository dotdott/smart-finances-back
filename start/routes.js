"use strict";

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route");

Route.get("/", () => {
  return { greeting: "Hello world in JSON" };
});

Route.group(() => {
  Route.get("/login", "UserController.login");
  Route.post("/register", "UserController.store");

  Route.get("/balance", "BalanceController.index").middleware("auth");
  Route.post("/balance/:id", "BalanceController.store").middleware("auth");
  Route.put("/balance/:id", "BalanceController.update").middleware("auth");
  Route.post("/balance/delete/:id", "BalanceController.delete").middleware(
    "auth"
  );
}).prefix("/auth");
