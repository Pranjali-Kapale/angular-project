import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LoginComponent } from './login-page';

describe('LoginPage', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent, HttpClientTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the login component', () => {
    expect(component).toBeTruthy();
  });

  it('should have invalid form when empty', () => {
    expect(component.loginForm.invalid).toBeTruthy();
  });

  it('should have valid form when email and password are correct', () => {
    component.loginForm.setValue({ email: 'eve.holt@reqres.in', password: 'cityslicka' });
    expect(component.loginForm.valid).toBeTruthy();
  });

  it('should call login API and set success message on success', async () => {
    component.loginForm.setValue({ email: 'eve.holt@reqres.in', password: 'cityslicka' });
    component.onSubmit();

    const req = httpMock.expectOne('https://reqres.in/api/login');
    expect(req.request.method).toBe('POST');

    req.flush({ token: 'fake-token-123' });
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.successMsg()).toBe('Login Successful ✅');
  });

  it('should handle API error response and set error message', async () => {
    component.loginForm.setValue({ email: 'wrong@test.com', password: '123456' });
    component.onSubmit();

    const req = httpMock.expectOne('https://reqres.in/api/login');
    req.flush({ error: 'Invalid credentials' }, { status: 400, statusText: 'Bad Request' });
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.errorMsg()).toBe('Invalid credentials');
  });
});