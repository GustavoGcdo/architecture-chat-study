import userRepository from '../../../src/modules/user/repositories/userRepository';

export default function createValidUser() {
  userRepository.create({
    id: 1,
    completeName: 'Thiago Augusto Gonçalves Silva',
    displayName: 'Thiago Augusto',
    birthDate: new Date('2000-07-06'),
    email: 'thiagoggth@gmail.com',
    password: 'passwordFort',
    userName: 'thiagoggth',
    createdAt: new Date()
  });
}
