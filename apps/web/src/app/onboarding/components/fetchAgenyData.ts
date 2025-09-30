import { apiClient } from "@ryogo-travel-app/api/client/apiClient";
import { OnboardingCheckAgencyDataAPIResponseType } from "@ryogo-travel-app/api/types/agency.types";
import { redirect, RedirectType } from "next/navigation";

export async function fetchAgenyData(agencyId: string, currentPage: string) {
  const data = await apiClient<OnboardingCheckAgencyDataAPIResponseType>(
    `/api/onboarding/check-agency-data/${agencyId}`,
    {
      method: "GET",
    }
  );

  if (currentPage == "add-vehicle") {
    if (data.vehicles.length < 1) {
      return;
    }
    if (data.drivers.length < 1) {
      redirect("/onboarding/add-driver", RedirectType.replace);
    }
    if (data.agents.length < 1) {
      redirect("/onboarding/add-agent", RedirectType.replace);
    }
    redirect("/dashboard", RedirectType.replace);
  }

  if (currentPage == "add-driver") {
    if (data.vehicles.length < 1) {
      redirect("/onboarding/add-vehicle", RedirectType.replace);
    }
    if (data.drivers.length < 1) {
      return;
    }
    if (data.agents.length < 1) {
      redirect("/onboarding/add-agent", RedirectType.replace);
    }
    redirect("/dashboard", RedirectType.replace);
  }

  if (currentPage == "add-agent") {
    if (data.vehicles.length < 1) {
      redirect("/onboarding/add-vehicle", RedirectType.replace);
    }
    if (data.drivers.length < 1) {
      redirect("/onboarding/add-driver", RedirectType.replace);
    }
    if (data.agents.length < 1) {
      return;
    }
    redirect("/dashboard", RedirectType.replace);
  }
}
