import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { IntegrationRoutingModule } from './integration-routing.module';

// Components
import { IntegrationComponent } from './integration.component';
import { ConnectPanelComponent } from './connect-panel/connect-panel.component';
import { StatusChipComponent } from './status-chip/status-chip.component';
import { OrgsComponent } from './orgs/orgs.component';
import { ReposComponent } from './repos/repos.component';
import { CommitsComponent } from './commits/commits.component';
import { PullsComponent } from './pulls/pulls.component';
import { IssuesComponent } from './issues/issues.component';
import { UsersComponent } from './users/users.component';

// Material + AG Grid
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AgGridModule } from 'ag-grid-angular';

// Interceptor (optional)
import { AuthInterceptor } from './auth.interceptor';
import { UserInterceptor } from './user.interceptor';
import { MatTabsModule } from '@angular/material/tabs';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
ModuleRegistry.registerModules([AllCommunityModule]);



@NgModule({
  declarations: [
    IntegrationComponent,
    ConnectPanelComponent,
    StatusChipComponent,
    OrgsComponent,
    ReposComponent,
    CommitsComponent,
    PullsComponent,
    IssuesComponent,
    UsersComponent
  ],
  imports: [
    CommonModule,FormsModule,
    IntegrationRoutingModule,
    MatButtonModule, MatIconModule, MatCardModule, MatExpansionModule,
    MatSnackBarModule, MatChipsModule, MatTooltipModule, MatProgressSpinnerModule,
    AgGridModule,MatTabsModule,MatProgressBarModule,MatInputModule,MatFormFieldModule,MatSelectModule,
  ],
providers: [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: UserInterceptor, multi: true }
]

})
export class IntegrationModule {}
