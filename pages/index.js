import { useEffect, useState } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import ChatRoom from "../components/ChatRoom";

import { ChakraProvider } from '@chakra-ui/react'
import { Grid, GridItem } from '@chakra-ui/react'
import { Flex, Spacer } from '@chakra-ui/react'
import { Container } from '@chakra-ui/react'

// initialization
if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: "AIzaSyDQfM8V4yeZAvPH65YaLBFd91OW7NQLkOA",
    authDomain: "boxed-a8889.firebaseapp.com",
    projectId: "boxed-a8889",
    storageBucket: "boxed-a8889.appspot.com",
    messagingSenderId: "371341355125",
    appId: "1:371341355125:web:6bdbcdb18aee074967b03c",
    measurementId: "G-J83P41466P"
  });
} else {
  firebase.app(); // if already initialized, use that one
}

const auth = firebase.auth();
const db = firebase.firestore();

export default function Home() {
  // initial states
  const [user, setUser] = useState(() => auth.currentUser);

  // automatically check a user's auth status
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      // update the user current state
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
  }, []);

  // sign in
  const signInWithGoogle = async () => {
    // get the google provider object
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.useDeviceLanguage();

    // signing in user
    try {
      await auth.signInWithPopup(provider);
    } catch (error) {
      console.log(error);
    }
  };

  // signout
  const signOut = async () => {
    try {
      await firebase.auth().signOut();
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <ChakraProvider>
      <Grid
        pos="fixed"
        h='100%'
        w='100%'
        templateRows='repeat(1, 1fr)'
        templateColumns='repeat(5, 1fr)'
        gap={4}
      >
        <GridItem rowSpan={1} colSpan={1} bg='tomato' overflowY='auto'>
          <Container >
            {user ? (
              <>
                <nav id="sign_out">
                  <h2>Chat With Friends</h2>
                  <button onClick={signOut}>Sign Out</button>
                </nav>
                <ChatRoom user={user} db={db} />
              </>
            ) : (
              <section id="sign_in">
                <h1>Welcome to Chat Room</h1>
                <button onClick={signInWithGoogle}>Sign In With Google</button>
              </section>
            )}
          </Container>
        </GridItem>
        <GridItem colSpan={4} bg='black' />
      </Grid>
      
    </ChakraProvider>
  );
}