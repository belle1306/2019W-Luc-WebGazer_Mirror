
function HomeController()
{
// bind event listeners to button clicks //
	var that = this;

// confirm account deletion //
	$('#account-form-btn1').click(function(){$('.modal-confirm').modal('show')});

// handle account deletion //
	$('.modal-confirm .submit').click(function(){ that.deleteAccount(); });

	this.deleteAccount = function()
	{
		$('.modal-confirm').modal('hide');
		var that = this;
		$.ajax({
			url: '/delete',
			type: 'POST',
			success: function(data){
	 			bannerController.showAlert('Your account has been deleted', 'Redirecting you back to the homepage.', "/");
			},
			error: function(jqXHR){
				console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
			}
		});
	}
}

HomeController.prototype.onUpdateSuccess = function()
{
	bannerController.showAlert('Success!', 'Your account has been updated. <br> Redirecting you back to the homepage.', "/");
}
