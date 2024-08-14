import React, { useState, useEffect } from 'react';

const CharacterGroup = (props: any) => {
  const [shownChars, setShownChars] = useState('');

  const changeShownChars = (newString: any) => {
    setShownChars(newString);
  };

  const getShowableCharacters = (whichKana: any) => {
    let strRomajiCharacters = '';
    let strKanaCharacters = '';
    Object.keys(props.characters).forEach((character) => {
      const romajiString = props.characters[character].join('/');
      strRomajiCharacters += romajiString + ' · ';
      strKanaCharacters += character + ' · ';
    });
    strRomajiCharacters = strRomajiCharacters.slice(0, -2);
    strKanaCharacters = strKanaCharacters.slice(0, -2);
    return whichKana === 'romaji' ? strRomajiCharacters : strKanaCharacters;
  };

  useEffect(() => {
    changeShownChars(getShowableCharacters('romaji'));
  }, []); // Equivalent to `componentWillMount` in class components

  return (
    <div
      className={
        'list-group-item' +
        (props.groupName.endsWith('_a') || props.groupName.endsWith('_s') ? ' alt-row' : '') +
        (['h_group16_a', 'k_group18_a', 'k_group29_a'].includes(props.groupName) ? ' divider-row' : '')
      }
      onClick={() => {
        props.handleToggleSelect(props.groupName);
        changeShownChars(getShowableCharacters('romaji'));
      }}
      onMouseEnter={() => changeShownChars(getShowableCharacters('kana'))}
      onMouseLeave={() => changeShownChars(getShowableCharacters('romaji'))}
      onTouchStart={() => changeShownChars(getShowableCharacters('kana'))}
      onTouchEnd={() => changeShownChars(getShowableCharacters('romaji'))}
    >
      <span className={props.selected ? 'fas fa-check' : 'far fa-circle'}></span> {shownChars}
    </div>
  );
};

export default CharacterGroup;
