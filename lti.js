
const express = require('express');
const router = express.Router();


const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/lti');
const Consumer = require('./models/consumer');
const Provider = require('./models/provider');

/*
 * Tal i como dice el plugin "ims-lti"  se nos ofrece una
validación respuesta LTI y un  oauth signature.
  https://github.com/omsmith/ims-lti
 */
const lti = require('ims-lti');

/*
 * El cliente LTI envia un POST con la infromación del usuario y datos de autorización
 */
router.post('/', (req, res, next) => 
{
    const consumerKey = req.body.oauth_consumer_key;
	
	console.log(JSON.stringify(req.body));
	
	console.log("Clave consumidor:"+consumerKey);
	
    if (typeof consumerKey === 'undefined' || consumerKey === null) 
	{
        next('Must specify oauth_consumer_key in request.');
	}

	/*
	  Utilizando el oauth consumer key del POST obtenemos la palabra secreta que debe hacer match con la de la base de datos.
	  El plugin  "ims-lti" valida el POST para nosotros. Si lo valida elimina la sesión anterior y crea una de nueva. Dicha nueva sessión almacena los datos del usuario enviados por POST.
		 
		 Son importantes de momento el "context_id" y el  "userId", entre otros.
	 */
    Consumer.findOne({key: consumerKey}, 'secret', (err, consumer) => {
        if (err) next(err);

        const consumerSecret = (consumer || {}).secret;
        const provider = new lti.Provider(consumerKey, consumerSecret);
 
        provider.valid_request(req, (err, isValid) => {
			
			console.log("Petición válida");
			
            if(isValid) {
                req.session.regenerate(err => {
                    if (err) next(err);
					
					console.log("Id contexto"+provider.context_id);
                    
					req.session.contextId = provider.context_id;
                    req.session.userId = provider.userId;
					req.session.tool_consumer_instance_guid=req.body.tool_consumer_instance_guid;
					req.session.tool_consumer_instance_guid=req.body.lis_person_name_family;
					 
					
					console.log("tool_consumer_instance_guid"+req.body.tool_consumer_instance_guid);
					console.log("tool_consumer_instance_guid"+req.session.tool_consumer_instance_guid);
					
					req.session.tool_consumer_instance_guid=req.body.lis_person_name_full;
					
					req.session.lis_person_contact_email_primary=req.body.lis_person_contact_email_primary;
					req.session.ext_user_username=req.body.ext_user_username;
					req.session.lis_person_name_given=req.body.lis_person_name_given;
					req.session.lis_person_name_family=req.body.lis_person_name_family;
					req.session.lis_outcome_service_url=req.body.lis_outcome_service_url;
					req.session.tool_consumer_info_product_family_code=req.body.tool_consumer_info_product_family_code;
					req.session.tool_consumer_instance_name=req.body.tool_consumer_instance_name;
					req.session.resource_link_title=req.body.resource_link_title;
					req.session.lti_version=req.body.lti_version;
					req.session.lis_result_sourcedid=req.body.lis_result_sourcedid;
					req.session.oauth_consumer_key=req.body.oauth_consumer_key;
					 req.session.oauth_version=req.body.oauth_version
					 req.session.oauth_nonce=req.body.oauth_nonce;
					 req.session.oauth_timestamp=req.body.oauth_timestamp;
					 req.session.oauth_body_hash=req.body.oauth_body_hash;
					 req.session.oauth_signature_method=req.body.oauth_signature_method;
					 req.session.oauth_signature=req.body.oauth_signature;
					//envia la nota de la actidad
					//lis_result_sourcedid
					//"lis_outcome_service_url":"https://flipflop.moodlecloud.com/mod/lti/service.php"
					
					Provider.info();
					
				    Provider.sendGrade('flipflop.moodlecloud.com','/mod/lti/service.php','443','90','1',req.session.oauth_consumer_key,req.session.sourcedid,req.session.oauth_version,req.session.oauth_timestamp,req.session.oauth_body_hash,req.session.oauth_signature_method,req.session.oauth_signature, req.session.oauth_nonce)
					
                    res.redirect(301, '/app/');
                });
            } else {
                next(err);
            }
        });
    });

});

/*
Para generar un par de llaves para el consumidor. DEbo elimnar o hacerlo sólo interno
 */
router.post('/consumer/', (req, res, next) => {
    const token = new Consumer();
    token.save();
    res.json(token);
});
router.get('/consumer/', (req, res, next) => {
    const token = new Consumer();
    token.save();
    res.json(token);
});

/*
 * At the end we export the paths so our application can use them.
 */
module.exports = router;
