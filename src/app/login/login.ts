import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';
  loading = false;

  constructor(private router: Router) {}

  async entrarAlDashboard(event: Event) {
    event.preventDefault();
    this.errorMessage = '';
    this.loading = true;

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: this.email, password: this.password }),
      });

      const data = await response.json();
      if (!response.ok) {
        this.errorMessage = data.message || 'Credenciales incorrectas';
        return;
      }

      localStorage.setItem('cervixai-token', data.token);
      localStorage.setItem('cervixai-user', JSON.stringify(data.user));
      this.router.navigate(['/dashboard']);
    } catch (error) {
      this.errorMessage = 'No se pudo conectar al servidor';
    } finally {
      this.loading = false;
    }
  }
}