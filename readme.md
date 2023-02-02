### Working with backend: implementing server-side functionality

#### Some tips for future me:
Important steps to go execute:
1. npm init (complete prompts)
2. In your 'package.json'>scripts; add:
    "start": "node index.js" so that you can just run your app like so: 'npm start'
3. Install express library to simplify your life:
    > npm install express

4. nodemon could be quite useful, to avoid restarting the server all the time:
    > npm install --save-dev nodemon

5. Create a command 'alias'. In your 'package.json'>scripts; add:
    "dev": "nodemon index.js",
     So that now you can run your app like so:
     > npm run dev

