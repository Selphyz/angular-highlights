import { Component, OnInit } from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  credentials = {
    email: '',
    password: ''
  }
  inSubmission = false;
  showAlert = false;
  alertMsg = 'Wait while you are being logged';
  alertColor = 'blue';
  constructor(private auth: AngularFireAuth) { }

  ngOnInit(): void {
  }

  async login() {
    this.inSubmission = true;
    this.showAlert = true;
    this.alertMsg = 'Wait while you are being logged';
    this.alertColor = 'blue'
    try {
      await this.auth.signInWithEmailAndPassword(this.credentials.email, this.credentials.password)
    }catch (e) {
      this.inSubmission = false;
      this.alertMsg = 'An unexpected error happened. Try again later';
      this.alertColor = 'red';
      console.log(e);
      return;
    }
    this.alertMsg = 'Successfully logged in';
    this.alertColor = 'green';
  }
}
