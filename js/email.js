function check() {
    var name = document.getElementById('name').value;
    var companyName = document.getElementById('companyname').value;
    var email = document.getElementById('email').value;
    var phone = document.getElementById('phone').value;
    var choose = document.getElementById('choose').value;
    var touring = document.getElementById('touring').checked;
    var liveevent = document.getElementById('live-event').checked;
    var corporate = document.getElementById('corporate').checked;
    var studio = document.getElementById('studio').checked;
    var videopro = document.getElementById('video-pro').checked;
    var other = document.getElementById('other').checked;

    if(name==false) {
        alert('Your Name is Required');
        return false;
    } else if(companyName==false) {
        alert('Your Company Name is Required');
        return false;
    } else if(email==false) {
        alert('Your Email is Required');
        return false;
    } else if(phone==false) {
        alert('Your Phone is Required');
        return false;
    } else if(choose==false) {
        alert('Please Choose One');
        return false;
    } else if(touring==false && liveevent==false && corporate==false && studio==false && videopro==false && other==false) {
        alert('Please One Type Of Business Need to be Check');
        return false;
    } else {
        send(event);
    }
}

var touring; 
var liveEvent; 
var corporate; 
var studio;
var videoPro;
var other;

function send(event) {
    if(document.getElementById('touring').checked){
        touring = "Touring----";
    }
    else {
        touring = "";
    }
    if(document.getElementById('live-event').checked){
        liveEvent = "LiveEvent----";
    }
    else {
        liveEvent = "";
    }
    if(document.getElementById('corporate').checked){
        corporate = "Corporate----";
    }
    else {
        corporate = "";
    }
    if(document.getElementById('studio').checked){
        studio = "Studio----";
    }
    else {
        studio = "";
    }
    if(document.getElementById('video-pro').checked){
        videoPro = "VideoPro----";
    }
    else {
        videoPro = "";
    }
    if(document.getElementById('other').checked){
        other = "Other----";
    }
    else {
        other = "";
    }
    event.preventDefault();
    Email.send({
        name:document.getElementById('name').value,
        // SecureToken : "14b14874-42eb-4126-9715-253ac1a1daf0",
        SecureToken : "14b14874-42eb-4126-9715-253ac1a1daf0",
        To : 'jjfcode@gmail.com',
        From : document.getElementById('email').value,
        Subject : 'Request a Quote',
        Body : "<h3 style='display:inline;'>Name: </h3>" + document.getElementById('name').value + 
        "<br><h3 style='display:inline;'>Company Name: </h3>" + document.getElementById('companyname').value + 
        "<br><h3 style='display:inline;'>Email: </h3>" + document.getElementById('email').value + 
        "<br> <h3 style='display:inline;'>Phone: </h3>" + document.getElementById('phone').value + 
        "<br> <h3 style='display:inline;'>Choose: </h3>" + document.getElementById('choose').value +
        "<br> <h3 style='display:inline;'>Type Of Business: </h3>" + touring + liveEvent  + corporate  + studio +  videoPro  + other +
        "<br><h3 style='display:inline;'>Message: </h3>" + document.getElementById('details').value +
        "<br><h3 style='display:inline;'>Message: </h3>" + document.getElementById('comments').value,
        }).then(function(response){
            if (response == 'OK') {
                alert("Mail sent succesfully");
                window.location.href="index.html";
            } else {
                throw new Error("Error: " + response.statusText);
            }
        });
}

