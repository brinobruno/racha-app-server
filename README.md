# 🔖 About the project

This API project was developed for the purpose of providing the server-side needs for the Racha App - an application for casual groups of football players and small organizations to draft their team players.

<br />

## Summary
- [Technologies used](https://github.com/brinobruno/racha-app-server#%EF%B8%8F-technologies-used)

- [How to run the project](https://github.com/brinobruno/racha-app-server#-how-to-run-the-project)

- [Enviroment variables](https://github.com/brinobruno/racha-app-server#%EF%B8%8F-environment-variables)

- [Functional requirements and business rules](https://github.com/brinobruno/racha-app-server#-functional-requirements-and-business-rules)

- [Overall rating calculation](https://github.com/brinobruno/racha-app-server#-overall-rating-calculation)

## ⚙️ Technologies used

- [Typescript](https://www.typescriptlang.org)
- [Fastify](https://www.fastify.io)
- [Zod](https://zod.dev)
- [Jest](https://jestjs.io)
- [Knex](https://knexjs.org)
- [BCrypt](https://www.npmjs.com/package/bcryptjs)

<br />

## 👍🏻 How to run the project

```bash

    // Clone repository
    $ git clone https://github.com/brinobruno/racha-app-server

    // Access directory
    $ cd racha-app-server

    // Install dependencies
    $ yarn

    // Run project
    $ yarn start
```

<br />

## 🛠️ Environment variables
1 - Check out .env.example

2 - Create a .env file at the root of the project

3 - Copy and fill with the contents of example

<br />

## 💼 Functional Requirements and Business Rules
<details>
<summary>
  <strong>Users</strong>
</summary>

  <strong>Functional Requirements</strong>

  - [X] Must be possible to create a new user.
  - [X] Must be possible to list all existing users.
  - [X] Must be possible to list an existing user's account.
  - [X] Must be possible for a user to list all teams and players they made.
  - [X] Must be possible for an existing user to login to their account.
  - [X] Must be possible for an existing user to logout from their account.
  - [X] Must be possible for an existing user to updated their own account.
  - [X] Must be possible for an existing user to delete their own account.

  <strong>Business Rules</strong>
  - [X] Login, logout, update and delete operations for a user must only be allowed to be made by the user themself.
  - [X] Logout, update and delete operations must only be allowed if a user is logged in, containing the correct session ID.
  - [X] User must only visualize teams and players created by them.

</details>
<br />

<details>
<summary>
  <strong>Teams</strong>
</summary>

  <strong>Functional Requirements</strong>
  - [X] A user must be able to create a new team/new teams.
  - [X] A user must be able to list all of their existing teams.
  - [X] A user must be able to list one of their existing teams.
  - [X] Must be possible for a user to list all teams and players they made.
  - [X] A user must be able to update their own team.
  - [X] A user must be able to delete their own team.

  <strong>Business Rules</strong>
  - [X] All operations for a team must only be allowed to be made by the user who created the team.
  - [X] All operations for a team must only be allowed if a user is logged in, containing the correct session ID.

</details>
<br />

<details>
<summary>
  <strong>Players</strong>
</summary>

  <strong>Functional Requirements</strong>
  - [X] A team must be able to create a new player/new players.
  - [X] A team must be able to list all of their existing players.
  - [X] A team must be able to list one of their existing players.
  - [X] It must be possible for a team to list all players they made.
  - [X] A team must be able to update their own players.
  - [X] A team must be able to delete their own players.

  <strong>Business Rules</strong>
  - [X] All operations for a player must only be allowed to be made by the user who created the team.
  - [X] All operations for a player must only be allowed if a user is logged in, containing the correct session ID.

</details>
<br />

## ⭐ Overall rating calculation
Attack and defense-oriented position players overall will be calculated as:
All stats sum / 5

Midfield and fullbacks will be calculated as:
All stats sum / 5.5

The thinking process is that attackers' defending stat is not too important for their overall. And that goes vice-versa to defenders' shooting for example.

Meanwhile, it's arguable that midfield and fullback players' stats are all important, however, according to simulation and comparison with other FIFA cards, analyzing players from 60 to 90 OVR, it wouldn't reflect well to divide all stats by 6, players with overall of 85 would get almost 10 points off.

On the other hand, good results were obtained by diving it by 5.5, the discrepancy was very small considering that this will be a very basic formula.

For now, on the MVP version, Goalkeepers will have only the overall attribute set.

This measure will be the one used for now.

<br />

---

<h3 align="center">Developed by Bruno Corrêa </h3>