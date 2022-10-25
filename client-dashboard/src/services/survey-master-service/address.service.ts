import APIService from './base.service';
import { AddressFormType } from '../../type';
import axios from 'axios';

export default class AddressService {
  static getAddresses(params: {
    addressType: string;
    id: string;
  }): Promise<any> {
    return APIService.get('user-address', { params });
  }

  static deleteAddress(payload: {
    addressId: string;
    tenantId?: string;
    userId?: string | null;
  }): Promise<any> {
    const { addressId, tenantId, userId } = payload;
    return APIService.delete(`user-address/${addressId}`, {
      params: { tenantId, userId },
    });
  }

  static updateAddress(payload: AddressFormType): Promise<any> {
    const { id } = payload;

    return APIService.put(`user-address/${id}`, payload);
  }

  static createAddress(payload: AddressFormType): Promise<any> {
    return APIService.post('user-address', payload);
  }

  static getAllCountries(): Promise<any> {
    return APIService.get('https://api.countrystatecity.in/v1/countries');
  }

  static getStatesByCountry(code: string): Promise<any> {
    return APIService.get(
      `https://api.countrystatecity.in/v1/countries/${code}/states`,
    );
  }

  static getCitiesByCountryAndState(payload: {
    countryCode: string;
    stateCode: string;
  }): Promise<any> {
    const { countryCode, stateCode } = payload;
    return APIService.get(
      `https://api.countrystatecity.in/v1/countries/${countryCode}/states/${stateCode}/cities`,
    );
  }

  static getCountryCode(): Promise<any> {
    return axios.get('http://ip-api.com/json');
  }
}
