import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TranslationServiceClient } from '@google-cloud/translate';

@Injectable()
export class TranslationService {
  private readonly logger = new Logger(TranslationService.name);
  private translationClient: TranslationServiceClient;

  constructor(private configService: ConfigService) {
    try {
      const projectId = this.configService.get<string>('GOOGLE_PROJECT_ID');
      const clientEmail = this.configService.get<string>('GOOGLE_CLIENT_EMAIL');
      const privateKey = this.configService.get<string>('GOOGLE_PRIVATE_KEY');

      if (!projectId || !clientEmail || !privateKey) {
        this.logger.error('Incomplete Translation API credentials:');
        this.logger.error(
          `Project ID: ${projectId ? 'Configured' : 'Not Configured'}`,
        );
        this.logger.error(
          `Client Email: ${clientEmail ? 'Configured' : 'Not configured'}`,
        );
        this.logger.error(
          `Private Key: ${privateKey ? 'Configured' : 'Not Configured'}`,
        );
        throw new Error(
          'Google Cloud credentials are incomplete. Please check environment variables.',
        );
      }

      const formattedPrivateKey = privateKey
        .replace(/\\n/g, '\n')
        .replace(/"$/, '')
        .replace(/^"/, '');

      this.translationClient = new TranslationServiceClient({
        projectId,
        credentials: {
          client_email: clientEmail,
          private_key: formattedPrivateKey,
        },
      });

      this.logger.log('Google Cloud Translation Service Initialized');
    } catch (error) {
      this.logger.error(
        `Error initializing translation service: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async translateText(text: string, targetLanguage: string): Promise<string> {
    if (targetLanguage === 'en') {
      return text;
    }

    try {
      const projectId = this.configService.get<string>('GOOGLE_PROJECT_ID');
      if (!projectId) {
        throw new Error('GOOGLE_PROJECT_ID not set');
      }
      const location = 'global';
      const request = {
        parent: `projects/${projectId}/locations/${location}`,
        contents: [text],
        mimeType: 'text/plain',
        sourceLanguageCode: 'en',
        targetLanguageCode: targetLanguage,
      };

      const [response] = await this.translationClient.translateText(request);

      if (!response?.translations?.[0]?.translatedText) {
        throw new Error('Translation failed: No translation returned');
      }

      return response.translations[0].translatedText;
    } catch (error) {
      this.logger.error(
        `Error translating text: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async translateObject(obj: any, targetLanguage: string): Promise<any> {
    try {
      const translatedObj = JSON.parse(JSON.stringify(obj));

      if (
        translatedObj.recommendations &&
        Array.isArray(translatedObj.recommendations)
      ) {
        translatedObj.recommendations = await Promise.all(
          translatedObj.recommendations.map(async (recommendation: string) => {
            return await this.translateText(recommendation, targetLanguage);
          }),
        );
      }

      if (translatedObj.summary) {
        translatedObj.summary = await this.translateText(
          translatedObj.summary,
          targetLanguage,
        );
      }

      if (translatedObj.currentData?.weather?.description) {
        translatedObj.currentData.weather.description =
          await this.translateText(
            translatedObj.currentData.weather.description,
            targetLanguage,
          );
      }

      if (translatedObj.currentData?.weather?.main) {
        translatedObj.currentData.weather.main = await this.translateText(
          translatedObj.currentData.weather.main,
          targetLanguage,
        );
      }

      if (translatedObj.currentData?.wind?.direction) {
        translatedObj.currentData.wind.direction = await this.translateText(
          translatedObj.currentData.wind.direction,
          targetLanguage,
        );
      }

      if (translatedObj.classifications) {
        const classificationEntries = Object.entries(
          translatedObj.classifications,
        );

        await Promise.all(
          classificationEntries.map(async ([key, value]) => {
            if (typeof value === 'string') {
              translatedObj.classifications[key] = await this.translateText(
                value as string,
                targetLanguage,
              );
            }
          }),
        );
      }

      if (
        translatedObj.alerts?.items &&
        Array.isArray(translatedObj.alerts.items) &&
        translatedObj.alerts.items.length > 0
      ) {
        await Promise.all(
          translatedObj.alerts.items.map(async (alert) => {
            if (alert.type) {
              alert.type = await this.translateText(alert.type, targetLanguage);
            }

            if (alert.description) {
              alert.description = await this.translateText(
                alert.description,
                targetLanguage,
              );
            }

            if (alert.categories && Array.isArray(alert.categories)) {
              alert.categories = await Promise.all(
                alert.categories.map(async (category: string) => {
                  return await this.translateText(category, targetLanguage);
                }),
              );
            }

            if (alert.source) {
              alert.source = await this.translateText(
                alert.source,
                targetLanguage,
              );
            }

            if (alert.severity) {
              alert.severity = await this.translateText(
                alert.severity,
                targetLanguage,
              );
            }
          }),
        );
      }

      return translatedObj;
    } catch (error) {
      this.logger.error(
        `Error translating object: ${error.message}`,
        error.stack,
      );

      // Continue retornando o objeto original sem tradução em caso de erro (A IA de tradução do Google pode falhar)
      this.logger.warn(
        'Returning object in original language due to translation error',
      );
      return obj;
    }
  }
}
