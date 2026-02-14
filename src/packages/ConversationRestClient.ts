import { AbstractRestClient } from './AbstractRestClient';
import type { ConversationRequestUrl } from '../lib/types/ConversationRequestUrl';
import type { ConversationRequestFile } from '../lib/types/ConversationRequestFile';
import type { ConversationResponse } from '../lib/types/ConversationResponse';

export class ConversationRestClient extends AbstractRestClient {
  async analyzeConversationUrl(
    request: ConversationRequestUrl,
    options: Record<string, any> = {}
  ): Promise<ConversationResponse> {
    return this._post('/v1/analyze/conversation', request, options);
  }

  async analyzeConversationFile(
    file: File | Buffer,
    options: ConversationRequestFile
  ): Promise<ConversationResponse> {
    const formData = new FormData();
    if (file instanceof Buffer || typeof (file as any).arrayBuffer === 'function') {
      formData.append('file', file);
    } else {
      throw new Error('File parameter must be a Buffer or Blob/File');
    }
    Object.entries(options || {}).forEach(([k, v]) => formData.append(k, v));
    return this._post('/v1/analyze/conversation', formData, {
      ...options,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...(options.headers || {}),
      }
    });
  }

  async getConversationAnalysis(
    conversationId: string,
  ): Promise<ConversationResponse> {
    return this._get(`/v1/analyze/conversation/${encodeURIComponent(conversationId)}`);
  }
}
