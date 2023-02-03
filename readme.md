## Working with backend: implementing server-side functionality
### URL:
https://fo-phonebook.fly.dev/

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

6. To avoid Cross-Origin Request blocking, in the backend root, do:
    >npm install cors

7. Then in the backend's index.js, do:
    >const cors = require('cors')
    >app.use(cors())

8. Deploying backend to internet (we'll be using fly.io)
    1. Create account on fly.io
    2. cd to backend folder, and do:
        >fly auth login
        >fly launch (complete the prompts that follow)
    3. Edit the fly.toml file that's created in the root of the backend like so:
        >[env]
            PORT = "8080"
    4. Edit the index.js backend part to specify the listen port:
        ``const PORT = process.env.PORT || 3001
            app.listen(PORT, ()=> {
            console.log(`Server running on port: ${PORT}`)
            })``
    5. Now we're ready to deploy:
        >fly deploy
        (from version 0, will ++ version each time you deploy)
    6. Be sure to always checkout the monitoring tab on the fly.io website!
    7. run the deployed backend like so:
        > fly open
9. To generate a production build of the frontend, cd to frontend root dir, and do:
    1. Modify the 'baseUrl' to point to a relative url, ex: '/api/persons' This is important!! Otherwise you'll still be fetching from localhost. Then do:
    >npm run build
    2. Copy the 'build' folder to the backend's root dir    
    3. In the backend's 'index.js', don't forget to do:
        >app.use(express.static('build'))
    4. deploy: 'fly deploy'

10. To be able to work both locally and on deployed, add a proxy in the frontends's package.json like so:
    >"proxy" :"http://localhost:3001"

    