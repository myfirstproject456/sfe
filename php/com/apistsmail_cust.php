<?php
/*--------------------------------------------------------------------------
 * Copyright (C) 2017 Apical Innovations- All Rights Reserved
 * You shall use, but not distribute and modify this code under the
 * terms of the license,
 *-------------------------------------------------------------------------*/

require_once 'apicalbe.php';
require_once 'apicaldb.php';
require_once 'apiconst.php';
require_once 'mailer/PHPMailerAutoload.php';
require_once 'apicsync.php';

        $coid = 5;
        $tomail ="tejas@apicalinnovations.com";
	$Qry = "SELECT ticketid,Notes, compname,contactno,contactemail,serialno,modelno,issuedetails,machinename,(select tbl_codevalue.cvvalule from tbl_codevalue WHERE tbl_codevalue.cvid = prodid) as product_cat, (select tbl_codevalue.cvvalule from tbl_codevalue WHERE tbl_codevalue.cvid = prod_brid) as product_brand FROM `vw_ticket_status`";        
	$params = array();
	$response = executesel($Qry,$params);

//foreach ($response as $row)
  //              {
	$row = $response[0];	
$product = $row["product_cat"];
$product_brand = $row["product_brand"];
$serialno = $row["serialno"];
$modelno = $row["modelno"];
$issuedetails = $row["issuedetails"];
$machinename = $row["machinename"];
	$name = $row["compname"];
	$mailbody = "Dear ".$name.",<br/>Thank you for submitting your service request.<br/><br/>A record of your request has been created in our system with the following information:";

        $mailbody = $mailbody."<br/><Table style='border: 1px solid black'>";
        $mailbody =$mailbody."<tr><td   align='center'>Product Category</td><td  align='center'>".$product."</td></tr><tr><td align='center'>Product Brand</td><td  align='center'>".$product_brand."</td></tr><tr><td  align='center'>Serial Number</td><td  align='center'>".$serialno."</td></tr><tr><td  align='center'>Model number</td><td  align='center'>".$modelno."</td></tr><tr><td  align='center'>Issue Details</td><td  align='center'>".$issuedetails."</td></tr><tr><td  align='center'>Machine Name</td><td  align='center'>".$machinename."</td></tr>";
                
        $mailbody .= "</table><br><br><br>With Regards,<br><br> SFE Support Team";
        echo($mailbody);
        $mresponse =sendmailv1($tomail,$mailbody);
        echo   ($mresponse);
//}
function sendmailv1($tmail,$mbody)
{   
    $mail = new PHPMailer;
    
    $mail->isSMTP(); // Set mailer to use SMTP
    $mail->Host       = P12; // Specify main and backup SMTP servers
    $mail->SMTPAuth   = true; // Enable SMTP authentication
    $mail->Username   = "teamfieldview@gmail.com";// SMTP username
    $mail->Password   = "Mdex@2312"; // SMTP password
    $mail->SMTPSecure = 'tls'; // Enable TLS encryption, `ssl` also accepted
    $mail->Port       = 587; // TCP port to connect to
    
    $mail->setFrom(P13, P15);
    $mail->addReplyTo(P13, P15);
   // $mail->addAddress($tmail);
    
    $addr = explode(',',$tmail);

    foreach ($addr as $ad) {
    $mail->addAddress(trim($ad));       
    }

    $mail->isHTML(true);
    $bodyContent = $mbody;
    $mail->Subject = "SFE Service Request Report";
    $mail->Body    = $bodyContent;
    $response = $mail->send();
	echo($response);
    return ($response);
}
?>
