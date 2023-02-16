import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { firestore } from "firebase-admin";

admin.initializeApp();

interface UserDataType {
  role: string;
}

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
