# Connecting the Node.js Back-End to XAMPP's MySQL

## 1. Start MySQL in XAMPP
Open the XAMPP Control Panel and click **Start** next to MySQL.
(You don't need Apache running - the Node server below serves the
front-end pages itself.)

## 2. Create the database
Open **phpMyAdmin** (http://localhost/phpmyadmin), click **Import**,
and import `db/schema.sql`. This creates the `catering_system`
database with all seven tables and the seed data.

Alternatively, from a terminal:
```
"C:\xampp\mysql\bin\mysql.exe" -u root < db\schema.sql       (Windows)
/Applications/XAMPP/xamppfiles/bin/mysql -u root < db/schema.sql   (Mac)
```

## 3. Check your MySQL credentials
XAMPP's default MySQL user is `root` with **no password**. If you
changed this in phpMyAdmin, open `backend/db.js` and update the
`password` field to match.

## 4. Install backend dependencies
```
cd backend
npm install
```
This installs `express`, `mysql2`, and `cors` from `package.json`.

## 5. Start the server
```
npm start
```
You should see:
```
Catering server running at http://localhost:3000
```

## 6. Open the site
Go to **http://localhost:3000** in your browser (not a file:// path -
the pages now need to be served by Node so fetch() calls work).

## 7. Point the front-end pages at the API
Right now `index.html`, `menu.html`, `order.html`, and `admin.html`
still load `js/data.js` (the mock version). To use the real database:

1. In each HTML file, change `<script src="js/data.js">` to
   `<script src="js/api.js">`.
2. Update each page's inline `<script>` block to use the async
   functions instead of the old synchronous arrays/localStorage
   calls - see the comment block at the bottom of `js/api.js` for
   the exact before/after for each page.

Do this one page at a time and test it in the browser before moving
to the next - it's much easier to debug one broken fetch() call than
four at once.

## Troubleshooting
- **"Failed to fetch" in the browser console** -> the Node server
  isn't running, or you opened the HTML file directly (file://)
  instead of via http://localhost:3000.
- **500 errors on API calls** -> check the terminal running `npm
  start` for the actual MySQL error (wrong password, database not
  created, table name typo, etc.).
- **"Unknown database 'catering_system'"** -> step 2 wasn't
  completed - import db/schema.sql via phpMyAdmin first.
