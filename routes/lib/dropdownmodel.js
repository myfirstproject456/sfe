var Dropdown = {   
    getAssignto: function(mgr,callback) {  
        return db.query("select txnid as id, username as name from tbl_users WHERE tbl_users.txnid=? UNION select txnid as id, username as name from (select txnid,reportingto,username from tbl_users WHERE reportingto is not null order by reportingto, txnid) u,(select @pv := ?) i where find_in_set(reportingto, @pv) > 0 and @pv := concat(@pv, ',', txnid)",[mgr,mgr],callback);  
    },    
    getStatus: function(callback) {  
        return db.query("SELECT cvid as id, cvvalule as name FROM `tbl_codevalue` where cvmasterid=2",callback);  
    },
    getRoles: function(callback) {  
       return db.query("SELECT cvid as id, cvvalule as name FROM `tbl_codevalue`  WHERE cvmasterid = 7",callback);
    },
    getUsers: function(callback) {  
       return db.query(" SELECT txnid as id, username as name FROM `tbl_users`",callback);
    }, 
    getProductbrand: function(callback) {  
       return db.query(" SELECT cvid as id, cvvalule as name FROM `tbl_codevalue`  WHERE cvmasterid = 8 ORDER BY `tbl_codevalue`.`cvvalule` ASC",callback);
    },    
    getProductcat: function(callback) {  
        // return db.query("SELECT prdid as id, prd_desc as name FROM `tbl_products`",callback);
        return db.query(" SELECT cvid as id, cvvalule as name FROM `tbl_codevalue`  WHERE cvmasterid = 9 ORDER BY `tbl_codevalue`.`cvvalule` ASC",callback);  
    },
    getCustomers: function(callback) {  
       return db.query(" SELECT enid as id, enname as name FROM `tbl_login` WHERE roleid = 40",callback);
    }
};  
module.exports = Dropdown;  
