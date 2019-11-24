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
import { Card, Dialog, DialogTitle, DialogContent, DialogContentText, RadioGroup, FormControlLabel, Radio, DialogActions } from '@material-ui/core';

export class Luke {
  constructor(public spørsmål: string) { };
}

const App: React.FC = props => {
  const [provider, setProvider] = useState<firebase.auth.GoogleAuthProvider>(new firebase.auth.GoogleAuthProvider());
  const [email, setEmail] = useState<string>('');


  const [open, setOpen] = React.useState(false);
  const [luke, setLuke] = React.useState<Luke>(new Luke(''));
  const [currentDay, setCurrentDay] = React.useState(0);
  const [answer, setAnswer] = React.useState('');
  const handleClickOpen = async (day: number) => {
    const luke = await firebase.firestore().collection("luker").where("dag", "==", day);
    const snap = await luke.get();
    if (snap.docs.length !== 1)
      return;
    setLuke(snap.docs[0].data() as Luke);
    setCurrentDay(day);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleSvar = async () => {
    setOpen(false);
    const user = firebase.auth().currentUser;
    if (user !== null) {
      var t = await user.getIdToken();
      fetch('http://localhost:5000/julekalender-4617e/us-central1/answer?luke=1&svar=2',
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${t}`,
          }
        }
      ).then(response => response.json())
        .then(data => console.log(data));;
    }
  };


  const getDisabled = (day: number): boolean => {
    if (email === '')
      return true;
    return false;
  }
  const handleChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setAnswer(event.target.value);
  };
  function signIn() {
    firebase.auth().signInWithPopup(provider).then((result: any) => {
      if (result != null && result.credential != null) {

        setEmail(result.additionalUserInfo.profile['email']);
        const user = firebase.auth().currentUser;
        if (user !== null) {
          user.getIdToken(true).then(x => {
            console.log(x);
          });
        }
      }
    });
  }
  useEffect(() => {
    firebase.initializeApp(firebaseConfig);
    // Update the document title using the browser API
    provider.addScope('email');
    setProvider(provider);

  }, [provider]);

  const days = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]

  return (
    <div>
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
          <Grid item className={styles.alldays}>
            {days.map(i => {
              return (
                <Card className={styles.day} key={i}>
                  <Button onClick={() => handleClickOpen(i)} disabled={getDisabled(i)}>{i}</Button>
                </Card>
              )
            })}

          </Grid>
        </Grid>
      </Container>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Luke {currentDay}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {luke.spørsmål}
          </DialogContentText>
          <RadioGroup aria-label="gender" name="gender1" value={answer} onChange={handleChange}>
            <FormControlLabel value="female" control={<Radio />} label="Female" />
            <FormControlLabel value="male" control={<Radio />} label="Male" />
            <FormControlLabel value="other" control={<Radio />} label="Other" />
          </RadioGroup>


        </DialogContent>
        <DialogActions>
          <Button onClick={handleSvar} color="primary">
            Svar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}


export default App;
