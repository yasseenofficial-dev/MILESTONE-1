// Bootstrap: make app/backend/node_modules available to all sub-module requires
// (venue-owner, Youssef ElDairy, AlaaMilstone2 all need uuid, bcryptjs, etc.)
process.env.NODE_PATH = require('path').join(__dirname, 'node_modules');
require('module').Module._initPaths();

require('./server.js');
