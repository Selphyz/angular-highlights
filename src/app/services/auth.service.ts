import { Injectable } from '@angular/core';
import {createUserWithEmailAndPassword, getAuth, updateProfile} from "firebase/auth";
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {IUser} from "../models/user.models";
import {FormControl, ɵFormGroupValue, ɵTypedOrUntyped} from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usersCollection: AngularFirestoreCollection<IUser>;
  constructor(
    private auth: AngularFireAuth,
    private db: AngularFirestore
  ) {
    this.usersCollection = db.collection('users');
  }
  public async createUser(userData: ɵTypedOrUntyped<{ password: FormControl<string | null>; phoneNumber: FormControl<string | null>; name: FormControl<string | null>; email: FormControl<string | null>; age: FormControl<string | null>; confirm_password: FormControl<string | null> }, ɵFormGroupValue<{ password: FormControl<string | null>; phoneNumber: FormControl<string | null>; name: FormControl<string | null>; email: FormControl<string | null>; age: FormControl<string | null>; confirm_password: FormControl<string | null> }>, any>) {
    const auth = getAuth();
    const userCred = await createUserWithEmailAndPassword(auth, userData.email!, userData.password!);
    if(!userCred.user){
      throw new Error("User not found");
    }
    await this.usersCollection.doc(userCred.user.uid).set({
      name: userData.name!,
      email: userData.email!,
      age: userData.age!,
      phoneNumber: userData.phoneNumber!
    });
    await updateProfile(userCred.user, {
      displayName: userData.name
    })
  }
}
