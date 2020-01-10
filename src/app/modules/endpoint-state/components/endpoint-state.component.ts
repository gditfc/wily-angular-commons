import {Component, Input, OnInit} from '@angular/core';

/**
 * Component to display different endpoint states
 */
@Component({
  selector: 'wily-endpoint-state',
  templateUrl: './endpoint-state.component.html'
})
export class EndpointStateComponent implements OnInit {

  /**
   * Flag to determine if in loading state
   */
  @Input()
  loading: boolean;

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
   * Component constructor
   */
  constructor() { }

  /**
   * Initialize the component
   */
  ngOnInit(): void {
  }

}
