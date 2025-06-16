import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/AuthService';
import { validateDniControl } from 'src/app/utils/form.utils';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {

  loginForm: FormGroup = this.formBuilder.group({
    dni: ['', [Validators.required, validateDniControl]],
    pass: ['', [Validators.required, Validators.minLength(4)]],
  });

  errorMsg: string = '';

  constructor(private formBuilder: FormBuilder, private router: Router, private authService: AuthService) { }

  ngOnInit() {
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.router.navigate(['/inicio']);
      },
      error: () => {
        this.errorMsg = 'Credenciales incorrectas.';
      }
    });
  }

}
