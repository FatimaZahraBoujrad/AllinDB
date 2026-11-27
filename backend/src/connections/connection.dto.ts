import {
  IsIn,
  IsInt,
  IsString,
  Length,
  Matches,
  Max,
  Min,
} from 'class-validator';

export class ConnectionDto {
  @IsString()
  @Length(1, 253)
  @Matches(/^[A-Za-z0-9.:-]+$/)
  host!: string;

  @IsInt()
  @Min(1)
  @Max(65535)
  port!: number;

  @IsString()
  @Length(1, 63)
  database!: string;

  @IsString()
  @Length(1, 128)
  username!: string;

  @IsString()
  @Length(1, 1024)
  password!: string;

  @IsIn(['disable', 'require'])
  sslMode!: 'disable' | 'require';
}
