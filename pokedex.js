const pokemonCount = 300;
var pokedex = {}; // {1 : {"name" : "bulbasaur", "img" : url, "type" : ["grass", "poison"], "desc" : "....", "height": "....", "weight": "...."} }
const pokemonList = []; // Store names for search suggestions

window.onload = async function() {
    for (let i = 1; i <= pokemonCount; i++) {
        await getPokemon(i);
        let pokemon = document.createElement("div");
        pokemon.id = i;
        pokemon.innerText = i.toString() + ". " + pokedex[i]["name"].toUpperCase();
        pokemon.classList.add("pokemon-name");
        pokemon.addEventListener("click", updatePokemon);
        document.getElementById("pokemon-list").append(pokemon);
        pokemonList.push(pokedex[i]["name"].toLowerCase()); // Add names for suggestions in lowercase
    }

    // Set the first Pokémon as default
    updatePokemon.call(document.getElementById(1));
}

async function getPokemon(num) {
    let url = "https://pokeapi.co/api/v2/pokemon/" + num.toString();

    let res = await fetch(url);
    let pokemon = await res.json();

    let pokemonName = pokemon["name"];
    let pokemonType = pokemon["types"];
    
    // Use a higher resolution image
    let pokemonImg = pokemon["sprites"]["other"]["official-artwork"]["front_default"];

    res = await fetch(pokemon["species"]["url"]);
    let pokemonDesc = await res.json();

    pokemonDesc = pokemonDesc["flavor_text_entries"][9]["flavor_text"];

    // Get height and weight
    let height = pokemon["height"] / 10; // Convert to meters
    let weight = pokemon["weight"] / 10; // Convert to kilograms

    pokedex[num] = {
        "name": pokemonName,
        "img": pokemonImg,
        "types": pokemonType,
        "desc": pokemonDesc,
        "height": height,
        "weight": weight
    };
}

function updatePokemon() {
    document.getElementById("pokemon-img").src = pokedex[this.id]["img"];

    // Clear previous type
    let typesDiv = document.getElementById("pokemon-types");
    typesDiv.innerHTML = ''; // Clear previous types

    // Update types
    let types = pokedex[this.id]["types"];
    for (let i = 0; i < types.length; i++) {
        let type = document.createElement("span");
        type.innerText = types[i]["type"]["name"].toUpperCase();
        type.classList.add("type"); // Change class to type for proper styling
        type.classList.add(types[i]["type"]["name"]); // Adds background color and font color
        typesDiv.append(type);
    }

    // Update description
    document.getElementById("pokemon-description").innerText = pokedex[this.id]["desc"];
    
    // Update height and weight
    document.getElementById("pokemon-height").innerText = "Height: " + pokedex[this.id]["height"] + " m";
    document.getElementById("pokemon-weight").innerText = "Weight: " + pokedex[this.id]["weight"] + " kg";
}

function filterPokemon() {
    const input = document.getElementById("search").value.toLowerCase();
    const suggestions = document.getElementById("suggestions");
    suggestions.innerHTML = ""; // Clear previous suggestions

    if (input.length >= 2) {
        const filteredNames = pokemonList.filter(name => name.startsWith(input));
        filteredNames.forEach(name => {
            const suggestion = document.createElement("div");
            suggestion.classList.add("suggestion");
            suggestion.innerText = name.charAt(0).toUpperCase() + name.slice(1); // Capitalize the first letter
            suggestion.addEventListener("click", function() {
                const index = pokemonList.indexOf(name);
                if (index !== -1) {
                    updatePokemon.call(document.getElementById(index + 1));
                }
                suggestions.innerHTML = ""; // Clear suggestions
            });
            suggestions.appendChild(suggestion);
        });
    }
}

const toggleMode = () => {
    const body = document.body;
    const button = document.getElementById("mode-toggle");
    body.classList.toggle("dark");
    button.classList.toggle("dark");

    // Update the icon based on the mode
    if (body.classList.contains("dark")) {
        button.innerHTML = '<i class="fas fa-moon"></i>'; // Change to moon icon for dark mode
    } else {
        button.innerHTML = '<i class="fas fa-sun"></i>'; // Change to sun icon for light mode
    }
};

document.getElementById("mode-toggle").addEventListener("click", toggleMode);
