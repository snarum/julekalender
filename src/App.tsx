import React, { useState, useEffect } from 'react';
import styles from './App.module.css';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import { firebaseConfig } from '../src/firebase.config';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import { Card } from '@material-ui/core';


const App: React.FC = props => {
  const [provider, setProvider] = useState<firebase.auth.GoogleAuthProvider>(new firebase.auth.GoogleAuthProvider());
  const [email, setEmail] = useState<string>('');
  function signIn(){
    firebase.auth().signInWithPopup(provider).then((result: any)=> {
      if(result != null && result.credential != null){
        setEmail(result.additionalUserInfo.profile['email']);
      }            
    });
  }
  useEffect(() => {
    firebase.initializeApp(firebaseConfig);
    // Update the document title using the browser API
    provider.addScope('email');
    setProvider(provider);
    var user = firebase.auth().currentUser;

    if(!user){
      console.log(user);
    }
  },[provider]);
  return (
    <Container maxWidth="lg">
    <Toolbar >
      <Grid container className={styles.toolbarButtons}>
        <Grid item></Grid>
        <Grid item>

            
      {email === '' &&
      <Button variant="outlined" size="small" onClick={signIn}>
        sign in
      </Button>
      }
      {email !== '' && 
      <div>{email}</div>
      }
      </Grid>
      </Grid>
    </Toolbar>
    <Grid container>
      <Grid item>
        <Card className={styles.day}>
          24
        </Card>
      </Grid>
    </Grid>
    </Container>
      );
}


export default App;
