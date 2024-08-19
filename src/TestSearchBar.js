import React, { useState, useEffect } from "react";

const PokemonSearchBar = () => {
  const [trainerPartyMembers, setTrainerPartyMembers] = useState([]);

  // Fetch initial data
  useEffect(() => {
    fetch("/api/pokemon") // Replace with your API endpoint
      .then((response) => response.json())
      .then((data) => setTrainerPartyMembers(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // Function to add a new Pokémon
  const addPokemon = (newPokemon) => {
    setTrainerPartyMembers((prevMembers) => [...prevMembers, newPokemon]);
  };

  // Example function to handle adding a Pokémon (replace with your actual logic)
  const handleAddPokemon = () => {
    const newPokemon = {
      _id: "new-id",
      img: "new-img-url",
      pokemonName: "New Pokémon",
      pokemonType: "New Type",
    };
    addPokemon(newPokemon);
  };

  return (
    <div>
      <button onClick={handleAddPokemon}>Add Pokémon</button>
      <div className="pokemonMember">
        {trainerPartyMembers.map((member) => (
          <div key={member._id}>
            <p>{member._id}</p>
            <img
              src={member.img}
              className="pokeImg"
              alt={`img of ${member.img}`}
            />
            <p>{member.pokemonName}</p>
            <p>{member.pokemonType}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PokemonSearchBar;
