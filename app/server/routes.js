
var CT = require('./modules/country-list');
var AM = require('./modules/account-manager');
var EM = require('./modules/email-dispatcher');
var fs = require('fs')
var WebSocket = require('ws')
var https = require('https')

const server = https.createServer({
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
  }).listen(8080);

const wss = new WebSocket.Server({ server });

module.exports = function(app) {

/*
	Helpers
*/
const attemptAutoLogin = (req, res, redirect) => {
	AM.validateLoginKey(req.cookies.login, req.ip, function(e, o){
		if (o){
			AM.autoLogin(o.user, o.pass, function(o){
				req.session.user = o;
				res.redirect(redirect);
			});
		}	else{
			res.render('login', { title: 'Hello - Please Login To Your Account' });
		}
	});
};

	
/*
	login & logout
*/

	app.get('/', function(req, res){
	// check if the user has an auto login key saved in a cookie //
		if (req.cookies.login == undefined){
			res.render('login', { title: 'Hello - Please Login To Your Account' });
		}	else{
	// attempt automatic login //
			attemptAutoLogin(req, res, "/introduction");
		}
	});
	
	app.post('/', function(req, res){
		AM.manualLogin(req.body['user'], req.body['pass'], function(e, o){
			if (!o){
				res.status(400).send(e);
			}	else{
				req.session.user = o;
				if (req.body['remember-me'] == 'false'){
					res.status(200).send(o);
				}	else{
					AM.generateLoginKey(o.user, req.ip, function(key){
						res.cookie('login', key, { maxAge: 900000 });
						res.status(200).send(o);
					});
				}
			}
		});
	});

	app.post('/logout', function(req, res){
		res.clearCookie('login');
		req.session.destroy(function(e){ res.status(200).send('ok'); });
	})
	
/*
	control panel
*/
	
	app.get('/home', function(req, res) {
		if (req.session.user == null){
			res.redirect('/');
		}	else{
			res.render('home', {
				title : 'Control Panel',
				countries : CT,
				udata : req.session.user
			});
		}
	});
	
	app.post('/home', function(req, res){
		if (req.session.user == null){
			res.redirect('/');
		}	else{
			AM.updateAccount({
				id		: req.session.user._id,
				name	: req.body['name'],
				email	: req.body['email'],
				pass	: req.body['pass'],
				country	: req.body['country'],
				faceCollect : req.body['faceCollect']
			}, function(e, o){
				if (e){
					res.status(400).send('error-updating-account');
				}	else{
					req.session.user = o.value;
					res.status(200).send('ok');
				}
			});
		}
	});

/* 
	Clear calibration
*/
	app.post('/clearCalibration', function(req, res) {
		AM.clearRegressionData(
			req.session.user.user,
			(e, o) => {
				if (e){
					res.status(400).send(e);
				} else {
					res.status(200).send('ok');
				}
		});
	});

/*
	new accounts
*/

	app.get('/signup', function(req, res) {
		res.render('signup', {  title: 'Signup', countries : CT });
	});
	
	app.post('/signup', function(req, res){
		AM.addNewAccount({
			name 	: req.body['name'],
			email 	: req.body['email'],
			user 	: req.body['user'],
			pass	: req.body['pass'],
			country : req.body['country'],
			faceCollect : req.body['faceCollect']
		}, function(e){
			if (e){
				res.status(400).send(e);
			}	else{
				res.status(200).send('ok');
			}
		});
	});

/*
	password reset
*/

	app.post('/lost-password', function(req, res){
		let email = req.body['email'];
		AM.generatePasswordKey(email, req.ip, function(e, account){
			if (e){
				res.status(400).send(e);
			}	else{
				EM.dispatchResetPasswordLink(account, function(e, m){
			// TODO this callback takes a moment to return, add a loader to give user feedback //
					if (!e){
						res.status(200).send('ok');
					}	else{
						for (k in e) console.log('ERROR : ', k, e[k]);
						res.status(400).send('unable to dispatch password reset');
					}
				});
			}
		});
	});

	app.get('/reset-password', function(req, res) {
		AM.validatePasswordKey(req.query['key'], req.ip, function(e, o){
			if (e || o == null){
				res.redirect('/');
			} else{
				req.session.passKey = req.query['key'];
				res.render('reset', { title : 'Reset Password' });
			}
		})
	});
	
	app.post('/reset-password', function(req, res) {
		let newPass = req.body['pass'];
		let passKey = req.session.passKey;
	// destory the session immediately after retrieving the stored passkey //
		req.session.destroy();
		AM.updatePassword(passKey, newPass, function(e, o){
			if (o){
				res.status(200).send('ok');
			}	else{
				res.status(400).send('unable to update password');
			}
		})
	});
	
/*
	view, delete & reset accounts
*/
	
	app.get('/print', function(req, res) {
		AM.getAllRecords( function(e, accounts){
			res.render('print', { title : 'Account List', accts : accounts });
		})
	});
	
	app.post('/delete', function(req, res){
		AM.deleteAccount(req.session.user._id, function(e, obj){
			if (!e){
				res.clearCookie('login');
				req.session.destroy(function(e){ res.status(200).send('ok'); });
			}	else{
				res.status(400).send('record not found');
			}
		});
	});
	
	app.get('/reset', function(req, res) {
		AM.deleteAllAccounts(function(){
			res.redirect('/print');
		});
	});
	
	/*
		Calibration
	*/

	app.get('/calibration', async (req, res) => {
		if(!req.session.user){ // If not logged in
			res.redirect('/');
		} else{
			try {
				const user = await AM.findAccount(req.session.user._id, (err, object) => { // Enforces the use of the newest version of the user object
					if(!object) {
						return;
					}
					req.session.user = object;
					res.render('calibration',
						{
							name: req.session.user.name,
							user: req.session.user.user,
							regressionData: req.session.user.regressionData,
							faceCollect: false
						}
					);
				});
			} catch (e) {
				console.error(e);
				res.render('calibration');
			}
		}
	});


	/*
		Data Collection
	*/

	app.get('/dataCollection', async (req, res) => {
		if(!req.session.user){ // If not logged in
			res.redirect('/');
		} else{
			try {
				const user = await AM.findAccount(req.session.user._id, (err, object) => { // Enforces the use of the newest version of the user object
					if(!object) {
						return;
					}
					req.session.user = object;
					res.render('dataCollection',
						{
							name: req.session.user.name,
							user: req.session.user.user,
							regressionData: req.session.user.regressionData,
							faceCollect: req.session.user.faceCollect
						}
					);
				});
			} catch (e) {
				console.error(e);
				res.render('dataCollection',
					{
						name: "error",
						user: "error",
						regressionData: req.session.user.regressionData,
						faceCollect: req.session.user.faceCollect
					}
				);
			}
		}
	});

	/*
		Introduction
	*/

	app.get('/introduction', function(req, res) {
		if(!req.session.user){ // If not logged in
			attemptAutoLogin(req, res, "/introduction");
		} else{
			res.render('introduction', {title: 'introduction', name: req.session.user.name});
		}
	});

	/*
		Introduction
	*/

	app.get('/cameraSetup', function(req, res) {
		if(!req.session.user){ // If not logged in
			attemptAutoLogin(req, res, "/cameraSetup");
		} else{
			res.render('cameraSetup', {title: 'cameraSetup'});
		}
	});

	/*
		404 page
	*/

	app.get('*', function(req, res) {
		res.redirect('/'); // Redirect to login if page does not exist
	});

	/*
		Write userdata
	*/
	const appendToLog = (filePath, data) => { // Move to util file?
		var writeStream = fs.createWriteStream(`./logs/${filePath}/gazeLog.csv`, {flags:'a'});
		writeStream.write(data);
		writeStream.on('error', function (err) {
			console.log(err);
		});
		writeStream.end()
	}
	const writeSurveyAnswers = (filePath, data) => { // Move to util file?
		var writeStream = fs.createWriteStream(`./logs/${filePath}/surveyAnswers.json`);
		writeStream.write(data);
		writeStream.on('error', function (err) {
			console.log(err);
		});
		writeStream.end()
	}
	const writeImage = (filePath, data, timestamp) => { // Move to util file?
		var writeStream = fs.createWriteStream(`./logs/${filePath}/faces/${timestamp}.png`, {encoding: 'base64'});
		writeStream.write(data);
		writeStream.on('error', function (err) {
			console.log(err);
		});
		writeStream.end();
	}
	const createDirectory = (dir) => { // Move to util file?
		try {
			fs.statSync(dir);
		} catch(e) {
			fs.mkdirSync(dir);
		}
	  }

	wss.on('connection', ws => {
		console.log("new connection");
		ws.on('message', packet => {
			data = JSON.parse(packet);
			switch(data.command) {
				case "append":
					appendToLog(data.logPath, data.data);
					break;
				case "image":
					writeImage(data.logPath, data.data, data.timestamp);
					break;
				case "open":
					createDirectory(`./logs/${data.name}`);
					createDirectory(`./logs/${data.name}/${data.timestamp}`);
					createDirectory(`./logs/${data.name}/${data.timestamp}/faces`);
					break;
				case "storeSurvey":
					writeSurveyAnswers(data.logPath, data.data);
					break;
				case "storeRegression":
					AM.updateRegressionData(
						data.user,
						data.data,
						(e, o) => {
							if (e){
								console.log(`Error: store regression data. User: ${o.value.user} \n ${e}`);
							} else {
								console.log(`Success: store regression data. User:${o.value.user}`);
							}
					});
					break;
			}
		})
	})

};
