import { Injectable } from '@angular/core';
import {createUserWithEmailAndPassword, getAuth, updateProfile} from "firebase/auth";
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {IUser} from "../models/user.models";
import {Observable, of, switchMap} from "rxjs";
import {map, delay, filter} from "rxjs/operators"
import {ActivatedRoute, Router, NavigationEnd} from "@angular/router";
import {data} from "autoprefixer";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usersCollection: AngularFirestoreCollection<IUser>;
  public isAuthenticated$: Observable<boolean>;
  public isAuthenticatedWithDelay$: Observable<boolean>;
  private redirect = false;
  constructor(
    private auth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.usersCollection = db.collection('users');
    this.isAuthenticated$ = auth.user.pipe(map(user => !!user));
    this.isAuthenticatedWithDelay$ = this.isAuthenticated$.pipe(delay(1000));
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(e => this.route.firstChild),
      switchMap(route => route?.data ?? of({}))).subscribe(data => {
      this.redirect = data.authOnly ?? false
    })
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
  public async logOut($event?: MouseEvent) {
    $event && $event.preventDefault();
    await this.auth.signOut();
    if(this.redirect){
      await this.router.navigateByUrl('/');
    }
  }
}
