# Quiz Web App
### A simple quiz web app made initially for Realm Hunter's Discord Bot, but _webapp_ -isized.

This web app is currently only a very simple version with almost no styling apart from divs and buttons. Styling is currently on the works and a more revamped version will be available in the near future.

## Features
- Connect with your Metamask wallet to keep track of your stats and play the quiz.
- See how many quizzes you've played and your best score so far.
- Time-limited questions with varying amounts of answers.
- Dive deep into the mechanics of Realm Hunter itself and get yourself acquainted with it.
- Enjoy multiplier questions towards the end of the quiz to up your score.


## Architecture used

This web app is built with the following languages, frameworks and tools:

- [Next.js](https://nextjs.org) - React framework for production
- [Node.js](https://nodejs.org/en/) - JS runtime environment
- [Express.js](https://expressjs.com) - Minimalist web framework for Node.js, used for building API
- [Moralis](https://moralis.io) - A full API suite for Web2 and Web3 integration (also includes database)
- [Netlify](https://www.netlify.com) - Web hosting service to deploy the frontend
- [Heroku](https://www.heroku.com) - A cloud platform to host the backend API

## Access/installation
The website itself is currently available on Netlify: [Visit website](https://main--rh-simple-quiz-webapp.netlify.app/start)

If you prefer to run a local instance of the web app, please install the following dependencies before continuing:
- If possible, the latest version of [Node.js](https://nodejs.org/en/), or at least v12.22.0.

Clone the repository via your terminal.
`git clone https://github.com/suwandre/simple-quiz-web.git`

Open the folder and install the required dependencies.

```sh
cd simple-quiz-web
npm i
```

Before launching the localhost instance, it is **important** to note that this repo has a hidden .env file that contains 3 variables to access Moralis; since it is private, please request access by contacting me.

If you have these variables already, you are able to launch the localhost instance using:
```
npm run dev
```

If you encounter any issues or errors that are otherwise specified here, please do not hesitate to contact me!