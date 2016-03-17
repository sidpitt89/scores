# scores

## setup
- npm install 
 (just to be safe, although node_modules is up here so it might not be necessary)

- db_config.js contains mysql user, password, and database settings. 

note: if there are pre-existing tables named Users or Scores in the specified database, there will be issues.
running the server for the first time will create these tables for you, but if they already exist, it is
assumed that they have the correct structure.

## running & interacting
- Start server with:  node main.js

- Interact with server from a separate terminal window

- Retrieve top ten scores:  curl -i -X GET http://localhost:3001/scores/topten
- Add user:  curl -i -X POST http://localhost:3001/scores/USERNAME/EMAIL/SCORE
- Update user scoring information:  curl -i -X PUT http://localhost:3001/scores/USERNAME/EMAIL/SCORE

note: USERNAME, EMAIL, and SCORE in the above examples are to be replaced with other values

note: when adding users, usernames are unique, but email addresses may be re-used.

note: when updating user scoring information, old scores associated with the user are kept.

note: users only appear once in the top ten scores, even if their lower scores are above other users' scores.
