import userRepository from '../../../src/modules/_shared/repositories/user.repository';

export default function createValidUser() {
  userRepository.add({
    name: 'Thiago',
    socketId: 'asdaerfaf'
  });
}
