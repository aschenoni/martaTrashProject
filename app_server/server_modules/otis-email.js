var Email = function(server){
	var email = {
		text: text,
		from: from,
		to: to,
		cc: cc,
		subject: subject,
		attachment: attachment,
		send: send,
		server: server,
		emailContent: {}
	}

	return email;

	function text(messageText){
		email.emailContent.text = messageText;
		return email;
	}

	function from(address){
		email.emailContent.from = address;
		return email;
	}

	function to(address){
		email.emailContent.to = address;
		return email;
	}

	function cc(address){
		email.emailContent.cc = address;
		return email;
	}

	function subject(subjectText){
		email.emailContent.subject = subjectText;
		return email;
	}

	function attachment(attachmentArray){
		email.emailContent.attachment = attachmentArray; 
		return email;
	}

	function send(callback){
		server.send(email.emailContent, callback);
	}

}

module.exports = Email;