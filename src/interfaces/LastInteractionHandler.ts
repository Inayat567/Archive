import { TABLE_INTERACTIONS } from 'config/constants';
import { db } from 'firebase/firebaseApp';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export async function setLastInteraction(userUid: string, anotherUserUid: string) {
  // TABLE_INTERACTIONS
  const ref = doc(db, TABLE_INTERACTIONS, userUid);
  const snap = await getDoc(ref);
  let data:any={ }
  if (snap.exists()) {
    let cloudData = snap.data();
      data= {...cloudData};
    if (data[anotherUserUid] && data[anotherUserUid].numberOfCalls) {
      
      data[anotherUserUid] = {
        lastCalled: new Date().getTime(),
        numberOfCalls: cloudData[anotherUserUid].numberOfCalls + 1,
      }
    }
    else {
      data[anotherUserUid] = {
        lastCalled: new Date().getTime(),
        numberOfCalls: 1,
      };
    }
  }
  else {
    data = {
      [anotherUserUid]: {
        lastCalled: new Date().getTime(),
        numberOfCalls: 1,
      },
    };
  }
  const key = `${userUid}`;

  setDoc(doc(db, TABLE_INTERACTIONS, key), data);
}

// should return from earliest to latest interactions array with user uids
// easier for comparing later on this way, because latest entries will have higher array index (for comparison)
// and then -1 (not found) will not mess up with comparison
export async function getLastInteractions(
  userUid: string
): Promise<{interactions: string[]; numbersOfCalls: string[]}> {
  try {
    const ref = doc(db, TABLE_INTERACTIONS, userUid);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const obj = snap.data();
      const interactions = Object.entries(obj)
        .map(([key, value]) => {
          return key;
        })
        .sort((a, b) => {
          if (obj[a].lastCalled > obj[b].lastCalled) {
            return 1;
          } else if (obj[a].lastCalled < obj[b].lastCalled) {
            return -1;
          }
          return 0;
        });
      let numbersOfCalls = Object.entries(obj)
        .map(([key, value]) => {
          return key;
        })
        .sort((a, b) => {
          if (obj[a].numberOfCalls < obj[b].numberOfCalls) {
            return 1;
          } else if (obj[a].numberOfCalls > obj[b].numberOfCalls) {
            return -1;
          }
          return 0;
        });
        numbersOfCalls=[...numbersOfCalls.slice(0,3)];
      return {interactions, numbersOfCalls};
    }
    return {interactions: [], numbersOfCalls: []};
  } catch (e) {
    console.log(e);
    return {interactions: [], numbersOfCalls: []};
  }
}
