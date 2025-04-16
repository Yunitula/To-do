import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";


export class FilterUserDto {
  @ApiProperty({ required: false })
  @IsOptional()
  page: number;

  @ApiProperty({ required: false })
  @IsOptional()
  limit: number;

  @ApiProperty({ required: false })
  @IsOptional()
  search: string;

  @ApiProperty({ required: false , description:'updatedAt' })
  @IsOptional()
  sortKey: string;

  @ApiProperty({ required: false, description:'DESC/ASC' })
  @IsOptional()
  sort: string;

}