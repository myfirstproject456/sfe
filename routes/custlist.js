var async = require('async');

exports.custlist = function(req, res){
    // res.render('equipmentlist.ejs');  
    // console.log(userinfo, roleid, custid);
    var sql1 = "SELECT custid,sapid,sapdesc,custname,custaddress,cp_name,cp_number,cp_email,(SELECT COUNT(*) FROM tbl_cust_prodmap WHERE tbl_cust_prodmap.custid = tbl_customers.custid) as equipments FROM `tbl_customers`";
    console.log(sql1);
        db.query(sql1,[] ,function(err, results){   
            console.log("result", err, results);
                if(results && results.length>0){
                    res.render("custlist",{custlist:JSON.parse(JSON.stringify(results))});
                }else{
                     res.render("custlist",{custlist:[]});
                }
    });
}

exports.getCustDetails = function(req, res){
    var sess = req.session; 
        var post  = req.body;
        var id = post.lid;
        var sql = "SELECT * from tbl_customers WHERE custid = ?";            
        console.log(sql,id);
            db.query(sql,[id] ,function(err, results){   
                console.log("result details", err, results);
                     if(results && results.length>0){
                        res.send(results[0]);
                     } else{
                         res.send([]);
                     }           
            });   
};


exports.getCustDetailsFromenid = function(req, res){
    var sess = req.session; 
        var post  = req.body;
        var id = post.lid;
        var sql = "SELECT * from tbl_customers WHERE custid = (SELECT custid  FROM `tbl_customers` b WHERE b.cp_email = (SELECT contact_email  FROM `tbl_login` WHERE enid = ?))";            
        console.log(sql,id);
            db.query(sql,[id] ,function(err, results){   
                console.log("result details", err, results);
                     if(results && results.length>0){
                        res.send(results[0]);
                     } else{
                         res.send([]);
                     }           
            });   
};

exports.savecust = function(req, res){
        var post  = req.body;
        console.log(post);
        var id = post.id;
        var jsondata = JSON.parse(post.formdata)[0];
        var sql = "";
        var params = [];
        if (id !== "") {
            sql = "UPDATE `tbl_customers` SET sapid = ?, sapdesc = ? WHERE custid = ?";
            params = [jsondata.sapid,jsondata.sapdesc,id];
        }else{
            sql = "INSERT INTO `tbl_customers` (`coid`, `sapid`, `sapdesc`, `custname`, `custaddress`, `cp_name`, `cp_email`, `cp_number`) VALUES (?,?,?,?,?,?,?,?)"
            params = [coid,jsondata.sapid,jsondata.sapdesc,jsondata.custname,jsondata.custaddress,jsondata.cp_name,jsondata.cp_email,jsondata.cp_number];
        }
        db.query(sql,params ,function(err, results){   
            console.log("result details", err, results);
            if(results){
               var resp = {
                                status:"0",
                                status_msg:"Success",
                                custid:results.insertId
                            };
                            var response = JSON.parse(JSON.stringify(resp));
                            res.send(response);
            }else{
                var resp = {
                    status:"1",
                    status_msg:err["sqlMessage"]
                };
                var response = JSON.parse(JSON.stringify(resp));
                res.send(response);
            }
        });
};
