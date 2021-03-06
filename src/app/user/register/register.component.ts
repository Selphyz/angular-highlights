import { Component } from '@angular/core';
import {FormGroup, FormControl, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {Validation} from "../../utils/utils";
import {MatchValidators} from "../../utils/match-validators";
import {EmailTaken} from "../../utils/email-taken";
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  constructor(
    private authService: AuthService, private emailTaken: EmailTaken
  ) {}
  name = new FormControl('', [
    Validators.required,
    Validators.minLength(3)
  ]);
  email = new FormControl('', [
    Validators.required,
    Validators.email
  ], [this.emailTaken.validate]);
  age = new FormControl('', [
    Validators.required,
    Validators.min(18),
    Validators.max(120)
  ]);
  password = new FormControl('', [
    Validators.required,
    Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm)
  ]);
  confirm_password = new FormControl('',
    Validators.required
  );
  phoneNumber = new FormControl('', [
    Validators.required,
    Validators.minLength(9),
    Validators.maxLength(9)
  ]);
  registerForm = new FormGroup({
    name: this.name,
    email: this.email,
    age: this.age,
    password: this.password,
    confirm_password: this.confirm_password,
    phoneNumber: this.phoneNumber,
  }, [MatchValidators.match('password', 'confirm_password')])
  showAlert = false;
  alertMsg = 'Please wait! Your account is being created';
  alertColor = 'blue';
  inSubmission = false;
  async register() {
    this.showAlert = true;
    this.alertMsg = 'Please wait! Your account is being created';
    this.alertColor = 'blue';
    this.inSubmission = true;
    const {email, password, name, age, phoneNumber} = this.registerForm.value;
    try{
      await this.authService.createUser(email!, password!, name!, age!, phoneNumber!)
    }catch (e){
      console.error(e);
      this.alertMsg = 'An unexpected error ocurred';
      this.alertColor = 'red';
      this.inSubmission = false;
      return;
    }
    this.inSubmission = false;
    this.alertMsg = 'User registered';
    this.alertColor = 'green';
    }
}
