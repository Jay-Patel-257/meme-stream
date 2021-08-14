## Tech Stack
<hr>

Here <strong>Node.js</strong> and <strong>express</strong> is used for backed and mongoDB is used for database. <strong>ejs</strong> is used as template engine. <strong>mongoose </strong> is used as ODM here.

## index.js
<hr>

This file is the invoking file of the web app, it contains the methods for all the requests and it communicates with other files by calling them using <code>require();</code> function. It contains all the middlewares. It renders the frontend content ap per the api called. and contains exact API implementation for assessment.

## AppError.js
<hr>

This file contains the AppError class for error handeling which will be called into index.js class.

## post.js
<hr>

It contains The schema defined for the model we are using for data storage.

## Frontend
<hr>

All the files inside views folder and public folder. views folder contains the html part which is embedded with "ejs" template engine. "index.ejs" file is the home page, "posts.ejs" file will be rendered as the latest 100 posts. "show.ejs" will rendere a particular post using it's id. "edit.ejs" contains editing form for editing a particular post. "styles.css" file contains all the css code for all the four templates.

## package.json
<hr>

It contains all the scripts which will be executed as npm commands. It also contains all the dependencies which needs to be installed.

## assessment code
<hr>

"install.sh", "server_run.sh", "sleep.sh" contains the scripts required for assessment.