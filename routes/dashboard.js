var utils = require('./utils.js');
var async = require('async');
var scrno;
var flag =0;

exports.list = function(req, res){
var userinfo = req.session.user;   
    var roleid = userinfo["roleid"];
    var enid = userinfo["enid"];
    var custid = userinfo.custid;
    var userid = userinfo.userid; 
	// console.log(userinfo, roleid, enid);
    var sql1 = "";
    var params = [];
    if(roleid == "40"){
        sql1="SELECT count(*) as serv_count,(SELECT  COUNT(*) FROM `tbl_cust_prodmap` WHERE custid = ?) as equi_count FROM `vw_ticket_status` WHERE custid = ?";
        params.push(custid);
        params.push(enid);
        flag =0;
    }else{
        if(roleid == "38"||roleid == "39"){
            sql1="SELECT (select count(ticketid) from vw_ticket_status WHERE ticketsts = 3 ) as open_count,count(ticketid) as serv_count,(SELECT COUNT(*) FROM `tbl_customers`) as cust_count, (SELECT COUNT(*) FROM `tbl_products`) as product_count FROM `vw_ticket_status`;SELECT ticketid as txnid, issuedetails FROM `vw_ticket_status` WHERE Date(date_gen) = Date(now()) AND ticketsts = 3 ORDER BY date_gen DESC; SELECT ticketid as txnid, issuedetails FROM `vw_ticket_status` WHERE Date(date_gen) != Date(now()) AND ticketsts =3 ORDER BY date_gen";
        }else{
            sql1="SELECT (select count(ticketid) from vw_ticket_status WHERE ticketsts = 3 and assignto = ?) as open_count,count(ticketid) as serv_count,(SELECT COUNT(*) FROM `tbl_customers`) as cust_count, (SELECT COUNT(*) FROM `tbl_products`) as product_count FROM `vw_ticket_status` WHERE assignto = ?; SELECT ticketid as txnid, issuedetails FROM `vw_ticket_status` WHERE Date(date_gen) = Date(now()) AND ticketsts = 3 ORDER BY date_gen DESC; SELECT ticketid as txnid, issuedetails FROM `vw_ticket_status` WHERE Date(date_gen) != Date(now()) AND ticketsts =3 ORDER BY date_gen";
            params.push(userid,userid);
        }
        flag =1;
    }
//    console.log(sql1,params);
        db.query(sql1, params ,function(err, results){   
           // console.log("result", err, results);
            if(flag == 0){
			     res.render('dashboard.ejs',{kpis:JSON.parse(JSON.stringify(results))});
			}else{
			     res.render('dashboard_comp.ejs',{kpis:JSON.parse(JSON.stringify(results[0])),newsrvreq:JSON.parse(JSON.stringify(results[1])),pensrvreq:JSON.parse(JSON.stringify(results[2]))});
            }
        });
};


exports.getpiechartdata = function(req, res) {
    var userinfo = req.session.user;
    var roleid = userinfo["roleid"];
    var enid = userinfo["enid"];
    var custid = userinfo.custid;
    var userid = userinfo.userid;
  //  console.log(userinfo, roleid, enid);
    var sql1 = "";
    var params = [];
    if (roleid == "38" || roleid == "39") {
        sql1 = "SELECT (cvvalule) as label, (cvid) as id, (SELECT COUNT(*) as value FROM `tbl_ticketsts` WHERE sts = 0 AND ticketsts = cvid) as value ,(SELECT 'color' from DUAL) as color FROM `tbl_codevalue` WHERE cvmasterid =2";
    } else {
        sql1 = "SELECT (cvvalule) as label, (cvid) as id, (SELECT COUNT(*) as value FROM `tbl_ticketsts` WHERE sts = 0 AND ticketsts = cvid AND assignto = 23) as value , (SELECT 'color' from DUAL) as color FROM `tbl_codevalue` WHERE cvmasterid =2";
        params.push(userid, userid);
    }
   // console.log(sql1, params);
    db.query(sql1, params, function(err, results) {
      //  console.log("result", err, results);
        res.send(results);
    });
}

