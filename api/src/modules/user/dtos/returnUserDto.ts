interface ReturnUserDto {
  id?: number;
  emailChecked?: boolean;
  completeName: string;
  displayName?: string;
  email: string;
  userName: string;
  birthDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: number;
  updatedBy?: number;
}

export default ReturnUserDto;
