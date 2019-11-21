import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import { firebaseConfig } from '../src/firebase.config';

const App: React.FC = () => {
  var googleProvider:firebase.auth.GoogleAuthProvider;
  const [email, setEmail] = useState<string>('');
  function signIn(){
    firebase.auth().signInWithPopup(googleProvider).then((result: any)=> {
      if(result != null && result.credential != null){
        console.log(result);
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
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <button onClick={signIn}>Sign in</button>
    </div>
  );
}

export default App;
