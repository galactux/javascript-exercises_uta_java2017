# README #

A JavaScript programming exercise: Real-time message board using PouchDB JSON document database.

### Technologies & components practiced ###

* Node.js
* React
* React Bootstrap
* PouchDB
* JS Fetch API (async, await), Socket.IO

### Setting up ###

* Open command-line terminal and run:
```
git clone https://github.com/galactux/javascript-exercises_uta_java2017.git
cd javascript-exercises_uta_java2017/message-board/
npm install
npm run start:prod
```
* Open another terminal in the same path and run: `npm start`
* PouchDB server management: http://localhost:5984/_utils/
  * There should be an empty DB "ilmoitustaulu"
* Go to: http://localhost:3000/
* Note that there is additional 2 seconds DB delay enabled in `src/App.js`:
```
const delay = 2000; // Extra db delay in milliseconds for testing purposes!
```
* Original instructions in Finnish: README-exercise.md.
