import { Component, ElementRef, OnInit, ViewChild, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from 'src/models/users';
import { UserService } from 'src/services/user.service';
import { ConfirmationService, MessageService } from 'primeng/api';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CardModule } from 'primeng/card';
import { DatePickerModule } from 'primeng/datepicker';
import { FluidModule } from 'primeng/fluid';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { PanelModule } from 'primeng/panel';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-user-view',
   imports: [
   PanelModule,
    CardModule,

    CommonModule,
    FormsModule,
    PanelModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    InputTextModule,
    DialogModule,
    SelectModule,
    TagModule,
    ToastModule,
    TableModule,
    IconFieldModule,
    InputIconModule,
    ToolbarModule,
    DialogModule,
    FluidModule,
    DatePickerModule,
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './user-view.html',
  styleUrl: './user-view.scss'
})
export class UserView implements OnInit {

  displayDialog: boolean = false;
  submitted: boolean = false;
  isUpdate: boolean = false;

  userList = signal<User[]>([]);
  selectedUser = new User();
  createUser = new User();

  private userService = inject(UserService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  @ViewChild('filter') filter!: ElementRef;
loading: unknown;

  ngOnInit(): void {
    this.loadUsers();
  }

  // Charger les utilisateurs
  loadUsers() {
    this.userService.getAll().subscribe({
      next: (data) => {
        this.userList.set(data);
        console.log('Users loaded:', this.userList());
      },
      error: (err) => {
        console.error('Erreur lors du chargement des utilisateurs:', err);
      }
    });
  }

    onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }

  openNew() {
    this.displayDialog = true;
    this.isUpdate = false;
    this.createUser = new User();
  }

  editData(user: User) {
    this.displayDialog = true;
    this.isUpdate = true;
    this.createUser = { ...user };
  }

  hideDialog() {
    this.displayDialog = false;
    this.submitted = false;
    this.createUser = new User();
  }

  saveData() {
    this.submitted = true;

    // Vérifier champs requis
    if (
      !this.createUser.firstName ||
      !this.createUser.lastName ||
      !this.createUser.username ||
      !this.createUser.email ||
      !this.createUser.phone ||
      !this.createUser.address
    ) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Champs requis',
        detail: 'Un des champs obligatoires n’a pas été renseigné.'
      });
      return;
    }

    if (this.isUpdate) {
      // UPDATE
      this.userService.update(this.createUser.id, this.createUser).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Utilisateur mis à jour avec succès'
          });
          this.hideDialog();
          this.loadUsers();
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Impossible de mettre à jour l’utilisateur'
          });
          console.error(err);
        }
      });
    } else {
      // CREATE
      this.userService.create(this.createUser).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Utilisateur créé avec succès'
          });
          this.hideDialog();
          this.loadUsers();
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Impossible de créer l’utilisateur'
          });
          console.error(err);
        }
      });
    }
  }

  deleteData(user: User) {
    this.confirmationService.confirm({
      message: `Voulez-vous vraiment supprimer l’utilisateur <b>${user.firstName} ${user.lastName}</b> ?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.userService.delete(user.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Supprimé',
              detail: 'Utilisateur supprimé avec succès'
            });
            this.loadUsers();
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Impossible de supprimer l’utilisateur'
            });
            console.error(err);
          }
        });
      }
    });
  }
}