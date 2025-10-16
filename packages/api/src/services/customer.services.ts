import { customerRepository } from "../repositories/customer.repo";

export const customerServices = {
  async findCustomerByPhoneInAgency(phone: string, agencyId: string) {
    const customer = await customerRepository.getCustomerByPhoneAgencyId(
      phone,
      agencyId
    );
    if (!customer) {
      return null;
    }
    return {
      id: customer?.id,
      name: customer?.name,
      phone: customer?.phone,
      remarks: customer?.remarks,
      location: customer?.location.city + ", " + customer?.location.state,
    };
  },
};
