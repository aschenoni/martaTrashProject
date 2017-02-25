var mailer = require('emailjs');
var otisEmail = require('./otis-email.js');
otisMail = {
	user: '',
	password: '',
	host: '',
	ssl: false,
	credentials: credentials,
	hostname: hostname,
	connect: connect,
	email: email,
}

function credentials(user, password){
	otisMail.user = user;
	otisMail.password = password;
	return otisMail;
}

function hostname(address, ssl, port){
	otisMail.host = address;
	if(port){
		otisMail.port = port;
	}
	otisMail.ssl = ssl || false;
	return otisMail;
}

function connect(){
	otisMail.server = mailer.server.connect(otisMail);
	return otisMail;
}

function email(){
	return new otisEmail(otisMail.server);
}


module.exports = otisMail;