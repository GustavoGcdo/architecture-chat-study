interface CreateUserDto {
  completeName: string;
  displayName?: string;
  email: string;
  password: string;
  userName: string;
  birthDate: Date;
}

export default CreateUserDto;
