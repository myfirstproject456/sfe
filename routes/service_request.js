var async = require('async');
var fs = require("fs");
var multer = require('multer');

exports.contentupload = function(req, res) {

    var files = [];

    // var coid = req.session.user.coid;
    var enid = req.session.user.enid;
    
    var custid = enid;
    var filewithdir, doc_name = '',
        doc_desp = '';
    var post;

    function getAllKpis(callback) {

        console.log("getAllKpis function called");
        /*       async.parallel([
                  savedata
               ], function(err, done) {
                   if(err) console.log(err);
                   res.redirect('/dashboard');
                 });*/

        async.waterfall([
            getcutomerdata,
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
            filename = coid + "_" + enid + "_" + Date.now() + "_" + file.originalname;
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
        if(post.custid){
            custid = post.custid;
        }
        console.log("COntext body", req.body);
        getAllKpis();
    });

    function getcutomerdata(callback) {
        var query = "SELECT contact_mobileno,contact_email FROM `tbl_login` WHERE enid =?"

        db.query(query, [custid], function(err, results) {
            if (err) {
                console.log(err);
            } else {
                var customerdata = JSON.parse(JSON.stringify(results)); // Scope is larger than function 
            }
            callback(err, customerdata);
        });
    }

    function savedata(customerdata, callback) {
        var txnrefno = new Date().getTime();

        for (var i = files.length; i < 5; i++) {
            files.push("");
        }

        var brandname = "";
        if (post.prod_brid == '119') {
            brandname = post.brandname;
        }

        var prodcatname = "";
        if (post.product == '120') {
            prodcatname = post.prodcatname;
        }

        console.log("customer data", customerdata);
        var query = "INSERT INTO `tbl_tickets` (`coid`, `txnrefno`, `custid`, `contactno`, `contactemail`,`prod_brid`, `prodid`,`brandname`,`prodcatname`,`machinename`, `batchdate`,`issuedetails`, `serialno`, `modelno`, `imgurl1`, `imgurl2`, `imgurl3`, `imgurl4`, `imgurl5`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"

        var params = [coid, txnrefno, custid, customerdata[0].contact_mobileno, customerdata[0].contact_email, post.prod_brid, post.product, brandname, prodcatname, post.machinename, post.batchdate, post.description, post.serialno, post.modelno];

        for (var i = 0; i < files.length; i++) {
            params.push(files[i]);
        }

        db.query(query, params, function(err, results) {
            console.log("service requst response : ",err,results);
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