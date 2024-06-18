import { onMounted, onUnmounted, ref } from 'vue';
import io, { Socket } from 'socket.io-client';

type Message = {
  status: 'streaming' | 'completed' | 'idle';
  data?: {
    message?: string;
    vectorStoreCollectionName?: string;
    sources?: Array<{ url: string; score: number }>;
    debug?: Record<any, any>;
  };
};

type Params = {
  apiUrl?: string;
  vectorStoreCollectionName?: string;
  externalSourceBaseUrl?: string;
  receiveMessageCallback?: () => void;
};

const defaultParams = ref<Params>({
  apiUrl: undefined,
  vectorStoreCollectionName: undefined,
  externalSourceBaseUrl: undefined,
  receiveMessageCallback: undefined,
});

export function useChat(params?: Params) {
  if (params) {
    defaultParams.value = { ...params };
  }

  const {
    apiUrl,
    vectorStoreCollectionName,
    externalSourceBaseUrl,
    receiveMessageCallback,
  } = defaultParams.value;

  let socket: Socket;
  const pending = ref(false);
  const connected = ref(true);
  const userMessage = ref('');
  const messages = ref<
    {
      role: string;
      message: string;
      sources?: { url: string; score: number }[];
      debug?: Record<any, any>;
    }[]
  >([]);

  onMounted(() => {
    socket = io(apiUrl!);

    socket.on('connect', () => {
      connected.value = true;
    });

    socket.on('disconnect', () => {
      connected.value = false;
    });

    socket.on('message', (message: Message) => {
      const status = message.status;
      const data = message.data;

      if (status === 'idle') {
        pending.value = false;
        return;
      }

      if (status === 'completed') {
        // @ts-ignore
        messages.value.at(-1).sources = data?.sources?.slice(0, 3);
        runCallback();
        return;
      }

      if (status === 'streaming') {
        if (data?.debug?.question) {
          console.info(data.debug.question);
          return;
        }
        if (data?.debug?.documents) {
          console.info(data.debug.documents);
          return;
        }
        // @ts-ignore
        messages.value.at(-1).message =
          // @ts-ignore
          messages.value.at(-1).message + data?.message;
        runCallback();
        return;
      }
    });
  });

  onUnmounted(() => {
    socket.off('connect');
    socket.off('disconnect');
    socket.off('message');
  });

  const getDocUrl = (doc: string) =>
    `${externalSourceBaseUrl}/${doc}`.replace('/index.md', '');

  const getDocName = (inputString: string): string => {
    // @ts-ignore
    return inputString
      .replace('/index.md', '')
      .split('/')
      .at(-2)
      .split('-')
      .map((word: string) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(' ');
  };

  const runCallback = () => {
    if (
      receiveMessageCallback &&
      typeof receiveMessageCallback === 'function'
    ) {
      receiveMessageCallback();
    }
  };

  const query = async (e: KeyboardEvent) => {
    e.preventDefault();

    if (!messages.value) {
      return;
    }

    pending.value = true;

    messages.value.push({ role: 'user', message: userMessage.value });

    const message = userMessage.value;

    userMessage.value = '';

    runCallback();

    try {
      messages.value.push({ role: 'assistant', message: '', sources: [] });

      socket.emit('message', {
        status: 'streaming',
        data: { message, vectorStoreCollectionName },
      } as Message);
    } catch {
      console.error('Failed to fetch response');
      messages.value.pop();
    }
  };

  const reset = () => {
    socket.disconnect();
    socket.connect();
    messages.value = [];
    userMessage.value = '';
  };

  return {
    pending,
    userMessage,
    messages,
    query,
    getDocUrl,
    getDocName,
    reset,
  };
}
