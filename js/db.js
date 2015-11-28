var db = require('diskdb');

empdb = db.connect('db', ['employee']);
categdb = db.connect('db', ['category']);
statusdb = db.connect('db', ['status']);
scheduledb = db.connect('db', ['schedule']);
