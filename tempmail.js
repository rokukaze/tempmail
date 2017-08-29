var http = require('http'); //tried with plain http module, didn't work well
var request = require('request'); //much easier than http, but bloated program to 5 mb
var crypto = require('crypto'); //to create md5 hash

function grabUsernameAndEmails() 
{
	request("http://temp-mail.ru/", function (error, response, html) 
	{
		if (!error && response.statusCode == 200) 
			{
			var regex = /opentip" value="(.*)" data-placement=/.exec(html);
			console.log("Returned match is " + regex[1]); //[0] returns complete string, [1] returns only string between matching restrictions
			setInterval(requestEmails, 5000, [calculateMD5Hash(regex[1])]);
		}
	});
}

function calculateMD5Hash(stringToHash) 
{
	var hash = crypto.createHash('md5').update(stringToHash).digest('hex');
	return hash;
}

function requestEmails(hashedEmail) 
{
	http.get("http://api.temp-mail.ru/request/mail/id/" + hashedEmail + "/format/json", function (response) 
	{
		// Continuously update stream with data
		var body = '';
		response.on('data', function (d) 
		{
			body += d;
		});
		response.on('end', function () 
		{

			// Data reception is done, do whatever with it!
			var parsed = JSON.parse(body);
			console.log(parsed);
		});
	});
}

grabUsernameAndEmails();