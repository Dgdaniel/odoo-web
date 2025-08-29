import { Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';

import { PanelModule } from 'primeng/panel';
import { CardModule } from 'primeng/card';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { SelectModule } from 'primeng/select';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { Table, TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Task } from 'src/models/task';
import { ToolbarModule } from 'primeng/toolbar';
import { FluidModule } from 'primeng/fluid';
import { UserService } from 'src/services/user.service';
import { User } from 'src/models/users';
import { DatePickerModule } from 'primeng/datepicker';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-task-views',
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
  templateUrl: './task-views.html',
  styleUrl: './task-views.scss'
})
export class TaskViews implements OnInit {

  displayDialog: boolean = false;
  createTask: Task = new Task()
  isUpdate: boolean = false;
  currentDate: Date = new Date()



  private taskService = inject(TaskService)
  private userService = inject(UserService)

  private messageService = inject(MessageService)
  private ConfirmationService = inject(ConfirmationService)


  public selectedTask = new Task();
  searchValue: string = ''
  taskList = signal<Task[]>([]);
  userList = signal<User[]>([]);
  loading: unknown;





  priorityList = [
    {
      "title": "Low",
      "value": "LOW"
    },
    {
      "title": "Medium",
      "value": "MEDIUM"
    },
    {
      "title": "High",
      "value": "HIGH"
    }
  ]

  statusList = [
    {
      "title": "Todo",
      "value": "TODO"
    },
    {
      "title": "In Progress",
      "value": "IN_PROGRESS"
    },
    {
      "title": "On Hold",
      "value": "ON_HOLD"
    },
    {
      "title": "Under Review",
      "value": "UNDER_REVIEW"
    },
    {
      "title": "Testing",
      "value": "TESTING"
    },
    {
      "title": "Done",
      "value": "DONE"
    },
    {
      "title": "Cancelled",
      "value": "CANCELLED"
    },
    {
      "title": "Blocked",
      "value": "BLOCKED"
    }
  ]

  @ViewChild('filter') filter!: ElementRef;
  submitted: any;

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }

  ngOnInit(): void {
    this.loadTasks()

    this.userService.getAll().subscribe({
      next: (data) => {
        this.userList.set(data)
        console.log(data);
        
        console.log('Users loaded:', this.userList());
      },
      error: (err) => {
        console.error('Erreur lors du chargement des tâches:', err);
      }
    });
  }

  getSeverity(status: string) {
    // Gestion des statuts
    switch (status) {
      case 'DONE':
        return 'success';

      case 'TODO':
      case 'IN_PROGRESS':
      case 'ON_HOLD':
      case 'UNDER_REVIEW':
      case 'TESTING':
        return 'warn';

      case 'CANCELLED':
      case 'cancelled':
      case 'BLOCKED':
        return 'danger';

      default:
        return 'info';
    }
  }

  getPriority(priority?: string) {
    // Gestion des priorites
    if (priority) {
      switch (priority) {
        case 'HIGH':
          return 'danger';
        case 'MEDIUM':
          return 'warn';
        case 'LOW':
          return 'info';
        default:
          return 'info';
      }
    }
    return 'info';
  }
  openNew() {
    this.displayDialog = true;
    this.createTask = new Task()
    this.createTask.status = "TODO"
    this.createTask.priority = "LOW"
  }
  deleteData(_task: Task) {

  }
  editData(_task: Task) {
    this.displayDialog = true
    this.isUpdate = true;
    this.createTask = {..._task}
    this.createTask.priority = _task.priority
    this.createTask.status = _task.status
    this.createTask.deadline = new Date(_task.deadline ? _task.deadline : new Date())
    this.createTask.userId = _task.user.id;

  }

  hideDialog() {
    this.displayDialog = false;
    this.createTask = new Task();
  }

  saveData() {
  this.submitted = true;
  let foundUser = this.userList().find(el => el.id == this.createTask.userId)

  if (
  !this.createTask.title ||
  !this.createTask.status ||
  // !this.createTask.user ||
  !this.createTask.priority ||
  !this.createTask.description ||
  !this.createTask.deadline
) {
  this.messageService.add({
    severity: 'warn',
    summary: 'Champs requis',
    detail: 'Un des champs obligatoires n’a pas été renseigné.'
  });
  return;
}

  if (this.isUpdate) {
    console.log("this.isUpdate ", this.createTask);
    
    this.taskService.update(this.createTask.id, this.createTask).subscribe({
      next: (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Succès',
          detail: 'Tâche mise à jour avec succès'
        });
        this.hideDialog();
        this.loadTasks();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de mettre à jour la tâche'
        });
        console.error(err);
      }
    });
  } else {
    // Mode CREATE
    this.taskService.create(this.createTask).subscribe({
      next: (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Succès',
          detail: 'Tâche créée avec succès'
        });
        this.hideDialog();
        this.loadTasks(); 
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de créer la tâche'
        });
        console.error(err);
      }
    });
  }
}
 loadTasks(){
 this.taskService.getAll().subscribe({
      next: (data) => {
        this.taskList.set(data);
        this.taskList().map(el => ({ ...el, deadline: new Date(el.deadline!) }))
        console.log('Tasks loaded:', this.taskList());
      },
      error: (err) => {
        console.error('Erreur lors du chargement des tâches:', err);
      }
    });
 }

}
