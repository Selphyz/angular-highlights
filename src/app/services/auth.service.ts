import { Injectable } from '@angular/core';
import {createUserWithEmailAndPassword, getAuth, updateProfile} from "firebase/auth";
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {IUser} from "../models/user.models";
import {Observable} from "rxjs";
import {map} from "rxjs/operators"

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usersCollection: AngularFirestoreCollection<IUser>;
  public isAuthenticated$: Observable<boolean>;
  constructor(
    private auth: AngularFireAuth,
    private db: AngularFirestore
  ) {
    this.usersCollection = db.collection('users');
    auth.user.subscribe(console.log);
    this.isAuthenticated$ = auth.user.pipe(map(user => !!user))
  }
  public async createUser(email: string, password: string, name: string, age: string, phoneNumber: string) {
    const auth = getAuth();
    const userCred = await createUserWithEmailAndPassword(auth, email!, password!);
    if(!userCred.user){
      throw new Error("User not found");
    }
    await this.usersCollection.doc(userCred.user.uid).set({
      name: name!,
      email: email!,
      age: age!,
      phoneNumber: phoneNumber!
    });
    await updateProfile(userCred.user, {
      displayName: name
    })
  }
}
