import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class GeolocationService {
  private geocoder;

  constructor() {
    const NodeGeocoder = require('node-geocoder');

    this.geocoder = NodeGeocoder({
      provider: 'openstreetmap',
    });
  }

  // Função do geocoder para obter as coordenadas a partir de um endereço fornecido
  async getCoordinatesFromAddress(address: string) {
    try {
      const res = await this.geocoder.geocode(address);

      if (res.length === 0) {
        throw new HttpException('Location not found', HttpStatus.NOT_FOUND);
      }

      // Salva a primeira entrada do resultado do geocoder
      const formattedAddress = res[0].formattedAddress;

      // Extrai apenas a primeira parte do endereço antes da vírgula
      // Exemplo: "Rua da Consolação, Consolação, 100..." -> "Rua da Consolação"
      // É importante ser bem exato ao especificar o endereco, pois o geocoder pode retornar resultados inesperados
      const addressName = formattedAddress.split(',')[0].trim();

      return {
        latitude: res[0].latitude,
        longitude: res[0].longitude,
        address: addressName,
      };
    } catch (error) {
      throw new HttpException(
        `Error fetching coordinates: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
