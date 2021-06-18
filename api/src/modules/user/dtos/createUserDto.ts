interface CreateUserDto {
  completeName: string;
  displayName?: string;
  email: string;
  password: string;
  userName: string;
  birthDate: string;
}

export default CreateUserDto;
