To start mysql, in the terminal, type in `mysql -u root`

# Create a new database user
In the MySQL CLI:
```
CREATE USER 'joanneks'@'localhost' IDENTIFIED BY 'Tech2022';
```

```
CREATE USER 'joanneks'@'%' IDENTIFIED WITH mysql_native_Tech2022 BY 'bar';
grant all privileges on *.* to 'joanneks'@'%';

```
**Note:** Replace *sakila* with the name of the database you want the user to have access to
 
 ```
FLUSH PRIVILEGES;
```

<!-- 1. CREATE DATABASE in mysql : create database organic -->
<!-- 2. Setup db-migrate - ADD DEPENDENCIES in terminal:
            yarn add db-migrate
            yarn add db-migrate-mysql
            yarn add mysql
            -->
            <!-- alternative migration framework : kmex, sequelise-->

<!-- 3. Configure db-migrate
        a) create bash script: 
            create db-migrate.sh file with content:
                node node_modules/db-migrate/bin/db-migrate "$@"

        b) get access for permission to run the script:
                in terminal:  chmod +x db-migrate.sh  -->

<!-- 4. Create a new product migration: (add table to newly create database )
        a) in terminal:   ./db-migrate.sh create products
            this generates a migrations folder

        b) Define the products table : Change the exports.up and exports.down functions:
 -->

 <!-- 5. Perform migrations: ./db-migrate.sh up 
            this creates the specified table and a migrations table in mySQL -->

<!-- 6. Install mysql extension by weijian chen. Install. 
        After installation, click on database icon and scroll down to click connect -->

<!-- 7. Install ORM - Bookshelf (alternatives: sequelise,typeORM) :
        in terminal: npm install knex, 
        npm config set legacy-peer-deps true --- (*note* this is only necessary if using npm to install), 
        npm install bookshelf-->

<!-- 8. Create bookshelf module as folder with index.js --- TO SETUP ORM DATABASE -->
<!-- 9. Create models modules as folder with index.js --- TO CREATE a JavaScript class that represents one table -->
                <!-- a bookshelf model represents one table
                name of the model (first arg)
                must be SINGULAR form of table name and FIRST LETTER is UPPERCASE -->
<!-- 10. Create route and export to index.js  &  create hbs to render the route -->

<!-- 11. Add dependency: form. In terminal: npm install forms.
            a) create forms folder with index.js 
            b) inside index.js: 
                // require in coalan-forms
                const forms = require('forms');
                // create some shortcuts
                const fields = form.fields;
                const validators = forms.validators;

                var bootstrapField = function (name, object) {
                    if (!Array.isArray(object.widget.classes)) { object.widget.classes = []; }

                    if (object.widget.classes.indexOf('form-control') === -1) {
                        object.widget.classes.push('form-control');
                    }

                    var validationclass = object.value && !object.error ? 'is-valid' : '';
                    validationclass = object.error ? 'is-invalid' : validationclass;
                    if (validationclass) {
                        object.widget.classes.push(validationclass);
                    }

                    var label = object.labelHTML(name);
                    var error = object.error ? '<div class="invalid-feedback">' + object.error + '</div>' : '';

                    var widget = object.widget.toHTML(name, object);
                    return '<div class="form-group">' + label + widget + error + '</div>';
                };
-->

<!-- addition FYI. package-lock.json is same as yarn.lock. This is meant to rmb the version of dependencies installed then -->



<!-- 
npm install session
npm install connect-flash
npm install express-session
npm install session-file-store

.gitignore sessions

const session = require('express-session');
const flash = require("connect-flash");
const FileStore = require('session-file-store')(session);
// set up flash
app.use(session({
    store: new FileStore(), // use new file to store session
    secret: 'keyboard-cat', // used to generate session id
    resave: false, // do we automatically recreate the session even if there is no change to it
    saveUninitialized: true // if a new broswer connects, do we create a new session
})) 
-->