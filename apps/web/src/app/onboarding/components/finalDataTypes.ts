export interface CreateAccountFinalDataType {
  agencyName: string;
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  agencyPhone: string;
  agencyEmail: string;
  agencyAddress: string;
  ownerPhoto: FileList | undefined;
  agencyLogo: FileList | undefined;
  commissionRate: number;
  agencyState: string;
  agencyCity: string;
  password: string;
  confirmPassword: string;
}

export interface AddVehicleFinalDataType {
  vehicleNumber: string;
  type: string;
  brand: string;
  color: string;
  model: string;
  capacity: number | undefined;
  odometerReading: number | undefined;
  rcPhotos: FileList | undefined;
  vehiclePhotos: FileList | undefined;
  insuranceExpiresOn: Date | undefined;
  pucExpiresOn: Date | undefined;
  insurancePhotos: FileList | undefined;
  pucPhotos: FileList | undefined;
  hasAC: boolean;
  defaultRatePerKm: number | undefined;
  extraAcChargePerDay: number | undefined;
}

export interface AddDriverFinalDataType {
  name: string;
  phone: string;
  email: string;
  driverPhotos: FileList | undefined;
  licenseNumber: string;
  licenseExpiresOn: Date | undefined;
  licensePhotos: FileList | undefined;
  address: string;
  canDriveVehicleTypes: string[];
  defaultAllowancePerDay: number | undefined;
}

export interface AddAgentFinalDataType {
  name: string;
  phone: string;
  email: string;
  agentPhotos: FileList | undefined;
}
