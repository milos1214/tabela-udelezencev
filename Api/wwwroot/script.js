const Api = "http://localhost:5289/api/osebe";

function osveziPodatke() {

    $.ajax({
        url: Api,
        type: "GET",
        success: function(data) {
            let lokalniPodatki = JSON.parse(localStorage.getItem('osebe')) || [];
            
            let kombiniraniPodatki = [...data.seznam, ...lokalniPodatki];

            $("#data-table tr:gt(0)").remove();

            kombiniraniPodatki.forEach(p => {
                $("#data-table").append(`<tr><td>${p.id}</td><td>${p.ime}</td><td>${p.priimek}</td><td>${p.starost}</td><td>${p.naziv}</td><td>${p.raven}</td></tr>`);
            });
        },
        error: function(xhr, status, error) {
            console.error("Error loading data:", status, error);
        }
    });

    $("#id").val("");
    $("#ime").val("");
    $("#priimek").val("");
    $("#starost").val("");
}

function dodajLokalno(event) {
    event.preventDefault();

    let id = $("#id").val();
    let ime = $("#ime").val();
    let priimek = $("#priimek").val();
    let starost = $("#starost").val();
    let naziv = $('#naziv').val();
    let raven = $('#raven').val();
    
    if (!id || !ime || !priimek || !starost || !naziv || !raven) {
        alert("Vsa polja so obvezna! Prosimo, izpolnite vse.");
        return;
    }

    if (starost < 18 || starost > 100) {
        alert("Starost mora biti med 18 in 100 let.");
        return;
    }

    let lokalniPodatki = JSON.parse(localStorage.getItem('osebe')) || [];

    let novaOseba = { id: id, ime: ime, priimek: priimek, starost: parseInt(starost), naziv: naziv, raven: raven };
    
    lokalniPodatki.push(novaOseba);
    localStorage.setItem('osebe', JSON.stringify(lokalniPodatki));

    $("#data-table").append(`<tr><td>${id}</td><td>${ime}</td><td>${priimek}</td><td>${starost}</td><td>${naziv}</td><td>${raven}</td></tr>`);

    $("#id").val("");
    $("#ime").val("");
    $("#priimek").val("");
    $("#starost").val("");
}

function dodajNaStreznik(event) {
    event.preventDefault();

    let oseba = { ID: $("#id").val(), Ime: $("#ime").val(), Priimek: $("#priimek").val(), Starost: parseInt($("#starost").val()), Naziv: $("#naziv").val(), Raven: $("#raven").val() };
    $.ajax({
        url: Api,
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(oseba),
        success: function() { osveziPodatke(); },
        error: function(status, error) {
            console.error("Napaka pri pošiljanju podatkov:", status, error);
        }
    });
}

function obrisiLokalno(event) {
    event.preventDefault();
    localStorage.clear();
    osveziPodatke();
}

$(document).ready(osveziPodatke);