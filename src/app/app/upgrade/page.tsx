import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PricingTable } from "@/services/clerk/components/pricing-table";
import { AlertTriangle } from "lucide-react";

const UpgradePage = () => {
  return (
    <div className="container mx-auto py-4 max-w-6xl">
      <div className="space-y-8">
        <Alert variant="warning">
          <AlertTriangle />
          <AlertTitle>Plan Limit Reached</AlertTitle>
          <AlertDescription>
            You have reached the limit of your current plan. Please upgrade to
            continue using all features.
          </AlertDescription>
        </Alert>
        <PricingTable />
      </div>
    </div>
  );
};

export default UpgradePage;
