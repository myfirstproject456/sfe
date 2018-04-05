<?php
/*--------------------------------------------------------------------------
 * Copyright (C) 2017 Apical Innovations- All Rights Reserved
 * You shall use, but not distribute and modify this code under the
 * terms of the license,
 *-------------------------------------------------------------------------*/

require_once dirname(__FILE__) . '/../com/apicalbe.php';
require_once dirname(__FILE__) . '/../com/apicaldb.php';
require_once dirname(__FILE__) . '/../com/apicalul.php';

function dataupld($coid, $scrno, $data)
{
   $Qry      = "select insertsql from tbl_screen where coid=:p1 and scrno= :p2 ";
   $prms = array($coid,$scrno);
   $response = executesel($Qry,$prms);
   $script = $response[0]["insertsql"];
   $nos = substr_count($script,":");
   error_log("DATA RECEIVED ".print_r($data,true));
   for ($i=0;$i<$nos;$i++)
	{
	 $pms .= ':p'.$i.',';
	}
	$pms = rtrim($pms,", ");
	$pms = rtrim($pms,",");
	$params[0] = $coid;
   for ($k=0;$k<$nos-1;$k++)
	{
         $j= $k+1;
 	 $params[$j] = $data[$k];
	}
  	error_log(" PARAMETER  RECEIVED ".print_r($params,true));
   	$syncrespons = executedml($script,$params); 
 	error_log(" SYNC RESPONSE       ".print_r($syncrespons,true));

	return($syncrespons);
}
;

function gettxntab($coid,$txnid)
{
    $Qry   = "select scrnid from systxncontrol where coid=:p1 and txnid=:p2";
    $pram  = array($coid,$txnid);
    $rsp   = executesel($Qry,$pram);
    $respons = 'tbl'.$coid.$rsp[0]["scrnid"];
    return($respons);
}


?>
