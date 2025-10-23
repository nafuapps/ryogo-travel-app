//Dashboard home page

import { mainClassName } from "@/components/page/pageCommons";
import DashboardHomePageComponent from "./dashboardHome";
import DashboardHeader from "./components/extra/dashboardHeader";

export default async function DashboardHomePage() {
  return (
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard"} />
      <DashboardHomePageComponent />;
    </div>
  );
}
