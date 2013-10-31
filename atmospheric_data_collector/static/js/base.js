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

};


function getObject(jsonString) {
	//returns the object assoicated with the given JSON string

	if ((jsonString.length < 1)||(typeof(jsonString) != "string"))  {
		return [50.935531, -1.396047];
	};

	var sanitisedJASONString = jsonString.replace(/'/g, '"');
	return JSON.parse(sanitisedJASONString);
};