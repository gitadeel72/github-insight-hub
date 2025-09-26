import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IntegrationComponent } from './integration.component';
import { ReposComponent } from './repos/repos.component';
import { CommitsComponent } from './commits/commits.component';
import { PullsComponent } from './pulls/pulls.component';
import { IssuesComponent } from './issues/issues.component';
import { UsersComponent } from './users/users.component';
import { IntegrationConnectedGuard } from './integration-connected.guard';
import { OrgsComponent } from './orgs/orgs.component';
const routes: Routes = [
  {
    path: '',
    component: IntegrationComponent,
    children: [
      { path: 'orgs', component: OrgsComponent },
      { path: 'repos', component: ReposComponent },
      {
        path: 'repos/:id',
        component: ReposComponent, // acts as a parent shell
        children: [
          { path: 'commits', component: CommitsComponent },
          { path: 'pulls', component: PullsComponent },
          { path: 'issues', component: IssuesComponent },
          { path: 'users', component: UsersComponent },
          { path: '', redirectTo: 'commits', pathMatch: 'full' }
        ]
      },
      { path: '', redirectTo: 'repos', pathMatch: 'full' }
    ]
  }
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IntegrationRoutingModule {}
