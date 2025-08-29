import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/users';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:8080/api/users'; 

  constructor(private http: HttpClient) {}

  // Récupérer tous les utilisateurs
  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  // Récupérer un utilisateur par son ID
  getById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  // Créer un nouvel utilisateur
  create(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  // Mettre à jour un utilisateur existant
  update(id: string, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }

  // Supprimer un utilisateur
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
