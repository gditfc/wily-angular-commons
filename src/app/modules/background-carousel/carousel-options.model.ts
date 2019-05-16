/**
 * Carousel Options for the Background Carousel Directive
 */
export class CarouselOptions {
  /**
   * Image locations to loop through
   */
  images: string[];

  /**
   * Transition Time (in seconds)
   */
  transitionTime: number;

  /**
   * Length of Time to display each background (in seconds)
   */
  viewTime: number;

  /**
   * Whether or not to reset the interval on init.
   */
  resetInterval: boolean;

  /**
   * Constructor to help with initializing the associated directive
   *
   * @param images
   * @param transitionTime
   * @param viewTime
   * @param resetInterval
   */
  constructor(images: string[], transitionTime: number, viewTime: number, resetInterval: boolean) {
    this.images = images;
    this.transitionTime = transitionTime;
    this.viewTime = viewTime;
    this.resetInterval = resetInterval;
  }
}
