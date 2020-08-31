let data = incident_rates

//Calculus for coloring rate_incident
let fleet = data.map(function(d){
    return d.total_fleet;
})

let f_10k = d3.sum(fleet) / 10000

let incidents = data.map(function(d){
    return d.total_incident;
})

let city_incidents = d3.sum(incidents)

let city_rate = parseInt(city_incidents / f_10k)

d3.select("#city").text(city_rate + " incidents per 10k vehicles")

//Create cards with incident rate per county
let counties = d3.select("#card-rates")

function back_image(rate_incident){
    if (rate_incident > city_rate){
        return "static/assets/cityred.jpg"
    } else {
        return "static/assets/citygreen.jpg"
    }
}

function font_color(rate_incident){
    if(rate_incident > city_rate){
        return "color: #ffffff;"
    } else {
        return "color: #000000;"
    }
}

data.forEach( d => {

    let card = counties.append("div")
    .attr("class", "card border-dark mx-3 mb-2")
    .attr("style", "max-width: 18rem;")

    card.append("img")
    .attr("src", back_image(d.rate_incident))
    .attr("class", "card-img")

    let img = card.append("div")
    .attr("class", "card-img-overlay")
    
    img.append("h6")
    .attr("class", "card-title")
    .attr("style", font_color(d.rate_incident))
    .text(d.ID_MUNICIPIO)

    img.append("h5")
    .attr("class", "card-title")
    .attr("style", font_color(d.rate_incident))
    .text(d.rate_incident + " incidents/10k v.")

});


