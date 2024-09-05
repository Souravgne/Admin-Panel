"use client";

import { Button, Card, Checkbox, Label, TextInput } from "flowbite-react";
import React, { useState , useEffect} from 'react';
import { useFirebase } from '../context/Firebase';


function Login({ onLogin }) {

  

    const firebase = useFirebase();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    

    const signinUser = async (e) => {
      e.preventDefault();
      try {
          await firebase.loginUserWithEmailAndPassword(email, password);
          console.log("loginsuccess");
          onLogin(true);
      } catch (error) {
          console.error("Error signing in!", error);
          // Optionally, you can add error handling logic here to display an error message to the user
      }
  };
  

    return (
        <div className="flex items-center justify-center w-full min-h-screen bg-gray-100">
            <Card className="max-w-sm w-full">
                <form className="flex flex-col gap-4" onSubmit={signinUser}>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="email1" value="Your email" />
                        </div>
                        <TextInput
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            id="email1"
                            type="email"
                            placeholder="name@email.com"
                            required
                        />
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="password1" value="Your password" />
                        </div>
                        <TextInput
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            id="password1"
                            placeholder="********"
                            type="password"
                            required
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Checkbox id="remember" />
                        <Label htmlFor="remember">Remember me</Label>
                    </div>
                    <Button type="submit">Sign in</Button>
                </form>
            </Card>
        </div>
    );
}

export default Login;
