function validateForm() {
    var fullname = document.forms["myForm"]["fullname"].value;
    // var lastname = document.forms["myForm"]["lastname"].value;
    // var phone = document.forms["myForm"]["phone"].value;
    var email = document.forms["myForm"]["email"].value;
    if (fullname != '' && email != '') {
        Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Form Send Thank You!!!',
        timer:3000,
        showConfirmButton: false, 
        });

        setTimeout( function() {document.location.href='index.html' } ,1500 );
        
    }else{
        Swal.fire({
        title: 'Field Empty!!!',
        text: 'Please check the missing field!!',
        icon: 'warning',
        button: 'OK',
        });
        return false;
    };
    
}