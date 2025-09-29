export type CreateDriverType = {
  agencyId: string;
  userId: string;
  name: string;
  phone: string;
  address: string;
  licenseNumber: string;
  licenseExpiresOn: string;
  canDriveVehicleTypes: string[];
  defaultAllowancePerDay?: number;
};
