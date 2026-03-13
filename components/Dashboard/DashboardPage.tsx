import { Notebook } from "lucide-react";
import StatCards from "./StateCards";
import DashboardUserTable from "./DashboardUserTable";

function DashboardPage() {
  const statCards = [
    {
      title: "Pre Application",
      value: 195,
      percentage: "0.1%",
    },
    {
      title: "Application Started",
      value: 7,
      percentage: "0.8%",
    },
    {
      title: "Applied",
      value: 18,
      percentage: "1.5%",
    },
    {
      title: "Inactive",
      value: 635,
      percentage: "72.6%",
    },
  ];
  return (
    <div className="flex flex-col justify-between h-full">
      <div>
        <div className="flex flex-col md:flex-row items-center justify-between mb-4">
          <h3 className="text-lg md:text-xl font-semibold text-blackColor">
            Status Statistics
          </h3>
          <div className="flex gap-2 md:gap-4 items-center">
            <button className="flex items-center md:px-4 px-2 py-2 md:py-3 text-sm md:text-base cursor-pointer rounded-md gap-2 border border-gray2Color ">
              <Notebook /> View Application Form
            </button>
          </div>
        </div>
        <StatCards statCards={statCards} />
      </div>

      <div className="mt-10">
        <DashboardUserTable />
      </div>
    </div>
  );
}

export default DashboardPage;
