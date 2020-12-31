const form = document.getElementById('form');
const fullname = document.getElementById('fullname');
const email = document.getElementById('email');

form.addEventListener('submit', e => {
	e.preventDefault();
	
	checkInputs();
});

function checkInputs() {
	// trim to remove the whitespaces
	const fullnameValue = fullname.value.trim();
	const emailValue = email.value.trim();
	
	if(fullnameValue === '') {
		setErrorFor(fullname, 'Fullname cannot be blank');
	} else {
		setSuccessFor(fullname);
	}
	
	if(emailValue === '') {
		setErrorFor(email, 'Email cannot be blank');
	} else if (!isEmail(emailValue)) {
		setErrorFor(email, 'Not a valid email');
	} else {
		setSuccessFor(email);
	}
}

function setErrorFor(input, message) {
	const formControl = input.parentElement;
	const small = formControl.querySelector('small');
	formControl.className = 'form-control error';
	small.innerText = message;
}

function setSuccessFor(input) {
	const formControl = input.parentElement;
	formControl.className = 'form-control success';
}
	
function isEmail(email) {
	return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
}


// function validateForm() {
//     var fullname = document.forms["myForm"]["fullname"].value;
//     // var lastname = document.forms["myForm"]["lastname"].value;
//     // var phone = document.forms["myForm"]["phone"].value;
//     var email = document.forms["myForm"]["email"].value;
//     if (fullname != '' && email != '') {
//         Swal.fire({
//         position: 'top-end',
//         icon: 'success',
//         title: 'Form Send Thank You!!!',
//         timer:3000,
//         showConfirmButton: false, 
//         });

//         setTimeout( function() {document.location.href='index.html' } ,1500 );
        
//     }else{
//         Swal.fire({
//         title: 'Field Empty!!!',
//         text: 'Please check the missing field!!',
//         icon: 'warning',
//         button: 'OK',
//         });
//         return false;
//     };
    
// }