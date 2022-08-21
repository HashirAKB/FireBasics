console.log(firebase)

const auth = firebase.auth(); /* The Firebase Auth service interface. */

/* Grabbing buttons from HTML. Using getElementById */
const whenSignedIn = document.getElementById('whenSignedIn');
const whenSignedOut = document.getElementById('whenSignedOut');

const signInBtn = document.getElementById('signInBtn');
const signOutBtn = document.getElementById('signOutBtn');

const userDetails = document.getElementById('userDetails');

/* Declaring google auth */
const provider = new firebase.auth.GoogleAuthProvider();

/// Sign in event handlers
signInBtn.onclick = () => auth.signInWithPopup(provider);
signOutBtn.onclick = () => auth.signOut();

/* The onAuthStateChanged method runs a callback function each time the user’s auth state changes. If signed-in, the user param will be an object containing the user’s UID, email address, etc. If signed-out it will be null. */
auth.onAuthStateChanged(user => { /* https://www.w3schools.com/js/js_arrow_function.asp */
    if (user) {
        // signed in
        whenSignedIn.hidden = false;
        whenSignedOut.hidden = true;
        userDetails.innerHTML = `<h3>Hello ${user.displayName}!</h3> <p>User ID: ${user.uid}</p>`;
    } else {
        // not signed in
        whenSignedIn.hidden = true;
        whenSignedOut.hidden = false;
        userDetails.innerHTML = '';
    }
});

let thingsRef;
let unsubscribe;

// loads the area to render out DB items.
const createThing = document.getElementById('createThing');
// Things list will be here only. Loading to this variable from element.
const thingsList = document.getElementById('thingsList');

const db = firebase.firestore(); /* https://rnfirebase.io/firestore/usage */

auth.onAuthStateChanged(user => {

    if (user) {

        // Database Reference
        thingsRef = db.collection('things')

        createThing.onclick = () => {

            const { serverTimestamp } = firebase.firestore.FieldValue;

            thingsRef.add({
                uid: user.uid,
                name: faker.commerce.productName(),
                createdAt: serverTimestamp()
            });
        }

    }
});


auth.onAuthStateChanged(user => {

    if (user) {

        // Database Reference
        thingsRef = db.collection('things')

        // ..... omitted .....

        // Query
        unsubscribe = thingsRef.where('uid', '==', user.uid)
            .onSnapshot(querySnapshot => {
                
                // Map results to an array of li elements

                const items = querySnapshot.docs.map(doc => {

                    return `<li>${doc.data().name}</li>`

                });

                thingsList.innerHTML = items.join('');

            });



    } else {
        // Unsubscribe when the user signs out
        unsubscribe && unsubscribe();
    }
});