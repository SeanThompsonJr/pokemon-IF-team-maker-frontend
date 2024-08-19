import "./css/App.css";
import "./css/mobile.css";
import Player from "./Player.js";
import { useState, useEffect } from "react";
function App() {
  //sets the loaded player number
  let [loadPlayer, setLoadPlayer] = useState(() => {
    const saved = window.localStorage.getItem("loadPlayerNumber");
    return saved !== null ? JSON.parse(saved) : 0;
  });

  // Save the player number to local storage whenever it changes
  useEffect(() => {
    window.localStorage.setItem("loadPlayerNumber", loadPlayer);
  }, [loadPlayer]);

  //handles incrementing the loadplayer value when button is pressed
  function handleLoadPlayer() {
    setLoadPlayer((prevLoadPlayer) =>
      prevLoadPlayer < 3 ? prevLoadPlayer + 1 : 0
    );
  }
  return (
    <div className="app">
      <button className="load-player-btn" onClick={handleLoadPlayer}>
        test {loadPlayer}
      </button>
      <div className="player-container">
        {
          //if loadplayer is 0 then load all
          loadPlayer === 0 && (
            <>
              <Player name="sean"></Player>
              <Player name="braden"></Player>
              <Player name="gerald"></Player>
            </>
          )
        }
        {/* if loadplayer is x number then load x player */}
        {loadPlayer === 1 && <Player name="sean"></Player>}
        {loadPlayer === 2 && <Player name="braden"></Player>}
        {loadPlayer === 3 && <Player name="gerald"></Player>}
      </div>
      {/* <CrudMultiplePlayer></CrudMultiplePlayer> */}
    </div>
  );
}

//// display the info
////  fix the poke member images
//// save the image url in the database so it can be loaded with the player when added
//// sounds when hover and clicked on mobile
////fix refresh (made the page refresh instead)
//// add a feature to select only one user
//// make it mobile
//problem fixed
//// problem because inf fusions does not have all pokemon
//// stuck on how to reference the pokemon now with an obj
//// make the limit of current party to 6
//// make a dead box and a party box for each user
//// display dead and box box
//// display dead and box pokemon

//// make pokemon movable to party box and deathbox
//// conditionally load the add to pc, dided and party buttons based off of the tab numbers
//// fix render bug

//// make the controller functions for adding and moving mon increment and decrement dead, alive and caught counter

//! todo deploy to railway
// railway video - https://www.youtube.com/watch?v=Fiou_EHUv4c
// other deploying software - https://www.youtube.com/watch?v=MusIvEKjqsc
//todo make it so party members can't have more than two types

//todo switch the display party with the details like death counter and make details a hamburger menu
//added something new
export default App;

//fix later
//todo make the database refresh when you add a mon & make the sound play
//todo increment and save user details
