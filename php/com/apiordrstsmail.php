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

	$coid = 5;
	$tomail ="contact@apicalin.com";
	$Qry = " Select Name,  format(Sum(Value),2) value from  (select (select tbl_users.username from tbl_users where tbl_users.coid=tbl524.coid and tbl524.userid=tbl_users.userid) Name ,(select tbl55.Name from tbl55 where tbl55.coid=tbl524.coid and tbl55.txnid=tbl524.Custid ) customer, (select (tbl_productdetails.pricerange * qty) from tbl_productdetails where tbl_productdetails.coid = tbl524.coid and tbl_productdetails.prodid=tbl524.prodid)  Value from tbl524 where date(date_gen) = date(now())) a  group by 1 " ;
	$Qry2 = " Select Name, customer, format(Sum(Value),2) value from  (select (select tbl_users.username from tbl_users where tbl_users.coid=tbl524.coid and tbl524.userid=tbl_users.userid) Name ,(select tbl55.Name from tbl55 where tbl55.coid=tbl524.coid and tbl55.txnid=tbl524.Custid ) customer, (select (tbl_productdetails.pricerange * qty) from tbl_productdetails where tbl_productdetails.coid = tbl524.coid and tbl_productdetails.prodid=tbl524.prodid)  Value from tbl524 where date(date_gen) = date(now())) a  group by 1,2 ";
	$Qry1 = " select (select tbl_users.username from tbl_users where tbl_users.coid=tbl524.coid and tbl524.userid=tbl_users.userid) Name ,(select tbl55.Name from tbl55 where tbl55.coid=tbl524.coid and tbl55.txnid=tbl524.Custid ) customer, 
(select tbl_productdetails.prodname from tbl_productdetails where tbl_productdetails.coid = tbl524.coid and tbl_productdetails.prodid=tbl524.prodid ) product, qty,  (select (tbl_productdetails.pricerange * qty) from tbl_productdetails where tbl_productdetails.coid = tbl524.coid and tbl_productdetails.prodid=tbl524.prodid)  Value from tbl524 where date(date_gen) = date(now()) order by 1, 2";
       	$response = executesel($Qry);
	$recs = 0;
	echo (print_r($response,true));
	$mailbody = " Dear Sirs,<br><br> Please find details of the Order Booking       FieldView - PolySet <br><br> <Table style='border: 1px solid black' ><tr><th>Executive Name</th><th>Value</th></tr>";
	 foreach ($response as $row)
                {
			$recs = $recs + 1;
                        $usrname        = $row["Name"];
		//	$custname	= $row["customer"];
	//		$product	= $row["product"];
	//		$Qty		= $row["qty"];
			$value		= $row["value"];
			$mailbody	=$mailbody."<tr><td style='border: .5px solid black' >".$usrname."</td><td style='text-align: right; border: .5px solid black ' >".$value."</td></tr>";
                }
	$mailbody .= "</table><br><br><br>With Regards,<br><br> Apical Support Team";
	echo($mailbody);
	if ($recs >  1)
	{
        $mresponse =sendmailv1($tomail,$mailbody);
	}
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
    $mail->addAddress($tmail);
    
    $mail->isHTML(true);
    $bodyContent = $mbody;
    $mail->Subject = "FieldView - PolySet Order Details";
    $mail->Body    = $bodyContent;
    $response = $mail->send();
	echo($response);
    return ($response);
}

