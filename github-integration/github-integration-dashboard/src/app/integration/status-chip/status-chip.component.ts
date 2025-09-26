import { Component, Input } from '@angular/core';
import { IntegrationStatus } from '../integration.service';

@Component({
  selector: 'app-status-chip',
  templateUrl: './status-chip.component.html',
  standalone: false,
  styleUrls: ['./status-chip.component.scss']
})
export class StatusChipComponent {
  @Input() status: IntegrationStatus | null = null;
}
