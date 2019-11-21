import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import { firebaseConfig } from '../src/firebase.config';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
const App: React.FC = () => {
  var googleProvider:firebase.auth.GoogleAuthProvider;
  const [email, setEmail] = useState<string>('');
  function signIn(){
    firebase.auth().signInWithPopup(googleProvider).then((result: any)=> {
      if(result != null && result.credential != null){
        setEmail(result.additionalUserInfo.profile['email']);
      }            
    });
  }
  useEffect(() => {
    firebase.initializeApp(firebaseConfig);
    // Update the document title using the browser API
    googleProvider = new firebase.auth.GoogleAuthProvider();
    googleProvider.addScope('email');

    var user = firebase.auth().currentUser;

    if(!user){
      console.log(user);
    }
  },[]);
  return (
    <Container maxWidth="lg">
    <Toolbar >
      <Button size="small">Subscribe</Button>
      <Typography
        component="h2"
        variant="h5"
        color="inherit"
        align="center"
        noWrap

      >
        Blog
      </Typography>
      <IconButton>
        <SearchIcon />
      </IconButton>
      <Button variant="outlined" size="small">
        Sign up
      </Button>
    </Toolbar>
    </Container>
      );
}

export default App;
