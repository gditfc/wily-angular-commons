import {Component, Input, OnInit} from '@angular/core';

/**
 * Component to display different endpoint states
 */
@Component({
  selector: 'wily-endpoint-state',
  templateUrl: './endpoint-state.component.html',
  styleUrls: ['./endpoint-state.component.css']
})
export class EndpointStateComponent implements OnInit {

  /**
   * Flag to determine if in loading state
   */
  @Input()
  loading: boolean;

  /**
   * Icon for loading state
   */
  @Input()
  loadingIcon = 'fas fa-cog fa-fw fa-pulse fa-3x';

  /**
   * Flag to determine if in empty state
   */
  @Input()
  empty: boolean;

  /**
   * Icon for empty state
   */
  @Input()
  emptyIcon = 'fas fa-folder-open fa-fw fa-3x';

  /**
   * Text for loading state
   */
  @Input()
  emptyText = 'There\'s nothing here yet.';

  /**
   * Subtext for empty state
   */
  @Input()
  emptySubtext: string;

  /**
   * Flag to determine if in error state
   */
  @Input()
  error: boolean;

  /**
   * Flag to determine if overlay spinner
   */
  @Input()
  overlay: boolean;

  /**
   * The icon on the overlay spinner
   */
  @Input()
  overlayIcon = 'fas fa-spinner fa-spin';

  /**
   * Component constructor
   */
  constructor() { }

  /**
   * Initialize the component
   */
  ngOnInit(): void {
  }

}
