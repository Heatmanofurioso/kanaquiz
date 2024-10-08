import {STAGE_FIRST, STAGE_LAST} from "./quizSettings";

export function arrayContains(needle: any, haystack: any) {
  return (haystack.indexOf(needle) > -1);
}

export function removeFromArray(needle: any, haystack: any) {
  if (typeof needle === 'object')
    needle = needle[0];

  if (arrayContains(needle, haystack)) {
    haystack.splice(haystack.indexOf(needle), 1);
  }
  return haystack;
}

export function findRomajisAtKanaKey(needle: any, kanaDictionary: any) {
  let romaji: any = [];
  Object.keys(kanaDictionary).forEach(function (whichKana) {
    // console.log(whichKana); // 'hiragana' or 'katakana'
    Object.keys(kanaDictionary[whichKana]).forEach(function (groupName) {
      // console.log(groupName); // 'h_group1', ...
      Object.keys(kanaDictionary[whichKana][groupName]['characters']).forEach(function (key) {
        if (key == needle) {
          // console.log(kanaDictionary[whichKana][groupName]['characters'][key]);
          romaji = kanaDictionary[whichKana][groupName]['characters'][key];
        }
      });
    });
  });
  // console.log(romaji);
  return romaji;
}

// whichKanaTypeIsThis(character, kanaDictionary) { // in case if needed later
//     let type = null;
//     Object.keys(kanaDictionary).map(function(whichKana) {
//         Object.keys(kanaDictionary[whichKana]).map(function(groupName) {
//             Object.keys(kanaDictionary[whichKana][groupName]['characters']).map(function(key) {
//                 if(key==character) {
//                     type = whichKana;
//                 }
//             }, this);
//         }, this);
//     }, this);
//     return type;
// }

export function shuffle(array: any) {
  let i = 0
    , j = 0
    , temp = null;

  for (i = array.length - 1; i > 0; i -= 1) {
    j = Math.floor(Math.random() * (i + 1))
    temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
}

export function removeHash() {
  const loc = window.location;
  if ("pushState" in history)
    history.replaceState("", document.title, loc.pathname + loc.search);

}

export function getRandomFromArray(arr: any) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function cartesianProduct(elements: any) {
  if (!Array.isArray(elements)) {
    throw new TypeError();
  }

  const end = elements.length - 1,
    result = [];

  function addTo(curr: any, start: any) {
    const first = elements[start],
      last = (start === end);

    for (let i = 0; i < first.length; ++i) {
      const copy = curr.slice();
      copy.push(first[i]);

      if (last) {
        result.push(copy);
      } else {
        addTo(copy, start + 1);
      }
    }
  }

  if (elements.length) {
    addTo([], 0);
  } else {
    result.push([]);
  }
  return result;
}

export function intersection(a: any, b: any) {
  const setA = new Set(a);
  return b.filter((value: any) => setA.has(value));
}

export const sanitizeStage = (stage: any) => {
  if (parseInt(stage) < 1 || isNaN(parseInt(stage))) {
    return STAGE_FIRST;
  } else if (parseInt(stage) > 5) {
    return STAGE_LAST;
  } else {
    return parseInt(stage);
  }
}
