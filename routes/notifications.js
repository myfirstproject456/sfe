var async = require('async');

exports.notilist = function(req, res){
    // res.render('equipmentlist.ejs');  
    // console.log(userinfo, roleid, custid);
var userid=req.session.user.enid;

    var sql1 = "SELECT notify_id, senderid, receiverid, fcmid, title, notify_type, notify_url, click_action, msg, data, date_gen FROM `tbl_notifications` WHERE FIND_IN_SET(?,receiverid);SELECT count(*) as count FROM `tbl_notifications`  WHERE FIND_IN_SET(?,receiverid) ";
  //  console.log(sql1);
        db.query(sql1,[userid,userid] ,function(err, results){   
            console.log("result noti", err, results);
    //            if(results && results[0].length>0){
                    res.render("notifications",{notilist:JSON.parse(JSON.stringify(results[0])),noticount:JSON.parse(JSON.stringify(results[1]))});
      //          }else{
        //             res.render("notifications",{notilist:[],noticount:{count:0}});
          //      }
    });
}


exports.noticlist = function(req, res)
{

var userid=req.session.user.enid;
    var sql1 = "SELECT notify_id, senderid, receiverid, fcmid, title, notify_type, notify_url, click_action, msg, data, date_gen FROM `tbl_notifications`  WHERE FIND_IN_SET(?,receiverid) limit 5 ;SELECT count(*) as count FROM `tbl_notifications`   WHERE FIND_IN_SET(?,receiverid)   ";
//    console.log(sql1);
        db.query(sql1,[userid,userid] ,function(err, results){   
            console.log("result noti count", err, results);
            //    if(results && results[0].length>0){
                    res.send({notilist:JSON.parse(JSON.stringify(results[0])),noticount:JSON.parse(JSON.stringify(results[1])),});
              //  }else{
                //     res.send({notilist:[],noticount:{count:0}});
              //  }
    });
}
