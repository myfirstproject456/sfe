

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , compression = require('compression')
  , async = require('async')
  , session = require('express-session');
var multer = require('multer');  

var app = express();
var mysql      = require('mysql');
var bodyParser=require("body-parser");

//database connection - production
var connection = mysql.createConnection({
              host     : 'localhost',
              user     : 'root',
              password : 'shri',
              database : 'sfe1',	
	      debug    :  false,
	      multipleStatements: true
            });

//database connection - developement
/*var connection = mysql.createConnection({
              host     : '172.104.17.202',
              user     : 'pmp_admin',
              password : 'Mdex@2312',
              database : 'sfe1',	
	      debug    :  false,
	      multipleStatements: true
            });*/

connection.connect();
console.log("Connection state",connection.state);

//constants
const AES = require('mysql-aes');
global.AES = require('mysql-aes');
global.db = connection;
global.url= ""; 
global.coid = "14";
// all environments
app.use(compression());
app.set('port', process.env.PORT || 4007);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

 app.use(session(
    { secret: "apical", maxAge: Date.now() + (30 * 86400 * 1000)
    }));

//one session
/*app.use(function(req, res, next) {
//   console.log("route called",req.url);
  if (req.session && req.session.user) {
        req.user = req.session.user;
        delete req.user.pwd; // delete the password from the session
        req.session.user = req.user;  //refresh the session value
        res.locals.user = req.user;
              if(req.url == "/"){
                req.session.destroy();
                res.redirect('/');
              }else{
                next();
              }
      } else {
//        console.log("app js function not called",req.url);
        if(req.url !="/" && req.url !="/login"){
        res.redirect('/');
        }else{
          next();
        }
      }
});
*/


app.use(function(req, res, next) {
  if (req.session && req.session.user) {
        req.user = req.session.user;
        delete req.user.pwd; // delete the password from the session
        req.session.user = req.user;  //refresh the session value
        res.locals.user = req.user;
      next();
     } else {
    next();
  }
});

app.use(function(err, req, res, next) {  
        res.status(err.status || 500);  
        res.render('error', {  
            message: err.message,  
            error: err  
        });  
});

//common routes
var index = require('./routes/index');
var user = require('./routes/user');
var dashboard = require('./routes/dashboard');
var cust_equipments = require('./routes/cust_equipments');
var service_request = require('./routes/service_request');
var registercust = require('./routes/register');
var unreq_service = require('./routes/unreq_service');
var custservicelist = require('./routes/custservicelist');
var dropdown = require('./routes/lib/dropdown');
var custlist = require('./routes/custlist');
var userlist = require('./routes/usermngt');
var compequipmentlist = require('./routes/compequipments');
var notifications = require('./routes/notifications');
var historydata = require('./routes/historydata');
var registercustcomp = require('./routes/register_cust_comp');
var cust_equi_action = require('./routes/cust_equi_action');



//Middleware
app.get('/', routes.index);//call for main index page
//app.use('/v1', dropdown);//call for main index page
app.post('/login',user.login);
app.get('/logout',user.logout);
app.get('/userlogin', index.userlogin);//call for main index page
app.get('/dashboard',dashboard.list);
app.get('/help',index.help);
app.get('/notifications',notifications.notilist);
app.get('/notificationsc',notifications.noticlist);
app.use('/v1', dropdown);

app.get('/compequipmentlist',compequipmentlist.compequipmentlist);
app.get('/equipmentlist',cust_equipments.equipmentlist);
app.post('/custequipmentlist',cust_equipments.custequipmentlist);
app.post('/add_equipment',cust_equipments.contentupload);
app.post('/getequipmentdetails',cust_equipments.getdetails);
app.post('/history',historydata.list);

// app.get('/service_request',service_request.list);
app.post('/save_request',service_request.contentupload);
app.get('/register',index.register);
app.post('/registercust',registercust.register);
app.get('/unreq_service',unreq_service.register);
app.get('/custservicelist',custservicelist.showlist);
app.post('/getservicedetail',custservicelist.getSrvDetails);
app.post('/updateticket',custservicelist.updatetktsts);

app.get('/getcustlist',custlist.custlist);
app.post('/getcustdetail',custlist.getCustDetails);
app.post('/savecust',custlist.savecust);
app.post('/getCustDetailsFromenid',custlist.getCustDetailsFromenid);

app.get('/getuserlist',userlist.custlist);
app.post('/getuserdetails',userlist.userdetails);
app.post('/saveuser',userlist.saveuser);
app.post('/getfilterservices',custservicelist.getfilterlist);
app.get('/getpiechartdata',dashboard.getpiechartdata);
app.post('/registercustcomp',registercustcomp.register);

app.post('/save_cust_equip_request',cust_equi_action.contentupload);


//listen to port
var server = app.listen(4007);
server.on('connection', function(socket) {
//  console.log("A new connection was made by a client.");
  socket.setTimeout(30 * 86400 * 1000);
  // 30 second timeout. Change this as you see fit.
});

