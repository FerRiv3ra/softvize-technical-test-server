/**
 * Represents a paginated response containing a subset of data and pagination metadata.
 *
 * @template T The type of the items in the paginated data array.
 */
export class Page<T> {
  /**
   * The total number of pages available based on the total count and page size.
   */
  public readonly totalPages: number;

  /**
   * Creates an instance of the Page class.
   *
   * @param data The array of items for the current page.
   * @param totalCount The total number of items across all pages.
   * @param currentPage The current page number (1-based index).
   * @param pageSize The number of items per page.
   */
  constructor(
    public readonly data: T[],
    public readonly totalCount: number,
    public readonly currentPage: number,
    public readonly pageSize: number,
  ) {
    this.totalPages = Math.ceil(this.totalCount / this.pageSize);
  }
}
