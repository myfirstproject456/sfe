<?php
require_once dirname(__FILE__) . '/../com/apicalbe.php';
require_once dirname(__FILE__) . '/../com/apicaldb.php';
require      dirname(__FILE__) . '/../vendor/autoload.php';
require_once dirname(__FILE__) . '/../com/apiconst.php';
require_once dirname(__FILE__) . '/../com/apicalul.php';


   $Qry      = "select coid,scrno,fldno,fld_name from tbl_screen_dtl where coid=:p1 and scrno=:p2 order by coid, scrno, fld_seq ";
   $UpdQry = " update tbl_screen set insertsql = :p1 where coid = :p2 and scrno=:p3";
   $coid = 3;
   $scrno = 4;
   $prms = array($coid,$scrno);
   $response = executesel($Qry,$prms);
   $tbl_ins = ' insert into  tbl';	
   $tbl_inscol = '';
   $tbl_insval = '';
   $tbl_create = 'create table tbl';
   $tbl_bal01 =' ( txnid int(32) auto_increment,';
   $tbl_bal02 ='  ';
   $tbl_bal03 = ' mis_sts int(2) default 0 not null, userid int(32) not null, txn_latid varchar(500), txn_longid varchar(500), status int(2) default 0 not null, date_gen datetime default now() not null, PRIMARY KEY (txnid));';
   $scr_no = 0;
   $i = 1;	
    foreach ($response as $row)
    {
      if (($scr_no == 0 ))
        {
	    $scr_no = $row["scrno"];
	    $coid   = $row["coid"];
            $tbl_create .= $coid.$scr_no.$tbl_bal01;
	    $tbl_ins .= $coid.$scr_no.' (';
        }
        $tbl_bal02 .= ' '.$row["fld_name"].' varchar(500),';
	$tbl_inscol .= ' '.$row["fld_name"]."," ;
	$tbl_insval .= ':p'.$i++.",";
	$scr_no = $row["scrno"];    
	}
	 $tbl_inscol .= 'userid, txn_latid, txn_longid';
	 //$tbl_inscol  = rtrim($tbl_inscol,",");
	 //$tbl_inscol = rtrim($tbl_inscol,", ");
	 $tbl_insval = rtrim($tbl_insval,",");
	 $tbl_insval = rtrim($tbl_insval,", ");
	$tbl_inscol .= ') values (';
	$tbl_insval .= ',:p'.$i++.",".':p'.$i++.",".':p'.$i++.' )';
    $tbl_create .=$tbl_bal02.$tbl_bal03;               
    $response = executedml($tbl_create);	
    $tbl_insert = $tbl_ins.$tbl_inscol.$tbl_insval;	
    $params = array ($tbl_insert,$coid,$scrno);
    $rdata = executedml($UpdQry,$params);  	
    var_dump($tbl_insert);
;
?>
