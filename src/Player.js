//todo make the trainer stats loop instead of each individual one(make it easier to read)
import React, { useState, useEffect } from "react";
//import LazyLoad from "react-lazyload";
import PokemonSearch from "./PokemonSearchBar.js";
//import TestSearchBar from "./TestSearchBar.js";
import useFetchUser from "./connectBack";
//provides the pokemon two teams
import { PokemonProvider, usePokemon } from "./PokemonContext.js";

// displays all info about the player
export default function Player(prop) {
  const [tabNum, setTabNum] = useState(0);
  const { user, error, isLoading } = useFetchUser(prop.name);

  if (isLoading) return <div>Loading</div>;
  if (error) return <div>Error: {error}</div>;

  // chekcing if the has properties and assining the vars to loading text if not and getting the property from the user if is
  const trainerDeathCounter =
    user && user.oneTrainer && user.oneTrainer.length > 0
      ? user.oneTrainer[0].deathCounter
      : "loading";
  const trainerAliveCounter =
    user && user.oneTrainer && user.oneTrainer.length > 0
      ? user.oneTrainer[0].aliveCounter
      : "loading";
  const trainerMemberCounter =
    user && user.oneTrainer && user.oneTrainer.length > 0
      ? user.oneTrainer[0].membersCaughtCounter
      : "loading";
  //todo fix later
  const updateCounterBackCall = async () => {
    try {
      const response = await fetch(
        "http://localhost:3001/api/trainers/details/" + prop.name,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      //y
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error updating counter:", error);
      throw error;
    }
  };

  const handleClick = async () => {
    try {
      const updatedTrainer = await updateCounterBackCall(prop.name);
      console.log("Updated Trainer:", updatedTrainer);
      // Optionally, update the state or UI with the updated trainer data
    } catch (error) {
      console.error("Failed to update counter:", error);
    }
  };
  //flag function to set which tab the use is on
  function handleTab(num) {
    setTabNum(num);
  }
  return (
    <>
      <div className="tab-container">
        <button onClick={() => handleTab(0)} className="tab">
          current members {tabNum}
        </button>
        <button onClick={() => handleTab(1)} className="tab">
          box members
        </button>
        <button onClick={() => handleTab(2)} className="tab">
          dead members
        </button>
      </div>
      <div className="player">
        <p>{prop.name}</p>
        <p>death counter : {trainerDeathCounter}</p>
        <p>alive counter : {trainerAliveCounter}</p>
        <p>members caught: {trainerMemberCounter}</p>
        {/* <button onClick={handleClick}>increment death & decrement alive</button> */}
        <div>current party</div>
        <PokemonProvider>
          <TeamMember name={prop.name} tabNum={tabNum}></TeamMember>
        </PokemonProvider>
        <CrudSinglePlayer name={prop.name}></CrudSinglePlayer>
      </div>
    </>
  );
}
//displays all the pokemon party members
function TeamMember({ name, tabNum }) {
  const { user } = useFetchUser(name);
  const [trainerPartyMembers, setTrainerPartyMembers] = useState([]);
  const { pokemonList } = usePokemon();
  //0 means current members
  //1 means box members
  //2 means deadmembers
  useEffect(() => {
    if (user && user.oneTrainer && user.oneTrainer.length > 0 && tabNum === 0) {
      setTrainerPartyMembers(user.oneTrainer[0].partyMembers);
    } else if (
      user &&
      user.oneTrainer &&
      user.oneTrainer.length > 0 &&
      tabNum === 1
    ) {
      setTrainerPartyMembers(user.oneTrainer[0].boxMembers);
    } else if (
      user &&
      user.oneTrainer &&
      user.oneTrainer.length > 0 &&
      tabNum === 2
    ) {
      setTrainerPartyMembers(user.oneTrainer[0].deadMembers);
    }
  }, [user, setTrainerPartyMembers, tabNum]);

  // console.log(trainerPartyMembers[0]);

  const getCry = (member) => {
    let memberImg = member.img;
    // Use a regular expression to extract the number between the last '/' and the first '.'
    let match = memberImg.match(/\/(\d+)\./);
    let number = match ? match[1] : null;
    return number;
  };
  const playSound = (member) => {
    const pokeNum = getCry(member);
    const audio = new Audio(
      `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${pokeNum}.ogg`
    );
    // Function to play the audio
    const playAudio = () => {
      audio.play();
      // Remove the event listener after the first interaction
      document.removeEventListener("click", playAudio);
    };

    // Add event listener to the document
    document.addEventListener("click", playAudio);
  };
  const addPokemon = (newPokemon) => {
    setTrainerPartyMembers((prevMembers) => [...prevMembers, newPokemon]);
  };
  //button to move party member to box
  // function moveToParty(member) {

  // }

  //| make this modular later
  //from party to box
  async function moveToBox(member) {
    const singleMon = { ...member };

    try {
      //saving pokemon to db
      const response = await fetch(
        "http://localhost:3001/api/trainers/pokemonbox/" + name,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(singleMon),
        }
      );
      if (response.ok) {
        console.log("pokemon added successfully");

        // Remove the pokemon from the party
        const removeResponse = await fetch(
          "http://localhost:3001/api/trainers/pokemon/" + name,

          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(singleMon),
          }
        );
        if (removeResponse.ok) {
          console.log("pokemon removed from party successfully");
        } else {
          console.log(
            "Error removing pokemon from party",
            removeResponse.statusText
          );
        }
      } else {
        console.log("Error adding pokemon", response.statusText);
      }
    } catch (error) {
      console.error("Error adding pokemon: ", error);
    }
    window.location.reload(true);
  }
  //from party to dead
  async function moveToDead(member) {
    const singleMon = { ...member };

    try {
      //saving pokemon to dead box
      const response = await fetch(
        "http://localhost:3001/api/trainers/pokemondead/" + name,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(singleMon),
        }
      );
      if (response.ok) {
        console.log("pokemon added successfully");

        // Remove the pokemon from the party
        const removeResponse = await fetch(
          "http://localhost:3001/api/trainers/pokemon/" + name,

          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(singleMon),
          }
        );
        if (removeResponse.ok) {
          console.log("pokemon removed from party successfully");
        } else {
          console.log(
            "Error removing pokemon from party",
            removeResponse.statusText
          );
        }
      } else {
        console.log("Error adding pokemon", response.statusText);
      }
    } catch (error) {
      console.error("Error adding pokemon: ", error);
    }
    window.location.reload(true);
  }
  //from box to party
  async function moveToParty(member) {
    const singleMon = { ...member };
    console.log(singleMon);
    try {
      //saving pokemon to party box
      const response = await fetch(
        "http://localhost:3001/api/trainers/pokemon/" + name,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(singleMon),
        }
      );
      if (response.ok) {
        console.log("pokemon added successfully");

        // Remove the pokemon from the party
        const removeResponse = await fetch(
          "http://localhost:3001/api/trainers/pokemonbox/" + name,

          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(singleMon),
          }
        );
        if (removeResponse.ok) {
          console.log("pokemon removed from party successfully");
        } else {
          console.log(
            "Error removing pokemon from party",
            removeResponse.statusText
          );
        }
      } else {
        console.log("Error adding pokemon", response.statusText);
      }
    } catch (error) {
      console.error("Error adding pokemon: ", error);
    }
    window.location.reload(true);
  }
  //from dead to box
  async function moveFromDeadToParty(member) {
    const singleMon = { ...member };
    console.log(singleMon);
    try {
      //saving pokemon to party box
      const response = await fetch(
        "http://localhost:3001/api/trainers/pokemonbox/" + name,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(singleMon),
        }
      );
      if (response.ok) {
        console.log("pokemon added successfully");

        // Remove the pokemon from the party
        const removeResponse = await fetch(
          "http://localhost:3001/api/trainers/pokemondead/" + name,

          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(singleMon),
          }
        );
        if (removeResponse.ok) {
          console.log("pokemon removed from party successfully");
        } else {
          console.log(
            "Error removing pokemon from party",
            removeResponse.statusText
          );
        }
      } else {
        console.log("Error adding pokemon", response.statusText);
      }
    } catch (error) {
      console.error("Error adding pokemon: ", error);
    }
    window.location.reload(true);
  }

  //random num gen
  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }
  return (
    <div className="pokemonMember">
      {trainerPartyMembers.map((member) => (
        <div key={member._id + getRandomInt(123)}>
          {/*console.log(member)*/}
          <p>{getCry(member)}</p>
          <img
            onClick={() => playSound(member)}
            muted
            src={member.img}
            className="pokeImg"
            alt={`img of ${member.img}`}
          ></img>

          {tabNum === 0 && (
            <div>
              <button onClick={() => moveToBox(member)}>add to pc</button>
              <button onClick={() => moveToDead(member)}>dieded</button>
            </div>
          )}
          {tabNum === 1 && (
            <div>
              <button onClick={() => moveToParty(member)}>to party</button>
            </div>
          )}
          {tabNum === 2 && (
            <button onClick={() => moveFromDeadToParty(member)}>
              revive to party
            </button>
          )}

          <p>{member.pokemonName}</p>
          <p>{member.pokemonType}</p>
        </div>
      ))}
    </div>
  );
}

function CrudSinglePlayer(prop) {
  const { user } = useFetchUser(prop.name);
  //set to false when done testing
  const [showAddForm, setShowAddForm] = useState(true);
  const [showHamburger, setShowHamburger] = useState(true);
  function handleHamburger() {
    setShowHamburger(!showHamburger);
  }
  function handleAdd() {
    setShowAddForm(!showAddForm);
  }
  function handleUpdate() {}
  function handleTrash() {}
  return (
    <div>
      <button onClick={handleHamburger}>Show Search</button>
      {/* {showHamburger && (
        // <div className="crud-btn-container">
        //   <button onClick={handleAdd} className="add-btn mon-btn">
        //     add
        //   </button>
        //   <button className="update-btn mon-btn">update</button>
        //   <button className="trash-btn mon-btn">trash</button>
        // </div>
      )} */}
      {showAddForm && showHamburger && (
        <div>
          <div className="show-form">
            {/* <label>single mon:</label>
            <input placeholder="single mon"></input> */}
            <PokemonProvider>
              <PokemonSearch name={prop.name}></PokemonSearch>
            </PokemonProvider>
          </div>
        </div>
      )}
    </div>
  );
}

function CrudMultiplePlayer(prop) {
  const { user } = useFetchUser(prop.name);
  return <div className="crud-multi-box"></div>;
}
// export { CrudMultiplePlayer };

/**
 * function PokemonSearch() {
  //call the pokemon api to get the names anc convert to the ids
  const [firstMon, setFirstMon] = useState("");
  const [secondMon, setSecondMon] = useState("");
  const [firstMonData, setFirstMonData] = useState(null);
  const [secondMonData, setSecondMonData] = useState(null);

  //assigns the input value to firstmondata
  const handleFirstMonChange = (event) => {
    setFirstMon(event.target.value);
  };
  //assigns the input value to secondmondata
  const handleSecondMonChange = (event) => {
    setSecondMon(event.target.value);
  };
  //gets the mons from pokeapi
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
  //handles when search is pressed
  const handleSearch = () => {
    fetchPokemonData(firstMon, setFirstMonData);
    fetchPokemonData(secondMon, setSecondMonData);
  };

  // Construct the image URL dynamically
  const imageUrl =
    firstMonData && secondMonData
      ? `./pokemon/images${firstMonData.id}.${secondMonData.id}.png`
      : "";
  return (
    <>
      <button type="button" onClick={handleSearch}>
        search
      </button>
      <label>fusion mon:</label>
      <input
        id="firstMon"
        placeholder="first mon"
        value={firstMon}
        onChange={handleFirstMonChange}
      ></input>
      <label> and</label>
      <input
        id="secondMon"
        placeholder="second mon"
        value={secondMon}
        onChange={handleSecondMonChange}
      ></input>
      {firstMonData && secondMonData && (
        <div>
          <h3>{firstMonData.id}</h3>
          <h3>{secondMonData.id}</h3>
          <h3>{firstMonData.id + "." + secondMonData.id}</h3>

          <div>image text:{imageUrl}</div>
          <LazyLoad height={200} offset={100}>
            <img src={require("./pokemon/images/1.1.png")} alt="cannot find" />
          </LazyLoad>
        </div>
        // pokemonImages
      )}
    </>
  );
}
 */
