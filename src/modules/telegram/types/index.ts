export interface UserSession {
  chatId: number;
  location?: string;
  selectedLanguage?: string;
  waitingForLanguage?: boolean;
}
