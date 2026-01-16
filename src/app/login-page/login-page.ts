import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './auth.service';
import { TelemetryService } from './../telemetry.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-page.html',
  styleUrls: ['./login-page.scss']
})
export class LoginComponent {
  loginForm!: FormGroup;

  private fb: FormBuilder = inject(FormBuilder);
  private changeRef: ChangeDetectorRef = inject(ChangeDetectorRef);
  private authService: AuthService = inject(AuthService);
  private router = inject(Router);
  private telemetry = inject(TelemetryService);
  errorMsg = signal<string>('');
  successMsg = signal<string>('');
  constructor() { }

  ngOnInit() {
    this.buildForm();
    this.telemetry.trace('LoginPageLoaded');
    this.loginForm.markAsPristine();
    this.changeRef.detectChanges();
  }

  private buildForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.loginForm.valueChanges.subscribe(() => {
      this.errorMsg.set('');
      this.successMsg.set('');
    })
  }


  onSubmit() {

    this.telemetry.trace('LoginSubmitClicked');

    if (this.loginForm.invalid) {

      // 📍 Telemetry: Validation failure
      this.telemetry.trace('LoginValidationFailed', {
        emailInvalid: this.loginForm.controls['email'].invalid,
        passwordInvalid: this.loginForm.controls['password'].invalid
      });

      return;
    }

    // if (this.loginForm.valid) {
    const payload = this.loginForm.value;
    this.telemetry.resetTraceId();
    this.authService.login(payload).subscribe({
      next: (res) => {
        this.successMsg.set('Login Successful ✅');
        this.router.navigate(['/admin']);
      },
      error: (err) => {
        this.telemetry.trace('LoginFailure', {
          status: err.status,
          message: err.error?.error
        });
        this.errorMsg.set(err.error?.error || 'Login Failed ❌');
      }
    })
    // }
  }
}
