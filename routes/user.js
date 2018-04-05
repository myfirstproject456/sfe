/*exports.login = function(req, res){
req.session.coid="5";
req.session.ecryt_key="904697ab-8e60-11e7-bce2-000d3a1134dd";
res.render('dashboard.ejs');       
};*/
var request = require('request');

exports.login = function(req, res){
 var message = '';
 var sess = req.session; 
 
 if(req.method == "POST"){
   var post  = req.body;
   var tenantid=coid;
   var name= post.PRM02;
   var pass= post.PRM03;

   console.log("request ", name, pass, tenantid);
   var sql1="SELECT coid, enid, enname, loginid, roleid, mgrid, contact_mobileno, if(photo_url is null or photo_url='', CONCAT('"+url+"','Contents/u00.png'), CONCAT('"+url+"',photo_url)) photo, (SELECT custid  FROM `tbl_customers` b WHERE b.cp_email = a.loginid) as custid ,(SELECT txnid  FROM `tbl_users` d WHERE d.email = a.loginid) as userid FROM `tbl_login` a WHERE upper(loginid) = upper(?) and pwd = ? and coid = ?";

  // console.log(sql1);
   db.query(sql1,[name,pass,tenantid] ,function(err, results){   
    console.log("result", err, results);
    if(results && results.length>0){
      req.session.user = results[0];
      res.locals.user = results[0];

      get_info(function(err,result){
        if(err){
          console.log(err);
        }else{
          global.menudata=result;
          res.redirect('/dashboard');
          /*if (results[0].roleid == 40) {
              res.redirect('/dashboard');
          } else {
            res.redirect('/dashboard'); 
          }*/
        }
        });
    }else{
      message = 'Wrong Credentials.';
      console.log('Wrong Credentials.');
      // res.redirect('/');
      res.render('register',{message: message});
    }                 
  });
       // res.redirect('/dashboard'); 
     } else {
      message='method not post';
      console.log('method not post');
      res.redirect('/');
    }  



    function get_info(callback){
      var getmenuqry      = "select tbl_menu.menuid, menuname, object, pmenuid,fld_faicon from tbl_menu, tbl_accesscontrol where coid =? and roleid =? and tbl_menu.status=0 and find_in_set(tbl_menu.menuid,tbl_accesscontrol.menuid)>0 order by seq";
    var user =req.session.user;
   db.query(getmenuqry, [coid,user.roleid],function(err, results){
    if (err){
      console.log(err);
    }
    else{
    var menudata =JSON.parse(JSON.stringify(results));  // Scope is larger than function  
  }
  return callback(err,menudata);
});
 };
};

exports.logout = function(req, res){
  req.session.destroy();
  res.redirect('/');       
};

