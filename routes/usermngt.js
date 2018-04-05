var async = require('async');

exports.custlist = function(req, res){
    var sql1 = "SELECT txnid,username,email,mobileno,(SELECT username FROM tbl_users b WHERE b.txnid = a.reportingto) as manager FROM `tbl_users` a";
    console.log(sql1);
        db.query(sql1,[] ,function(err, results){   
            console.log("result", err, results);
               if(results && results.length>0){
                    res.render("usermngt",{custlist:JSON.parse(JSON.stringify(results))});
                }else{
                     res.render("usermngt",{custlist:[]});
                }
    });
}


exports.userdetails = function(req, res){
    var custid = req.body.custid;
    var sql1 = "SELECT txnid,username,email,mobileno,role,reportingto FROM `tbl_users` WHERE txnid = ?";
    console.log(req.body,custid,sql1);
    db.query(sql1,[custid] ,function(err, results){   
        console.log("result", err, results);
        if(results && results.length>0){
            res.send(JSON.parse(JSON.stringify(results)));
        }else{
            res.send([]);
        }
    });
}

exports.saveuser = function(req, res){
    var custid = req.body.id;
    var formdata = JSON.parse(req.body.formdata)[0];
    console.log("user saving : ",req.body, formdata, formdata.username);

    if(custid){
        
        var sql1 = "UPDATE `tbl_users` SET `username` = ?,`email`= ?, `mobileno`= ?, `role`= ?, `reportingto`= ? WHERE `tbl_users`.`txnid` = ?;UPDATE tbl_login SET enname = ?,loginid = ?, contact_email = ?, contact_mobileno = ?, roleid = ?, mgrid =? WHERE tbl_login.enid = ?";
        db.query(sql1,[formdata.username,formdata.email,formdata.mobileno,formdata.role,formdata.reportingto,custid,formdata.username,formdata.email,formdata.email,formdata.mobileno,formdata.role,formdata.reportingto,custid] ,function(err, results){     
            console.log("result", err, results);
            if(results ){
                var resp = {
                    status:"0",
                    status_msg:"Success",
                    insertId:results.insertId
                };
                res.send(resp);
            }else{
                var resp = {
                    status:"1",
                    status_msg:"Failed"
                };
                res.send(resp);
            }
        });
    }else{
        var sql1 = "INSERT INTO `tbl_users` (`coid`, `username`, `email`, `mobileno`, `role`, `reportingto`) VALUES (?,?,?,?,?,?)";
        db.query(sql1,[coid,formdata.username,formdata.email,formdata.mobileno,formdata.role,formdata.reportingto] ,function(err, results){   
            console.log("result", err, results);
            if(results ){
               var resp = {
                    status:"0",
                    status_msg:"Success",
                    insertId:results.insertId
                };
                res.send(resp);
            }else{
               var resp = {
                    status:"1",
                    status_msg:"Failed"
                };
                res.send(resp);
            }
        });
    }
}
