import { ListenClient } from './packages/ListenClient';
import { SpeakClient } from './packages/SpeakClient';
import { ReadClient } from './packages/ReadClient';
import { ConversationClient } from './packages/ConversationClient';

export class DeepgramClient {
  public readonly listen: ListenClient;
  public readonly speak: SpeakClient;
  public readonly read: ReadClient;
  public readonly conversation: ConversationClient;

  constructor(auth: string) {
    this.listen = new ListenClient(auth);
    this.speak = new SpeakClient(auth);
    this.read = new ReadClient(auth);
    this.conversation = new ConversationClient(auth);
  }
}
