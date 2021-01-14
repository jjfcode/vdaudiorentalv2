function check() {
    var touring = document.getElementById('touring').checked;
    var liveevent = document.getElementById('live-event').checked;
    var corporate = document.getElementById('corporate').checked;
    var studio = document.getElementById('studio').checked;
    var videopro = document.getElementById('video-pro').checked;
    var other = document.getElementById('other').checked;

    if(touring==false && liveevent==false && corporate==false && studio==false && videopro==false && other==false) {
        alert('Please One Type Of Business Need to be Check');
        return false;
    }
    else{
        return true;
    }
}

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
        "<br> <h3 style='display:inline;'>Type Of Business: </h3>" + document.getElementById('touring').value +
        "----" + document.getElementById('live-event').value + "----" + document.getElementById('corporate').value +
        "----" + document.getElementById('studio').value + "----" + document.getElementById('video-pro').value +
        "----" + document.getElementById('other').value +
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

