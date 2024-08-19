import React, { createContext, useState, useContext } from "react";

const PokemonContext = createContext();

export const usePokemon = () => useContext(PokemonContext);

export const PokemonProvider = ({ children }) => {
  const [trainerPartyMembers, setTrainerPartyMembers] = useState([]);

  const addPokemon = (newPokemon) => {
    setTrainerPartyMembers((prevMembers) => [...prevMembers, newPokemon]);
  };

  return (
    <PokemonContext.Provider value={{ trainerPartyMembers, addPokemon }}>
      {children}
    </PokemonContext.Provider>
  );
};
