import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Notfound } from './app/pages/notfound/notfound';
import { TaskViews } from '@/task-views/task-views';
import { UserView } from '@/user-view/user-view';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
            { path: '', component: TaskViews },
             { path: 'tasks', component: TaskViews },
              { path: 'users', component: UserView },
        ]
    },

    { path: 'notfound', component: Notfound },
    { path: '**', redirectTo: '/notfound' }
];
