const algoliasearch = require("algoliasearch");
const dotenv = require("dotenv");
const firebase = require("firebase");

// load values from the .env file in this directory into process.env
dotenv.load();

// configure firebase
firebase.initializeApp({
  databaseURL: "https://routedesvinsmobile.firebaseio.com"
});
const database = firebase.database();

// configure algolia
const algolia = algoliasearch("1WYSWXMAA0", "5eaad0af223d32c2631920ee7142502a");
const index = algolia.initIndex("routedesvins");

database.ref("/sommeliers").once("value", contacts => {
  // Build an array of all records to push to Algolia
  const records = [];
  contacts.forEach(contact => {
    // get the key and data from the snapshot
    const childKey = contact.key;
    const childData = contact.val();
    // We set the Algolia objectID as the Firebase .key
    childData.objectID = childKey;
    // Add object for indexing
    records.push(childData);
  });

  // Add or update new objects
  index
    .saveObjects(records)
    .then(() => {
      console.log("Contacts imported into Algolia");
    })
    .catch(error => {
      console.error("Error when importing contact into Algolia", error);
      process.exit(1);
    });
});

const contactsRef = database.ref("/sommeliers");
contactsRef.on("child_added", addOrUpdateIndexRecord);
contactsRef.on("child_changed", addOrUpdateIndexRecord);
contactsRef.on("child_removed", deleteIndexRecord);

function addOrUpdateIndexRecord(contact) {
  // Get Firebase object
  const record = contact.val();
  // Specify Algolia's objectID using the Firebase object key
  record.objectID = contact.key;
  // Add or update object
  index
    .saveObject(record)
    .then(() => {
      console.log("Firebase object indexed in Algolia", record.objectID);
    })
    .catch(error => {
      console.error("Error when indexing contact into Algolia", error);
      process.exit(1);
    });
}

function deleteIndexRecord(contact) {
  // Get Algolia's objectID from the Firebase object key
  const objectID = contact.key;
  // Remove the object from Algolia
  index
    .deleteObject(objectID)
    .then(() => {
      console.log("Firebase object deleted from Algolia", objectID);
    })
    .catch(error => {
      console.error("Error when deleting contact from Algolia", error);
      process.exit(1);
    });
}
