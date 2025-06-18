export interface AddressFormType {
  id?: string;
  street: string;
  street2?: string;
  unitNumber?: string;
  postalCode: string;
  state: string;
  country: string;
  city: string;
  phonePrefix: string;
  phone: string;
  contactName: string;
  companyName: string;
  addressType: string;
  userId?: string;
  tenantId?: string;
  isDefault: Boolean;
  stateName: string;
  countryName: string;
  cityName: string;
}
