var Person = new Object();
Person.name = undefined;
Person.surname = undefined;
Person.phoneNumber = undefined;
Person.actDate = undefined;
Person.contactDate = undefined;
Person.symptomsDate = undefined;
Person.testDate = undefined;
Person.statagreement = false;
Person.isInfected = false;
Person.isolateToDate = undefined;
const daysToWaitToGetTestResults = 1;
const daysOfQuarantine = 10;
const daysOfIncubation = 10;

var ReggexExpNameSurname = new RegExp(/^[A-Za-z]{3,10}$/);
var ReggexExpPhoneNumber = new RegExp(/^[0-9\-\+]{9,13}$/);

/*
    Napisać funkcje ustalajaca zakresy dla dat
    Napisać warunki sprawdzajace czy istniej epotrzeba kwarantanny,czy jest zakazony 
*/


window.addEventListener('DOMContentLoaded',(event) =>{
    // pobranie dzisiejszej daty i ustawienie zakresów
    document.getElementById("todaysdate").value = new Date().toISOString().slice(0, 10);
    var data = document.getElementById("todaysdate").value
    Person.actDate = data;
    console.log("Aktualna data "+Person.actDate);
    document.getElementById("todaysdate").setAttribute("min",data);
    document.getElementById("todaysdate").setAttribute("max",data);

    // zakresy dla dat testu
    document.getElementById("testdate").setAttribute("min",Person.actDate);

    // zakresy dla dat kontaktu
    var minRangeContactDate = new Date(Person.actDate);
    var maxRangeContactDate = new Date(Person.actDate);
    minRangeContactDate.setTime(minRangeContactDate.getTime() - (daysOfIncub    ation * 24 * 60 * 60 * 1000));
    maxRangeContactDate.setTime(maxRangeContactDate.getTime() + (daysOfIncubation * 24 * 60 * 60 * 1000));

    document.getElementById("contactdate").setAttribute("min",minRangeContactDate.toISOString().slice(0, 10));
    document.getElementById("contactdate").setAttribute("max",maxRangeContactDate.toISOString().slice(0, 10));
});

//sprawdz poprawnosc imie,nazwisko,nr.telefonu
function reggexName(){
    var str = document.getElementById("name");
    var inf = document.getElementById("nameInf");
    if(str.value.length < 3) {
        str.style.backgroundColor = "white";
        inf.innerHTML = "";

    }else
    if(ReggexExpNameSurname.test(str.value)){
     str.style.backgroundColor = "green";
     inf.innerHTML = "jest ok";
     Person.name = str.value;
     //console.log("Person.name:" + Person.name);
    }
    else{
     str.style.backgroundColor = "red";
     inf.innerHTML = "jest zle";
     Person.name = "";
    }
    str.onblur = function(){
        console.log("Person.name " + Person.name);

    }
}
function reggexSurname(){
    var str = document.getElementById("surname");
    var inf = document.getElementById("surnameInf");
    if(str.value.length < 3) {
        inf.innerHTML = "";
        str.style.backgroundColor = "white";
    }else
    if(ReggexExpNameSurname.test(str.value)){
     str.style.backgroundColor = "green";
     inf.innerHTML = "jest ok";
     Person.surname = str.value;
    }
    else{
     str.style.backgroundColor = "red";
     inf.innerHTML = "jest zle";
     Person.name = "";
    }
    str.onblur = function(){
        console.log("Person.surname " + Person.surname);

    }
}
function reggexPhoneNumber(){
    var str = document.getElementById("number");
    var inf = document.getElementById("phoneNumberInf");
    if(str.value.length < 3) {
        str.style.backgroundColor = "white";
        inf.innerHTML = "";
    }else
    if(ReggexExpPhoneNumber.test(str.value)){
     str.style.backgroundColor = "green";
     inf.innerHTML = "jest ok";
     Person.phoneNumber = str.value;
    }
    else{
     str.style.backgroundColor = "red";
     inf.innerHTML = "jest zle";
     Person.phoneNumber = "";
    }
    str.onblur = function(){
        console.log("Person.phoneNumber " + Person.phoneNumber);

    }
}

//sprawdz zgode na przetwarzanie danych osobowych
function checkStatAgreement(status){
    if(status.checked){
        Person.statagreement = true;
        document.getElementById("statInf").style.color="lightgreen";
        console.log("Person.statagreement "+Person.statagreement);

    }else{
        Person.statagreement = false;
        document.getElementById("statInf").style.color="red";
        console.log("Person.statagreement "+Person.statagreement);
    }
}

//pobieranie wartosci dat
function getActDate(){
    Person.actDate = document.getElementById("todaysdate").value;
    document.getElementById("contactdate").setAttribute("min",Person.actDate);
    console.log("Aktualna data "+Person.actDate);
}
function getContactDate(){
    Person.contactDate = document.getElementById("contactdate").value;
    console.log("Data kontaktu "+Person.contactDate);

}
function getSymptomDate(){
    Person.symptomsDate = document.getElementById("symptomsdate").value;
    console.log("Data objawów "+Person.symptomsDate);


}
function getTestDate(){
    Person.testDate = document.getElementById("testdate").value;
    console.log("Data testu "+Person.testDate);

}

function isInfectedPerson(){
    //dzisiejsza data + 10 dni do przodu (czas inkubacji)
    var incDays = new Date(Person.actDate);
    incDays.setTime(incDays.getTime() + (daysOfIncubation * 24 * 60 * 60 * 1000));
    incDays.toISOString().slice(0, 10)

    if(Person.symptomsDate >= Person.contactDate && Person.symptomsDate <= incDays)
        {
        Person.isInfected = "Tak";
        //ustawienie daty kwarantanny 
        var date = new Date(Person.testDate);
        date.setTime(date.getTime() + ((daysOfQuarantine + daysToWaitToGetTestResults) * 24 * 60 * 60 * 1000));
        Person.isolateToDate = date.toISOString().slice(0,10);
        }
    else
        {
        Person.isInfected = "Nie";
        Person.isolateToDate = "Brak kwarantanny";
        }
}


function send(){
    if(Person.name !== undefined && Person.surname !== undefined && Person.phoneNumber !== undefined
        && Person.actDate !== undefined && Person.contactDate !== undefined && Person.symptomsDate !== undefined
        && Person.testDate !== undefined && Person.statagreement == true){
        isInfectedPerson();
        window.sessionStorage.setItem("name", Person.name);
        window.sessionStorage.setItem("surname", Person.surname);
        window.sessionStorage.setItem("number", Person.phoneNumber);
        window.sessionStorage.setItem("todayIs", Person.actDate);
        window.sessionStorage.setItem("contactDate", Person.contactDate);
        window.sessionStorage.setItem("symptomsDate", Person.symptomsDate);
        window.sessionStorage.setItem("testDate", Person.testDate);
        window.sessionStorage.setItem("isInfected", Person.isInfected);
        window.sessionStorage.setItem("daysOfIsolation", Person.isolateToDate);
        window.open("result.html");    
    }else{
        alert("Niepoprawnie wypełnione pola");
    }
            
}
   


