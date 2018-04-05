var async = require('async');

exports.compequipmentlist = function(req, res){
    var sql1 = "SELECT prdid,prd_desc,prd_desc1, prd_img, (select cvvalule from tbl_codevalue WHERE cvid=tbl_products.prod_brid) as prod_brid, (select cvvalule from tbl_codevalue WHERE cvid=tbl_products.prod_catid) as prod_catid FROM `tbl_products`";
    console.log(sql1);
        db.query(sql1,[] ,function(err, results){   
            console.log("result", err, results);
               if(results && results.length>0){
                    res.render("compequipment",{equipmentlist:JSON.parse(JSON.stringify(results))});
                }else{
                     res.render("compequipment",{equipmentlist:[]});
                }
    });
}


