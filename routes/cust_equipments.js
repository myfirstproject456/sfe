var async = require('async');
var fs = require("fs");
var multer = require('multer'); 
    
exports.equipmentlist = function(req, res){
    // res.render('equipmentlist.ejs');  
    var userinfo = req.session.user;
    var roleid = userinfo["roleid"];
    var loginid = userinfo["loginid"];
    console.log(userinfo, roleid, loginid);
    var custid = userinfo.custid;
    var sql1 = "SELECT equiid,custid,IF(prod_brid = '119', brandname, (SELECT cvvalule FROM `tbl_codevalue` WHERE cvid = prod_brid)) as brandname, IF(prod_catid = '120', prodcatname, (SELECT cvvalule FROM `tbl_codevalue` WHERE cvid = prod_catid)) as prodcatname, machinename, department, modelno, serialno, description, qty, imgurl1, imgurl2, imgurl3, imgurl4, imgurl5, batchdate FROM `tbl_cust_prodmap` WHERE custid = ?";
    db.query(sql1,[custid] ,function(err, results){   
    // console.log("result", err, results);
        if(results && results.length>0){
            res.render("cust_equipments",{srvlist:JSON.parse(JSON.stringify(results)),custid:custid,datacount:1});
        }else{
            res.render("cust_equipments",{srvlist:[],custid:custid,datacount:2});
        }
    });        
}

exports.custequipmentlist = function(req, res){
    // res.render('equipmentlist.ejs');
    console.log(req.body);
    // var post = JSON.parse(JSON.stringify(req.body));
    var custid = req.body.custid;
    var sql1 = "SELECT equiid,custid,IF(prod_brid = '119', brandname, (SELECT cvvalule FROM `tbl_codevalue` WHERE cvid = prod_brid)) as brandname, IF(prod_catid = '120', prodcatname, (SELECT cvvalule FROM `tbl_codevalue` WHERE cvid = prod_catid)) as prodcatname, machinename, department, modelno, serialno, description, qty, imgurl1, imgurl2, imgurl3, imgurl4, imgurl5, batchdate FROM `tbl_cust_prodmap` WHERE custid = ?";
    console.log(custid, sql1);
        db.query(sql1,[custid] ,function(err, results){   
            // console.log("result", err, results);
               if(results && results.length>0){
                    res.render("cust_equipments",{srvlist:JSON.parse(JSON.stringify(results)),custid:custid,datacount:1});
                }else{
                     res.render("cust_equipments",{srvlist:[],custid:custid,datacount:2});
                }
    });
}


exports.getdetails = function(req, res){
    // res.render('equipmentlist.ejs');
    console.log("equipment details ",req.body);
    // var post = JSON.parse(JSON.stringify(req.body));
    var equiid = req.body.id;
    var sql1 = "SELECT equiid,custid,  prod_brid, prod_catid, IF(prod_brid = '119', brandname, (SELECT cvvalule FROM `tbl_codevalue` WHERE cvid = prod_brid)) as brandname, IF(prod_catid = '120', prodcatname, (SELECT cvvalule FROM `tbl_codevalue` WHERE cvid = prod_catid)) as prodcatname, machinename, department, modelno, serialno, description, qty, imgurl1, imgurl2, imgurl3, imgurl4, imgurl5, batchdate FROM `tbl_cust_prodmap` WHERE equiid = ?";
    console.log(equiid, sql1);
        db.query(sql1,[equiid] ,function(err, results){   
            console.log("result", err, results);
                if(results && results.length>0){
                    res.send(JSON.parse(JSON.stringify(results)));
                }else{
                    res.send([]);
                }
    });
}

exports.contentupload = function(req, res) {
    var files = [];
    var coid = req.session.user.coid;
    var userid = req.session.user.enid;
    var filewithdir, doc_name = '',
        doc_desp = '';
    var post;

    function getAllKpis(callback) {

        console.log("getAllKpis function called");
        async.waterfall([
            savedata
        ], function(error, success) {
            if (error) {
                console.log('Something is wrong!', error);
                var resp = {
                    status: "1",
                    status_msg: error["sqlMessage"]
                };
                res.send(resp);
            } {
                console.log("done processing");
                var resp = {
                    status: "0",
                    status_msg: "Success",
                    insertId: success.insertId
                };
                res.send(resp);
            }
        });
    };

    var Storage = multer.diskStorage({
        destination: function(req, file, callback) {
            callback(null, "./Contents");
        },
        filename: function(req, file, callback) {
            filename = coid + "_" + req.body.custid + "_" + Date.now() + "_" + file.originalname;
            var i = filename.lastIndexOf('.');
            extesion = (i < 0) ? '' : filename.substr(i);
            //            console.log(extesion);
            filewithdir = '/Contents/' + filename;
            files.push(filewithdir);

            console.log("FileArray", files);
            console.log("Filename", filename);
            callback(null, filename);
        }
    });

    var upload = multer({
        storage: Storage
    }).array("imgUploader", 5); //Field name and max count 
    upload(req, res, function(err) {
        if (err) {
            return res.end("Something went wrong!");
        }
        post = req.body;
        console.log("COntext body", req.body);
        getAllKpis();
    });

    function getcutomerdata(callback) {
        var query = "SELECT contact_mobileno,contact_email FROM `tbl_login` WHERE enid =?"

        db.query(query, [userid], function(err, results) {
            if (err) {
                console.log(err);
            } else {
                var customerdata = JSON.parse(JSON.stringify(results)); // Scope is larger than function 
            }
            callback(err, customerdata);
        });
    }

    function savedata(callback) {
        var txnrefno = new Date().getTime();

        for (var i = files.length; i < 5; i++) {
            files.push("");
        }

        var brandname = "";
//        console.log("brandname : ",post.brandname,"  boolean : ",(post.prod_bridequip == '119'))
        if (post.prod_bridequip == '119') {
            brandname = post.brandname;
        }

        var prodcatname = "";
        if (post.productequip == '120') {
            prodcatname = post.prodcatname;
        }
//        console.log("prodcatname : ",post.prodcatname,"  boolean : ",(post.productequip == '120'))
var query = "";
var params =[];
        if (post.equiid == '') {
             query = "INSERT INTO `tbl_cust_prodmap` (`custid`, `prod_brid`, `prod_catid`, `brandname`, `prodcatname`, `machinename`,`department`, `modelno`, `serialno`, `description`, `qty`, `batchdate`, `imgurl1`, `imgurl2`, `imgurl3`, `imgurl4`, `imgurl5`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
             params = [post.custid, post.prod_bridequip, post.productequip, brandname, prodcatname,post.machinename, post.department, post.modelno, post.serialno, post.description, post.qty, post.batchdate];
        }else{
             query = "UPDATE `tbl_cust_prodmap` SET `custid` = ?, `prod_brid` = ?, `prod_catid` = ?, `brandname` = ?, `prodcatname` = ?,`machinename` = ?, `department` = ?, `modelno` = ?, `serialno` = ?, `description` = ?, `qty` = ?, `batchdate` = ?, `imgurl1` = ?, `imgurl2` = ?, `imgurl3` = ?, `imgurl4` = ?, `imgurl5` = ? WHERE `tbl_cust_prodmap`.`equiid` = ?;"
             params = [post.custid, post.prod_bridequip, post.productequip, brandname, prodcatname,post.machinename, post.department, post.modelno, post.serialno, post.description, post.qty, post.batchdate];
        }
        for (var i = 0; i < files.length; i++) {
            params.push(files[i]);
        }
        params.push(post.equiid);

        console.log("insert/UPDATE equi ",query, params );
        db.query(query, params, function(err, results) {
            console.log("insert/UPDATE results ",err, results );
            if (err) {
                console.log(err);
            } else {
                var staging = JSON.parse(JSON.stringify(results)); // Scope is larger than function 
            }
            callback(err, staging);
        });
        // callback(null,customerdata);
    }
}