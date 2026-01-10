import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './auth.service';

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
  errorMsg = signal<string>('');
  successMsg = signal<string>('');
  constructor() { }

  ngOnInit() {
    this.buildForm();
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

    if (this.loginForm.valid) {
      const payload = this.loginForm.value;
      this.authService.login(payload).subscribe({
        next: (res) => {
          this.successMsg.set('Login Successful ✅')
        },
        error: (err) => {
          this.errorMsg.set(err.error?.error || 'Login Failed ❌');
        }
      })
    }
  }
}
