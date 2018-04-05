var request = require('request');

exports.showlist = function(req, res) {
    var userinfo = req.session.user;

    var roleid = userinfo["roleid"];
    var enid = userinfo["enid"];
    var custid = userinfo["custid"];
    var userid = userinfo["userid"]
    console.log(userinfo, roleid, custid);
    var sql1 = ""
    var params = [];
    if (roleid == "40") {
        sql1 = "SELECT ticketid,txnrefno, IF(prod_brid = '119', brandname, (SELECT cvvalule FROM `tbl_codevalue` WHERE cvid = prod_brid)) as brandname, IF(prodid = '120', prodcatname, (SELECT cvvalule FROM `tbl_codevalue` WHERE cvid = prodid)) as prodcatname, machinename, issuedetails, serialno, modelno, imgurl1, imgurl2, imgurl3, imgurl4, imgurl5, stsname,date_gen FROM `vw_ticket_status` WHERE custid = ?  ORDER BY ticketid DESC";
        params = [enid];
    } else {
        if (roleid == "38" || roleid == "39") {
            sql1 = "SELECT ticketid,customer, compname, txnrefno, IF(prod_brid = '119', brandname, (SELECT cvvalule FROM `tbl_codevalue` WHERE cvid = prod_brid)) as brandname, IF(prodid = '120', prodcatname, (SELECT cvvalule FROM `tbl_codevalue` WHERE cvid = prodid)) as prodcatname, machinename, issuedetails, serialno, modelno, imgurl1, imgurl2, imgurl3, imgurl4, imgurl5, stsname,date_gen FROM `vw_ticket_status`  ORDER BY ticketid DESC";
        } else {
            sql1 = "SELECT ticketid,customer, compname, txnrefno, IF(prod_brid = '119', brandname, (SELECT cvvalule FROM `tbl_codevalue` WHERE cvid = prod_brid)) as brandname, IF(prodid = '120', prodcatname, (SELECT cvvalule FROM `tbl_codevalue` WHERE cvid = prodid)) as prodcatname, machinename, issuedetails, serialno, modelno, imgurl1, imgurl2, imgurl3, imgurl4, imgurl5, stsname,date_gen FROM `vw_ticket_status` WHERE assignto = ?  ORDER BY ticketid DESC";
            params = [userid];
        }
    }
    console.log(sql1);
    db.query(sql1, params, function(err, results) {

        var final_result = processFileType(results);
        console.log("final result", err, final_result);

        if (roleid == "40") {
            if (results && results.length > 0) {
                res.render("custservicelist", {
                    srvlist: JSON.parse(JSON.stringify(final_result))
                });
            } else {
                res.render("custservicelist", {
                    srvlist: []
                });
            }
        } else {
            if (results && results.length > 0) {
                res.render("compservicelist", {
                    srvlist: JSON.parse(JSON.stringify(final_result))
                });
            } else {
                res.render("compservicelist", {
                    srvlist: []
                });
            }
        }
    });
};

function processFileType(result) {
    var fresult = JSON.parse(JSON.stringify(result));
    var final_result = [];
    for (var i = 0; i < fresult.length; ++i) {
        var json = fresult[i];
        var temp_json; 
        for (var prop in json) {
             temp_json = json;
            if (prop.toString().includes("imgurl1")) {
                temp_json.imgurl1type = filetype(json[prop]);
            } else if (prop.toString().includes("imgurl2")) {
                temp_json.imgurl2type = filetype(json[prop]);
            } else if (prop.toString().includes("imgurl3")) {
                temp_json.imgurl3type = filetype(json[prop]);
            } else if (prop.toString().includes("imgurl4")) {
                temp_json.imgurl4type = filetype(json[prop]);
            } else if (prop.toString().includes("imgurl5")) {
                temp_json.imgurl5type = filetype(json[prop]);
            }
        }
        final_result.push(temp_json);
        temp_json = null;
    }
    return final_result;
}

function filetype(fname) {
    var type = -1;
    var img = /(\.jpg|\.jpeg|\.bmp|\.gif|\.png)$/i;
    var pdf = /(\.pdf)$/i;
    var excel = /(\.xls|\.xlsx|\.csv)$/i;
    if (img.exec(fname)) {
        type = 0;
    } else if (pdf.exec(fname)) {
        type = 1;
    } else if (excel.exec(fname)) {
        type = 2;
    } else {
        type = 0;
    }
    return type;
}

exports.getfilterlist = function(req, res) {
    var userinfo = req.session.user;
    var roleid = userinfo["roleid"];
    var status = req.body.status;
    var custid = userinfo["enid"];
    console.log(userinfo, roleid, custid);
    var params = [];
    var sql1 = ""
    if (roleid == "38" || roleid == "39") {
        /*            if (status == 6) {
                        sql1="SELECT ticketid,customer, compname, txnrefno, IF(prod_brid = '119', brandname, (SELECT cvvalule FROM `tbl_codevalue` WHERE cvid = prod_brid)) as brandname, IF(prodid = '120', prodcatname, (SELECT cvvalule FROM `tbl_codevalue` WHERE cvid = prodid)) as prodcatname, machinename, issuedetails, serialno, modelno, imgurl1, imgurl2, imgurl3, imgurl4, imgurl5, stsname FROM `vw_ticket_status` WHERE ticketsts not in (3,4,5)";
                    }else{ */
        sql1 = "SELECT ticketid,customer, compname, txnrefno, IF(prod_brid = '119', brandname, (SELECT cvvalule FROM `tbl_codevalue` WHERE cvid = prod_brid)) as brandname, IF(prodid = '120', prodcatname, (SELECT cvvalule FROM `tbl_codevalue` WHERE cvid = prodid)) as prodcatname, machinename, issuedetails, serialno, modelno, imgurl1, imgurl2, imgurl3, imgurl4, imgurl5, stsname,date_gen FROM `vw_ticket_status` WHERE ticketsts =?";
        params = [status];
        // }
    } else {

        /*  if (status == 6) {
              sql1="SELECT ticketid,customer, compname, txnrefno, IF(prod_brid = '119', brandname, (SELECT cvvalule FROM `tbl_codevalue` WHERE cvid = prod_brid)) as brandname, IF(prodid = '120', prodcatname, (SELECT cvvalule FROM `tbl_codevalue` WHERE cvid = prodid)) as prodcatname, machinename, issuedetails, serialno, modelno, imgurl1, imgurl2, imgurl3, imgurl4, imgurl5, stsname FROM `vw_ticket_status` WHERE assignto = ? and ticketsts not in (3,4,5)";
         }else{ */
        sql1 = "SELECT ticketid,customer, compname, txnrefno, IF(prod_brid = '119', brandname, (SELECT cvvalule FROM `tbl_codevalue` WHERE cvid = prod_brid)) as brandname, IF(prodid = '120', prodcatname, (SELECT cvvalule FROM `tbl_codevalue` WHERE cvid = prodid)) as prodcatname, machinename, issuedetails, serialno, modelno, imgurl1, imgurl2, imgurl3, imgurl4, imgurl5, stsname,date_gen FROM `vw_ticket_status` WHERE assignto = ? ticketsts =?";
        params = [custid, status];
        // }           
    }

    console.log(sql1);
    db.query(sql1, params, function(err, results) {
        console.log("result", err, results);

        if (results && results.length > 0) {
            res.render("compservicelist", {
                srvlist: JSON.parse(JSON.stringify(results))
            });
        } else {
            res.render("compservicelist", {
                srvlist: []
            });
        }
    });
};

exports.getSrvDetails = function(req, res) {
    var sess = req.session;
    var post = req.body;
    var id = post.lid;
    var sql = "SELECT ticketid, customer, compname, txnrefno, IF(prod_brid = '119', brandname, (SELECT cvvalule FROM `tbl_codevalue` WHERE cvid = prod_brid)) as brandname, IF(prodid = '120', prodcatname, (SELECT cvvalule FROM `tbl_codevalue` WHERE cvid = prodid)) as prodcatname, machinename,issuedetails, serialno, modelno, ticketsts, (SELECT assignto from tbl_ticketsts WHERE ticketid = ? AND sts='0') as assignto FROM `vw_ticket_status` WHERE ticketid = ?";

    console.log(sql, id);
    db.query(sql, [id, id], function(err, results) {
        console.log("result details", err, results);
        if (results && results.length > 0) {
            res.send(results[0]);
        } else {
            res.send([]);
        }
    });

};

exports.updatetktsts = function(req, res) {
    var userinfo = req.session.user;
    var post = req.body;
    console.log(post);
    var id = post.id;
    var jsondata = JSON.parse(post.formdata)[0];

    var sql = "  UPDATE `tbl_ticketsts` SET `sts` = '-1' WHERE `tbl_ticketsts`.`ticketid` = ?";
    db.query(sql, [id], function(err, results) {
        console.log("result details", err, results);
        if (results) {
            var sql1 = "INSERT INTO `tbl_ticketsts` (`coid`, `ticketid`, `ticketsts`, `assignto`,`assignby`, `Notes`) VALUES (?,?,?,?,?,?)";
            db.query(sql1, [coid, id, jsondata["status"], jsondata["assign_to"], userinfo.enid, jsondata["notes"]], function(err, results) {
                console.log("result details", err, results);
                if (results) {
                    var resp = {
                        status: "0",
                        status_msg: "Success",
                        custid: results.insertId
                    };
                    var response = JSON.parse(JSON.stringify(resp));
                    res.send(response);
                } else {
                    var resp = {
                        status: "1",
                        status_msg: err["sqlMessage"]
                    };
                    var response = JSON.parse(JSON.stringify(resp));
                    res.send(response);
                }
            });
        } else {
            var resp = {
                status: "1",
                status_msg: err["sqlMessage"]
            };
            var response = JSON.parse(JSON.stringify(resp));
            res.send(response);
        }
    });
};