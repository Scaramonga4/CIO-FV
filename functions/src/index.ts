// code written by Isaac Michiels
// All glory to Jesus Christ
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { firestore } from "firebase-admin";

admin.initializeApp();

interface UserDataType {
  role: string;
}

interface MatchDataType {
  commentaire: string;
  equipes: {
    Equ1: string;
    Equ2: string;
  };
  heure: number | null;
  score: {
    Equ1: number;
    Equ2: number;
  };
  termine: number;
  passage: number;
}
interface PouleDataType {
  matchs: { [key: string]: MatchDataType };
  terrain: string;
}
type PouleDataTypeWithUid = {
  uid: string;
} & PouleDataType;

type EquipeDataTypeWithUid = {
  uid: string;
} & EquipeDataType;

interface EquipeDataType {
  classe: string;
  classement: number;
  devise: string;
  id: string;
  nom_participant: string[];
  poule: string;
}

// interface EquipesDataType {
//   [key: string]: EquipeDataType;
// }

exports.CalculerMatchPoules = functions.https.onCall(async (data, context) => {
  // check if user signed in
  if (!context) {
    console.log("error, auth in context undefined");
    throw new functions.https.HttpsError(
      "failed-precondition",
      "The function must be called " + "while authenticated (debug:1)."
    );
  }
  if (!context.auth) {
    console.log("error, auth in context undefined");
    throw new functions.https.HttpsError(
      "failed-precondition",
      "The function must be called " + "while authenticated."
    );
  }
  // get user data
  const userUid: string = context.auth.uid;
  const userDataResponse = await firestore()
    .collection("Users")
    .doc(userUid)
    .get();
  // @ts-ignore -> typescript doesnt know firebase ...
  const userData: UserDataType = userDataResponse.data();

  // check if admin user
  if (!(userData.role === "admin")) {
    console.log("function aborted, unauthorized access");
    throw new functions.https.HttpsError(
      "failed-precondition",
      "You do not have the permission to call this function."
    );
  }

  // user is admin !
  // start function

  // get poules
  const poulesDataResponse = await firestore().collection("Poules").get();

  // @ts-ignore -> typescript doesnt know firebase ...
  const poulesData: PouleDataTypeWithUid[] = poulesDataResponse.docs.map(
    (doc) => {
      return {
        ...doc.data(),
        uid: doc.id,
      };
    }
  );

  // loop thru poules and get equipes corresponding
  await Promise.all(
    poulesData.map(async (poule) => {
      // get equipes corresponding to that poule
      const equipesDataResponse = await firestore()
        .collection("Equipes")
        .where("poule", "==", poule.uid)
        .get();
      // @ts-ignore -> typescript doesnt know firebase ...
      const equipesData: EquipeDataTypeWithUid[] = equipesDataResponse.docs.map(
        (doc) => {
          return {
            ...doc.data(),
            uid: doc.id,
          };
        }
      );

      // calculate match -> convertign from object of objects, to array of objects with uid of object
      const matchs: MatchDataType[] = calculateMatchs(equipesData);

      // delete existing matchs
      await deleteCollection(`Poules/${poule.uid}/matchs`, 10);

      const ref = firestore()
        .collection("Poules")
        .doc(poule.uid)
        .collection("matchs");
      // set matchs in poules
      for (const match of matchs) {
        await ref.add(match);
      }
    })
  );

  console.log("function ran successfully");
  return {
    message: "successfull",
  };
});

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// function to calculate the matchs of the x teams
function calculateMatchs(equipes: EquipeDataTypeWithUid[]): MatchDataType[] {
  // must team must fight with each other team in the same poule
  let matchs: MatchDataType[] = [];

  //////////////EXPLANATIONS///////////////

  // 2 eq
  // a b ;

  // 3 eq
  // a b ; a c ; b c ; c !!

  // 4 eq
  // a b ; a c ; a d ;;(+1) b c ; b d ;;(+2) c d ;; d !!

  // teams a, b, c, and d
  // first loop create matches with a: a to d
  // second loop create matches with b : b to d  -> from b, because alwready in, with previous teams that looped!
  // third loop create matches with c : c to d -> from c, because alwready in, with previous teams that looped!
  // fourth loop -> nothing !! d has alwready all the matches done previously !

  // proof of work
  // let a: [string, string][] = [];
  ///////////////////////////////////////////

  // get total number of teams

  const equipesLength: number = equipes.length;
  let passage: number = 1;
  // loop thru eac team and creat matchs
  equipes.forEach((equipe, index) => {
    // create a loop that add matches to be done agains other teams, later down wont add because alwready did it before
    for (let i = index; i < equipesLength - 1; i++) {
      // proof of work
      // a.push([equipe.uid, equipes[i + 1].uid]);

      // add match
      matchs.push({
        passage,
        commentaire: "",
        heure: null,
        score: {
          Equ1: 0,
          Equ2: 0,
        },
        termine: 0,
        equipes: {
          Equ1: equipe.uid,
          Equ2: equipes[i + 1].uid,
        },
      });

      passage += 1;
    }
  });

  return matchs;
}

async function deleteCollection(collectionPath: string, batchSize: number) {
  const collectionRef = firestore().collection(collectionPath);
  const query: firestore.Query<firestore.DocumentData> = collectionRef
    .orderBy("__name__")
    .limit(batchSize);

  return new Promise((resolve: any, reject: any) => {
    deleteQueryBatch(query, resolve).catch(reject);
  });
}

async function deleteQueryBatch(
  query: firestore.Query<firestore.DocumentData>,
  resolve: () => {}
) {
  const snapshot = await query.get();

  const batchSize = snapshot.size;
  if (batchSize === 0) {
    // When there are no documents left, we are done
    resolve();
    return;
  }

  // Delete documents in a batch
  const batch = firestore().batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();

  // Recurse on the next process tick, to avoid
  // exploding the stack.
  process.nextTick(() => {
    deleteQueryBatch(query, resolve);
  });
}

//voila c bon, j'arrive pas a envoyer le code sur github ca me dit que j'ai pas les permissions de modifier...  J'ai mis le code sur Firebase Functions, tu l'appelles dans le code, si il y a des beug, tu me dit!
