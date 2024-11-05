import "../css/Header.css";
import React, { useEffect } from "react";
import { useContext, useState, useMemo } from "react";
import { userNavContext } from "../App";
import pokemonInfiniteFusion from "../pokemonID";
export default function Header() {
  const { loadPlayer, setLoadPlayer } = useContext(userNavContext);
  const [selectedPlayer, setSelectedPlayer] = useState([
    "All",
    "sean",
    "braden",
    "gerald",
  ]);
  //state variables
  //| for player selection
  const [currentPlayer, setCurrentPlayer] = useState("");
  //for mon search
  const [headIsFocused, setHeadIsFocused] = useState(true);
  const [bodyIsFocused, setBodyIsFocused] = useState(true);
  const [headQuery, setHeadQuery] = useState("");
  const [bodyQuery, setBodyQuery] = useState("");

  // Convert pokemonInfiniteFusion to an array of keys
  const pokemonArray = Object.keys(pokemonInfiniteFusion);

  //reg variables
  //filters the items when a user searches
  const filteredItems = useMemo(() => {
    return pokemonArray.filter((item) => {
      return item.toLowerCase().includes(headQuery.toLowerCase());
    });
  }, [headQuery]);
  const filteredItemsBody = useMemo(() => {
    return pokemonArray.filter((item) => {
      return item.toLowerCase().includes(bodyQuery.toLowerCase());
    });
  }, [bodyQuery]);

  //loading player functions
  useEffect(() => {
    setCurrentPlayer(selectedPlayer[loadPlayer]);
  }, [loadPlayer]);

  const increase = () => {
    setLoadPlayer((prevLoadPlayer) =>
      prevLoadPlayer < 3 ? prevLoadPlayer + 1 : 0
    );
  };
  const decrease = () => {
    setLoadPlayer((prevLoadPlayer) =>
      prevLoadPlayer < 3 ? prevLoadPlayer - 1 : 0
    );
  };
  //search functions
  const headHandleFocus = () => {
    setHeadIsFocused(false);
  };

  const HeadHandleBlur = () => {
    //we need this timer so the user can pick a mon before losing focus of the input
    setTimeout(function () {
      setHeadIsFocused(true);
    }, 150);
  };
  const clickToSetHead = (e) => {
    setHeadQuery(e.target.value);
  };

  const bodyHandleFocus = () => {
    setBodyIsFocused(false);
  };
  const bodyHandleBlur = () => {
    //we need this timer so the user can pick a mon before losing focus of the input
    setTimeout(function () {
      setBodyIsFocused(true);
    }, 150);
  };

  const clickToSetBody = (e) => {
    setBodyQuery(e.target.value);
  };
  return (
    <div className="header-container">
      <div className="left-container">
        {/* this will be the new navigation for switching players */}
        <button onClick={decrease}>left</button>
        <p>{currentPlayer}</p>
        <button onClick={increase}>right</button>
      </div>
      {/* <div className="right-container">
        <input
          value={headQuery}
          type="search"
          name="headMon"
          id="headMon"
          placeholder="head mon"
          onChange={(e) => setHeadQuery(e.target.value)}
          onFocus={headHandleFocus}
          onBlur={HeadHandleBlur}
        />
        {!headIsFocused && (
          <div className="suggestion-box">
            {filteredItems.map((item) => (
              <ul key={item}>
                <button onClick={clickToSetHead} value={item}>
                  {item}
                </button>
              </ul>
            ))}
          </div>
        )}
        <button className="submit-head sub-btn">😁</button>

        <input
          value={bodyQuery}
          type="search"
          name="bodyMon"
          id="bodyMon"
          placeholder="body mon"
          onChange={(e) => setBodyQuery(e.target.value)}
          onFocus={bodyHandleFocus}
          onBlur={bodyHandleBlur}
        />
        {!bodyIsFocused && (
          <div className="suggestion-box">
            {filteredItemsBody.map((item) => (
              <ul key={item}>
                <button onClick={clickToSetBody} value={item}>
                  {item}
                </button>
              </ul>
            ))}
          </div>
        )}
        <button className="submit-body sub-btn">🐈</button>

        <button className="faint-btn right-btn">😡</button>
        {/** show an icon here instead of text for fainted*/}
      {/* <button className="delete-btn right-btn">delete</button>
      // </div> */}
    </div>
  );
}
