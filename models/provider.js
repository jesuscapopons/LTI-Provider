 
const https = require('https');


function info()
{
	console.log( 'Flip Flop provider 1.0');
}

function sendGrade(hostConsumer,pathConsumer,portConsumer,grade,messageid,oauth_consumer_key,sourcedid,oauth_version,oauth_timestamp,oauth_body_hash,oauth_signature_method,oauth_signature,oauth_nonce)
{
	
	var body = '<?xml version = "1.0" encoding = "UTF-8"?> <imsx_POXEnvelopeRequest xmlns = "http://www.imsglobal.org/services/ltiv1p1/xsd/imsoms_v1p0">  <imsx_POXHeader>    <imsx_POXRequestHeaderInfo>  <imsx_version>V1.0</imsx_version>   <imsx_messageIdentifier>'+ messageid +'</imsx_messageIdentifier>  </imsx_POXRequestHeaderInfo> </imsx_POXHeader>  <imsx_POXBody>    <replaceResultRequest>      <resultRecord>        <sourcedGUID>          <sourcedId>'+sourcedid+'</sourcedId>        </sourcedGUID>        <result>          <resultScore>            <language>en</language>            <textString>'+grade+'</textString>          </resultScore>        </result>      </resultRecord>    </replaceResultRequest>  </imsx_POXBody></imsx_POXEnvelopeRequest>';

	var postRequest = {
		host: hostConsumer,
		path: pathConsumer,
		port: portConsumer,
		method: "POST",
		headers: {
			'Cookie': "cookie",
			'Content-Type': 'application/xml',
			'Content-Length': body.length,
			//'Content-Length': Buffer.byteLength(body)		
			'Authorization': 'OAuth realm=""',
			'oauth_version':oauth_version,
			'oauth_consumer_key': oauth_consumer_key,
			'oauth_timestamp':oauth_timestamp,

			//'oauth_body_hash':oauth_body_hash,

			'oauth_signature_method':oauth_signature_method,

			'oauth_signature':oauth_signature,
			'oauth_nonce':oauth_nonce

			 
		},
	agentOptions: 
	{
      ciphers: 'ALL',
      secureProtocol: 'TLSv1_method',
    }
	
	
	};

	

	console.log( body);
	
	var buffer = "";

	var req = https.request( postRequest, function( res )    {

	   console.log( res.statusCode );
	   var buffer = "";
	   res.on( "data", function( data ) { buffer = buffer + data; } );
	   res.on( "end", function( data ) { console.log( buffer ); } );

	});

	req.on('error', function(e) {
		console.log('Error petición: ' + e.message);
	});

	req.write( body );
	req.end();
	
	
}


/*
 Exportar el modelo para usarlo
 */
module.exports = {sendGrade,info}
