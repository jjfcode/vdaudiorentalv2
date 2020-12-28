// Object para que funcione hay que ponerlo adentro de la funcion send, y se llama "emailMessage.fullEmail()"

// var emailMessage = {
//     name: document.getElementById('name').value,
//     companyName: document.getElementById('companyname').value,
//     email: document.getElementById('email').value,
//     phone: document.getElementById('phone').value,
//     message: document.getElementById('message').value,
//     fullEmail : function() {
//         return this.name + " " + this.companyName + " " + this.email + " " + this.phone + " " + this.message;
//     }
// }

function send(event) {
    event.preventDefault();
    Email.send({
        name:document.getElementById('name').value,
        // SecureToken : "14b14874-42eb-4126-9715-253ac1a1daf0",
        SecureToken : "14b14874-42eb-4126-9715-253ac1a1daf0",
        To : 'jjfcode@gmail.com',
        From : document.getElementById('email').value,
        Subject : document.getElementById('subject').value,
        Body : "<h3 style='display:inline;'>Name: </h3>" + document.getElementById('name').value + 
        "<br><h3 style='display:inline;'>Company Name: </h3>" + document.getElementById('companyname').value + 
        "<br><h3 style='display:inline;'>Email: </h3>" + document.getElementById('email').value + 
        "<br> <h3 style='display:inline;'>Phone: </h3>" + document.getElementById('phone').value + 
        "<br><h3 style='display:inline;'>Message: </h3>" + document.getElementById('message').value,
        //El body toma como mensaje codigo html, Asi que todo lo que viene antes de la coma es lo que va aparecer en el mensaje del email
        //Usando js comun, podemos agregar html en formato de un string, seguido por lo que ingreso el usuario en el formulario
        }).then(function(response){
            if (response == 'OK') {
                alert("Mail sent succesfully");
                window.location.href="index.html";
            } else {
                throw new Error("Error: " + response.statusText);
            }
        });
}

