var async = require('async');
var lid;

 exports.list = function(req, res){
	console.log(req.body);
	lid=req.body.lval;//req.body.lid;
	function getAllKpis(callback){
    	async.parallel([
		get_maindetails,
		get_history
   		], function(err, done) {
        	if(err) console.log(err);
			/*return getserv(done,callback); */ 
			return callback(err,done);
  		});
	}


	function get_maindetails(callback){

	var Qry="SELECT txnid,txndate,(select enname from tbl_login WHERE tbl_login.enid=custid ) as cust, contactno, contactemail,IF(prod_brid = '119', brandname, (SELECT cvvalule FROM `tbl_codevalue` WHERE cvid = prod_brid)) as brandname, IF(prodid = '120', prodcatname, (SELECT cvvalule FROM `tbl_codevalue` WHERE cvid = prodid)) as prodcatname,batchdate,issuedetails,imgurl1,imgurl2,imgurl3,imgurl4,imgurl5,serialno,modelno,machinename,dategen  FROM `tbl_tickets` WHERE txnid =?";
      db.query(Qry,[lid],function(err, results){
            if (err){ 
              throw err;
            }
		else{
           var orders =JSON.parse(JSON.stringify(results));  // Scope is larger than function  
		}

		callback(err,orders);
    });
};


	function get_history(callback){

	var Qry="SELECT (SELECT cvvalule FROM tbl_codevalue WHERE tbl_codevalue.cvid=tbl_ticketsts.ticketsts) as ticketsts, (select tbl_users.username FROM tbl_users WHERE tbl_users.txnid= assignto ) as assignto, (SELECT tbl_login.enname FROM tbl_login WHERE tbl_login.enid = assignby ) as assignby, Notes, dategen FROM tbl_ticketsts WHERE ticketid =? order by txnid desc";
      db.query(Qry,[lid],function(err, results){
            if (err){ 
              throw err;
            }
		else{
           var orders =JSON.parse(JSON.stringify(results));  // Scope is larger than function  
		}

		callback(err,orders);
    });
};


	getAllKpis(function(err,result){
		if(err){
			throw err;
		}
		var f1=result[0][0];
		f1["history"]=result[1];
		console.log("history result result: ",f1);
   		res.render('history.ejs',{f:f1});    	
	});
};
