import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Login } from '../Models/Login';
import { ApiService } from '../Services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(private fb: FormBuilder, private apiService: ApiService, private router: Router) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      emailId: ['', Validators.required],
      password: ['', Validators.required],
      rememberMe: [false]
    });

    this.loadCredentials();
  }

  loadCredentials(): void {
    const emailId = localStorage.getItem('emailId');
    const password = localStorage.getItem('password');
    if (emailId && password) {
      this.loginForm.patchValue({
        emailId: emailId,
        password: password,
        rememberMe: true
      });
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { emailId, password, rememberMe } = this.loginForm.value;
      console.log(this.loginForm.value);
      const login: Login = {
        EmailId: emailId,
        Password: password
      }
      this.apiService.Login(login).subscribe(
        response => {
          if (response == 'Invalid CustomerID or password.') {
            alert(response);
            return;
          }
          if (rememberMe) {
            localStorage.setItem('emailId', emailId);
            localStorage.setItem('password', password);
          } else {
            localStorage.removeItem('emailId');
            localStorage.removeItem('password');
          }
          sessionStorage.setItem('emailId', emailId);
          sessionStorage.setItem('Role', response);
          if (sessionStorage.getItem('Role') == 'Admin') {
            window.location.href = '/customer';
          }
          else {
            window.location.href = '/bills';
          }
        }
      );
    }
  }
}
