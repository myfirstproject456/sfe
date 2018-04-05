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
        $tomail ="b.dedhia@gmail.com";
        $params = array();
	$Qry = "SELECT COUNT(*) AS count1,COUNT(CASE WHEN (`ticketsts` = 3) THEN 1 END) AS count2,COUNT(CASE WHEN (`ticketsts` = 4 OR `ticketsts` = 5) THEN 1 END) AS count3,COUNT(CASE WHEN (`ticketsts` = 112 OR `ticketsts` = 6 OR `ticketsts` = 7 ) THEN 1 END) AS count4 FROM `vw_ticket_status` WHERE Date(date_gen) = DATE(now())";
	$response = executesel($Qry,$params);
        echo (print_r($response,true));
        $mailbody = " Dear Sir,<br><br> Please find Service Request Summary of SFE-Service  <br><br> <Table cellpadding='10' style='border: 1px solid black' ><tr><th  style='border: .5px solid black'  align='center'>Raised Requests</th><th  style='border: .5px solid black'  align='center'>Pending</th><th  style='border: .5px solid black'  align='center'>Closed</th><th  style='border: .5px solid black'  align='center'>Total Requests</th></tr>";
         foreach ($response as $row)
                {
                        $count1	= $row["count1"];
                        $count2 = $row["count2"];
			$count3 = $row["count3"];
			$count4	= $row["count4"];

                        $mailbody = $mailbody."<tr><td style='border: .5px solid black'  align='center'>".$count2."</td><td style='border: .5px solid black' align='center'>".$count3."</td><td style='border: .5px solid black' align='center'>".$count4."</td><td style='border: .5px solid black' align='center'>".$count1."</td></tr>";
                }
        $mailbody .= "</table><br><br><br>With Regards,<br><br> Apical Support Team";
        echo($mailbody);
        $mresponse =sendmailv1($tomail,$mailbody);
        echo   ($mresponse);

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
    $mail->AddCC('contact@apicalin.com', 'Apical');	
    $mail->isHTML(true);
    $bodyContent = $mbody;
    $mail->Subject = "SFE Service Status";
    $mail->Body    = $bodyContent;
    $response = $mail->send();
	echo($response);
    return ($response);
}
?>
