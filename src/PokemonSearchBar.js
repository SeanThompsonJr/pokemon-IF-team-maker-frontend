import React, { useState, useEffect } from "react";
import useFetchUser from "./connectBack";
import { usePokemon } from "./PokemonContext";
import pokemonInfiniteFusion from "./pokemonID";
export default function PokemonSearch({ name }) {
  //!user and pokemon searching
  const { user, error, isLoading } = useFetchUser(name);
  //the names of the mons
  const [firstMon, setFirstMon] = useState("");
  const [secondMon, setSecondMon] = useState("");
  //the data we fetch from them
  const [firstMonData, setFirstMonData] = useState(null);
  const [secondMonData, setSecondMonData] = useState(null);
  //? for savinging pokemon
  const [img, setImg] = useState("imageUrl");
  const [pokemonName, setPokemonName] = useState("");
  const [pokemonType, setPokemonType] = useState("");
  //for search bar
  const [isFocused, setIsFocused] = useState(false);

  //!add later
  // const [fault, setFault] = useState("");
  const { addPokemon } = usePokemon();
  //sets the data of first and second mon
  useEffect(() => {
    if (user && user.oneTrainer && user.oneTrainer.length > 0) {
      setFirstMon(user.oneTrainer[0].firstMon || "");
      setSecondMon(user.oneTrainer[0].secondMon || "");
    }
    console.log(user);
  }, [user]);
  //sets the data of imageurl as default for input below by setImg
  useEffect(() => {
    // console.log("firstMonData:", firstMonData); // Debug log
    // console.log("secondMonData:", secondMonData); // Debug log

    const imageUrl =
      firstMonData && firstMonData.name && secondMonData && secondMonData.name
        ? `https://ifd-spaces.sfo2.cdn.digitaloceanspaces.com/sprites/custom/${
            pokemonInfiniteFusion[firstMonData.name]
          }.${pokemonInfiniteFusion[secondMonData.name]}.png`
        : null;
    //the fall back image if the mon is in generated instead of custom
    const fallbackImageUrl = `https://ifd-spaces.sfo2.cdn.digitaloceanspaces.com/sprites/generated/${
      firstMonData && firstMonData.name
        ? pokemonInfiniteFusion[firstMonData.name]
        : "default"
    }.${
      secondMonData && secondMonData.name
        ? pokemonInfiniteFusion[secondMonData.name]
        : "default"
    }.png`;

    setImg(imageUrl || fallbackImageUrl); // Update state with imageUrl

    const currentMonType =
      firstMonData && secondMonData ? firstMonData.types[0].type.name : "";
    setPokemonType(currentMonType);
  }, [firstMonData, secondMonData]);

  const handleFirstMonChange = (e) => setFirstMon(e.target.value);
  const handleSecondMonChange = (e) => setSecondMon(e.target.value);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  // Fetches the Pokémon data from the PokeAPI
  const fetchPokemonData = async (pokemonName, setData) => {
    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error("Failed to fetch Pokemon data:", error);
    }
  };

  // Handles when the search button is pressed
  const handleSearch = () => {
    fetchPokemonData(firstMon, setFirstMonData);
    fetchPokemonData(secondMon, setSecondMonData);
  };

  //! saving pokemon to database
  //! i basically want this whole function to the header
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!pokemonName) {
      alert("enter groupname before submitting");
      return;
    }
    const saveMon = {
      img: img,
      pokemonName: pokemonName,
      pokemonType: pokemonType,
      //!add later
      //fault: fault,
    };
    addPokemon(saveMon);
    //! this adds pokemon to the user
    try {
      // await user.save();
      //saving pokemon to db
      const response = await fetch(
        process.env.REACT_APP_API_BASE_URL + "/api/trainers/pokemon/" + name,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(saveMon),
        }
      );
      if (response.ok) {
        console.log("pokemon added successfully");
      } else {
        console.log("Error adding pokemon", response.statusText);
      }
    } catch (error) {
      console.error("Error adding pokemon: ", error);
    }
    window.location.reload(true);
  };

  //copy of the fallback image for the js
  const handleError = () => {
    const fallbackImageUrl = `https://ifd-spaces.sfo2.cdn.digitaloceanspaces.com/sprites/generated/${
      firstMonData && firstMonData.name
        ? pokemonInfiniteFusion[firstMonData.name]
        : "default"
    }.${
      secondMonData && secondMonData.name
        ? pokemonInfiniteFusion[secondMonData.name]
        : "default"
    }.png`;
    setImg(fallbackImageUrl);
  };

  //|forgot what this is for
  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };
  return (
    <div className="pokemon-search-bar">
      {}
      <h1>Pokemon Search</h1>

      <input //! working here
        id="firstMon"
        placeholder="Enter Head Mon"
        value={firstMon}
        onChange={handleFirstMonChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="mon-input"
      />
      {/* {!isFocused && (
        <div className="suggestion-box">
          {Object.entries(pokemonInfiniteFusion).map(([key, value]) => (
            <ul key={key}>
              <li>{key}</li>
            </ul>
          ))}
        </div>
      )} */}
      <input
        id="secondMon"
        placeholder="Enter body Mon"
        value={secondMon}
        onChange={handleSecondMonChange}
        className="mon-input"
      />
      <button type="button" onClick={handleSearch} className="search-btn">
        Search
      </button>
      {firstMonData && secondMonData && (
        <div>
          <h3>{firstMonData.name}</h3>
          <h3>{secondMonData.name}</h3>
          <img
            className="pokemon-current-search"
            src={img}
            onError={handleError}
            alt={`${firstMonData.name} and ${secondMonData.name}`}
          />
          <form onSubmit={handleSubmit} className="mon-submit-form">
            <label>what is the group naming of this pokemon?</label>
            {/* <input
              type="text"
              placeholder="pokemonimg"
              value={img} //setImg(e.target.value)
              onChange={(e) => setImg(e.target.value)}
              disabled
            ></input> */}
            <input
              type="text"
              placeholder="groupName"
              value={pokemonName}
              onChange={(e) => setPokemonName(e.target.value)}
              required
              className="mon-group-name"
            ></input>
            {/* <input
              type="text"
              placeholder="pokemonType"
              value={pokemonType}
              onChange={(e) => setPokemonType(e.target.value)}
              disabled
            ></input> */}

            <button type="submit" onClick={handleSubmit} className="submit-btn">
              submit to party
            </button>
          </form>

          {/* <button>submit to box</button>*/}
          {/* <p>this is imageurl {img}</p> */}
        </div>
      )}
    </div>
  );
}
