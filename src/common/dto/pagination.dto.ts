import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

enum SortOrder {
  asc = 'asc',
  desc = 'desc',
}

/**
 * Data Transfer Object for pagination and sorting queries.
 * Supports page, limit, skip, sort, sortOrder, and filter options.
 */
export class PaginationDto {
  /**
   * Page number (starts from 1).
   */
  @ApiProperty({
    example: 1,
    required: false,
    minimum: 1,
    description: 'Page number (starts from 1)',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  page: number = 1;

  /**
   * Number of items per page (max 100).
   */
  @ApiProperty({
    example: 10,
    required: false,
    minimum: 1,
    maximum: 100,
    description: 'Items per page (max 100)',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 10;

  /**
   * Number of items to skip (for advanced pagination).
   */
  @ApiProperty({
    example: 0,
    required: false,
    description: 'Number of items to skip',
  })
  @IsOptional()
  skip?: number;

  /**
   * Field to sort by.
   */
  @ApiProperty({
    example: 'createdAt',
    required: false,
    description: 'Field to sort by',
  })
  @IsOptional()
  @IsString()
  sort: string = 'createdAt';

  /**
   * Sort order: asc or desc.
   */
  @ApiProperty({
    example: 'desc',
    required: false,
    enum: SortOrder,
    description: 'Sort order',
  })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder: SortOrder = SortOrder.desc;

  /**
   * Filter string for search or filtering.
   */
  @ApiProperty({
    example: '{"status":"active"}',
    required: false,
    description: 'Filter string for search or filtering',
  })
  @IsOptional()
  filter?: string;
}
