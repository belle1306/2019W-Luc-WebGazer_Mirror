const BannerController = function() {
	this.init.apply(this, arguments);
};
BannerController.prototype = {
	init : () => {
		const attemptLogout = () => {
			var that = this;
			$.ajax({
				url: '/logout',
				type: 'POST',
				data: {logout : true},
				success: function(data){
					bannerController.showAlert('Success!', 'You are now logged out.<br>Redirecting you back to the homepage.', "/");
				},
				error: function(jqXHR){
					console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
				}
			});
		};
		const clearCalibration = () => {
			var that = this;
			$.ajax({
				url: '/clearCalibration',
				type: 'POST',
				success: function(data){
					bannerController.showAlert('Success!', 'Calibration data has been deleted');
				},
				error: function(jqXHR){
					console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
				}
			});
		};
		const openEditAccount = () => {
			window.location.href = '/home';
		};
		const openCameraOptions = () => {
			window.location.href = '/cameraSetup';
		};
		// handle camera options //
		$('#btn-camera').click(openCameraOptions);
		// handle clear data //
		$('#btn-clear').click(clearCalibration);
		// handle user logout //
		$('#btn-logout').click(attemptLogout);
		// handle edit account //
		$('#btn-edit').click(openEditAccount);
	},
	showAlert : (title, msg, href, onclick) => {
		$('.modal-alert').modal({ show : false, keyboard : false, backdrop : 'static' });
		$('.modal-alert .modal-header h4').text(title);
		$('.modal-alert .modal-body p').html(msg);
		$('.modal-alert').modal('show');
		if(onclick) {
			$('.modal-alert button').click(function(){onclick();})
		}
		else if(href) {
			$('.modal-alert button').click(function(){window.location.href = href;})
			setTimeout(function(){window.location.href = href;}, 3000);
		} else {
			$('.modal-alert button').click(() => $('.modal-alert').modal('hide'));
		}
	}
};

const bannerController = new BannerController();