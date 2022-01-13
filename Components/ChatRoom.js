import { useEffect, useRef, useState } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import { formatRelative } from "date-fns";
import { Box, Button, InputGroup, Input, InputRightElement, List, ListItem, Grid, GridItem, Center } from "@chakra-ui/react";

export default function Chatroom(props) {
  // constants
  const db = props.db;
  const dummySpace = useRef();
  //   get user details
  const { uid, displayName, photoURL } = props.user;

  // initial states
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // automatically check db for new messages
  useEffect(() => {
    db.collection("messages")
      .orderBy("createdAt")
      .limit(100)
      .onSnapshot((querySnapShot) => {
        // get all documents from collection with id
        const data = querySnapShot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        //   update state
        setMessages(data);
      });
  }, [db]);

  // when form is submitted
  const handleSubmit = (e) => {
    e.preventDefault();

    db.collection("messages").add({
      text: newMessage,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      displayName,
      photoURL,
    });

    setNewMessage("");

    // scroll down the chat
    dummySpace.current.scrollIntoView({ behavor: "smooth" });
  };

  return (
      <Grid
        pos='fixed'
        h='100%'
        templateRows='repeat(12, 1fr)'
        templateColumns='repeat(1, 1fr)'
        gap={4}
      >
        <GridItem rowSpan={10} bg='tomato' overflowY="auto"
        css={{
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            width: '6px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'white',
            borderRadius: '24px',
          },
        }}>
          <List>
            {messages.map((message) => (
              <ListItem key={message.id} className={message.uid === uid ? "sent" : "received"}>
                <section>
                  {/* display user image */}
                  {message.photoURL ? (
                    <img
                      src={message.photoURL}
                      alt="Avatar"
                      width={45}
                      height={45}
                    />
                  ) : null}
                </section>

                <section>
                  {/* display message text */}
                  <p>{message.text}</p>

                  {/* display user name */}
                  {message.displayName ? <span>{message.displayName}</span> : null}
                  <br />
                  {/* display message date and time */}
                  {message.createdAt?.seconds ? (
                    <span>
                      {formatRelative(
                        new Date(message.createdAt.seconds * 1000),
                        new Date()
                      )}
                    </span>
                  ) : null}
                </section>
              </ListItem>
            ))}
          </List>
        </GridItem>
        <GridItem rowSpan={2} bg='transparent'>
          {/* input form */}
          <Center>
            <Box boxShadow='xl' bg='white'>
              <form onSubmit={handleSubmit}>
                <InputGroup>
                  <Input
                    pr='4.5rem'
                    placeholder='Type your message here...'
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <InputRightElement width='4.5rem'>
                    <Button h='1.75rem' size='sm' type="submit" disabled={!newMessage}>
                      Send
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </form>
            </Box>
          </Center>
        </GridItem>
      </Grid>
  );
}
