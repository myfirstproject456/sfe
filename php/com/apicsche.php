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
   error_log("*********************************************************record***********************************8 :");
   error_log(print_r($data,true));
   $Qry      = "select insertsql from tbl_screen where coid=:p1 and scrno= :p2 ";
   $prms = array($coid,$scrno);
   $response = executesel($Qry,$prms);
   $script = $response[0]["insertsql"];
   $nos = substr_count($script,":");
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
   	$syncrespons = executedml($script,$params); 
  error_log("*  Respons ********************************************************record***********************************8 :");
  error_log(print_r($syncrespons,true));
 
	return($syncrespons);
}
;
?>
