<?php
/*--------------------------------------------------------------------------
 * Copyright (C) 2017 Apical Innovations- All Rights Reserved
 * You shall use, but not distribute and modify this code under the
 * terms of the license,
 *-------------------------------------------------------------------------*/

require_once 'apiconst.php';
require_once 'mailer/PHPMailerAutoload.php';

function sendv1($ids, $msgbody, $title, $soundflg,$type,$sosurl,$clickaction,$date)
{
        error_log(print_r($ids,true));
        error_log("++++++++++++++++++++++++++++++++++++".$soundflg);

    $registrationIds = array();
foreach ($ids as $key => $value){
        $registrationIds[$key] = $value['fcmid'];
    }
    $msg = array(
        'body' => $msgbody,
        'title' => $title,
        'vibrate' => 1,
        'sound' => $soundflg,
        'priority'=>"high",
        'click_action' =>$clickaction
 );

$data=array(
'body'=>$msgbody
//'type'=>$type."!".$msgbody."!".$date."!".$sosurl,
//'sosurl'=>$sosurl,
//'adid' =>$soundflg,
//'click_action'=>$clickaction
);
    $fields          = array(
        'registration_ids' => $registrationIds,
//        'notification' => $msg,
        'data'=>$data
    );
    $headers = array(
        'Authorization:key='.P6,
        'Content-Type:application/json'
    );

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, P5);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($fields));
    $result = curl_exec($ch);
error_log(print_r($result,true));
    curl_close($ch);
  return ($result);
}




function sendmail($name, $tomail,$otp,$uid)
{
    $mail = new PHPMailer;
    
    $mail->isSMTP(); // Set mailer to use SMTP
    $mail->Host       = P12; // Specify main and backup SMTP servers
    $mail->SMTPAuth   = true; // Enable SMTP authentication
    $mail->Username   = P13; // SMTP username
    $mail->Password   = P14; // SMTP password
    $mail->SMTPSecure = 'tls'; // Enable TLS encryption, `ssl` also accepted
    $mail->Port       = 587; // TCP port to connect to
    
    $mail->setFrom(P13, P15);
    $mail->addReplyTo(P13, P15);
    $mail->addAddress($tomail);
    
    $mail->isHTML(true);
    $tmp1 = str_replace("[:name]",$name,P19);
    $url = P17."?q=".$otp."&a=".$uid;
    $tmp2 = str_replace("[:url]",$url,$tmp1); 
    $bodyContent = $tmp2;
    $mail->Subject = P16;
	error_log('Error while ***** Send Mail  ****   '.$bodyContent    ,0, 'Message: ');
    $mail->Body    = $bodyContent;
    
    $response = $mail->send();
    return ($response);
}

function generateRandomString($length = 8)
{
    $characters       = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString     = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
}
                                                       

function getgeo($address)
{
$url = 'https://maps.googleapis.com/maps/api/geocode/json?address='.$address.'&key='.P99;
$url = 'http://maps.google.com/maps/api/geocode/json?address='.$address.'&sensor=false&region=India';
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_PROXYPORT, 3128);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
$response = curl_exec($ch);
curl_close($ch);
$response_a = json_decode($response);
var_dump(print_r($response,true));
echo $lat = $response_a->results[0]->geometry->location->lat;
echo "<br />";
echo $long = $response_a->results[0]->geometry->location->lng;
return ($lat.','.$long);
}

function getLatLong($address){
    if(!empty($address)){
        //Formatted address
        $formattedAddr = str_replace(' ','+',$address);
        //Send request and receive json data by address
        $geocodeFromAddr = file_get_contents('http://maps.googleapis.com/maps/api/geocode/json?address='.$formattedAddr.'&sensor=false&key='.P99); 
        $output = json_decode($geocodeFromAddr);
        //Get latitude and longitute from json data
        $data['latitude']  = $output->results[0]->geometry->location->lat; 
        $data['longitude'] = $output->results[0]->geometry->location->lng;
        //Return latitude and longitude of the given address
        if(!empty($data)){
            return $data;
        }else{
            return false;
        }
    }else{
        return false;   
    }
};


