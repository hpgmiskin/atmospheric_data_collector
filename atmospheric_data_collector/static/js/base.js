// base

$(document).ready(function() {
  $('[data-toggle=offcanvas]').click(function() {
    $('.row-offcanvas').toggleClass('active');
  });
});


function post(path,parameter) {

	var element = document.getElementById("postField");
	//alert(parameter);
	element.setAttribute("value",parameter);

	var form = document.getElementById("postForm");
	form.setAttribute("action",path);

	form.submit();

}