// exports.index = function(req, res){
//     var message = '';
 // res.render('index',{message: ""});
// }

exports.index = function(req, res){
    var message = '';
  res.render('register',{message: ""});
}

/*exports.index = function(req, res){
    var message = '';
  res.render('login1',{message: ""});
}*/

exports.register = function(req, res){
    var message = '';
    res.render('register');
}

exports.userlogin = function(req, res){
    var message = '';
  res.render('index',{message: ""});
}

exports.help = function(req, res){
    var message = '';
  res.render('help',{message: ""});
}