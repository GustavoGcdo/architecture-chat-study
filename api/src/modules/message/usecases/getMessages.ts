import IUseCase from '../../_shared/IUseCase';
import messageRepository from '../repositories/messageRepository';

class GetMessages implements IUseCase {
  handle() {
    return messageRepository.get();
  }
}

export default GetMessages;
