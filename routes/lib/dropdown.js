var express = require('express');  
var router = express.Router();  
var Dropdown = require('./dropdownmodel');  

router.get('/getstatus', function(req, res, next) {  
        Dropdown.getStatus(function(err, rows) {  
            if (err) {  
                res.send(err);  
                console.log("Error dropdown");
            } else {  
                res.send(rows);  
            }  
        });      
}); 

router.get('/getassignto', function(req, res, next) {  
        
        var sql1 = "SELECT txnid FROM `tbl_users` WHERE email = ?";
        db.query(sql1,[req.session.user.loginid] ,function(err, results){
            console.log("login id getAssignto : ",req.session.user.loginid, results);
            if (results) {
                var resp = JSON.parse(JSON.stringify(results));
                Dropdown.getAssignto(resp[0].txnid,function(err, rows) {  
                    if (err) {  
                        res.send(err);  
                        console.log("Error dropdown");
                    } else {  
                        res.send(rows);  
                    }  
                });
            }
        });
              
}); 

router.get('/getroles', function(req, res, next) {  
    console.log("called");
        Dropdown.getRoles(function(err, rows) {  
            if (err) {  
                res.send(err);  
                console.log("Error dropdown");
            } else {  
                res.send(rows);  
            }  
        });      
}); 

router.get('/getusers', function(req, res, next) {  
    console.log("called");
        Dropdown.getUsers(function(err, rows) {  
            if (err) {  
                res.send(err);  
                console.log("Error dropdown");
            } else {  
                res.send(rows);  
            }  
        });      
}); 

router.get('/getproductscat', function(req, res, next) {  
    console.log("called");
        Dropdown.getProductcat(function(err, rows) {  
            if (err) {  
                res.send(err);  
                console.log("Error dropdown");
            } else {  
                res.send(rows);  
            }  
        });      
}); 

router.get('/getproductbrand', function(req, res, next) {  
    console.log("called");
        Dropdown.getProductbrand(function(err, rows) {  
            if (err) {  
                res.send(err);  
                console.log("Error dropdown");
            } else {  
                res.send(rows);  
            }  
        });      
}); 


router.get('/getcustomers', function(req, res, next) {  
    console.log("called");
        Dropdown.getCustomers(function(err, rows) { 
            console.log("customers : ",rows);
            var row = {
                id:0,
                name : 'Other'
            };
            if (err) {  
                res.send(err);  
                console.log("Error dropdown");
            } else {  
                rows.unshift(row);
                res.send(rows);  
            }  
        });      
}); 

module.exports = router;  