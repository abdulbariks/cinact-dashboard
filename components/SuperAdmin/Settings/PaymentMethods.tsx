import { useForm, Controller } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type FormData = {
  stripe: boolean;
  others: boolean;
};

export default function PaymentMethods() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      stripe: true,
      others: false,
    },
  });

  const onSubmit = (data: FormData) => {
    console.log("Notification Settings:", data);
  };

  return (
    <div className="container max-w-3xl mx-auto mb-6 p-4">
      <Card className="bg-[#0a1929] p-6 rounded-2xl text-white border-none">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-lg font-semibold">
            Payment Methods
          </CardTitle>
          <hr className="border-[#243b55] mt-3" />
        </CardHeader>

        <CardContent className="px-0">
          <form
            id="notifications"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {/*  Stripe */}
            <div className="flex items-center justify-between bg-transparent border border-[#243b55] rounded-xl p-5">
              <label className="text-sm font-medium text-white">Stripe</label>
              <Controller
                name="stripe"
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="data-[state=checked]:bg-red-500"
                  />
                )}
              />
            </div>

            {/* Others */}
            <div className="flex items-center justify-between bg-transparent border border-[#243b55] rounded-xl p-5">
              <label className="text-sm font-medium text-white">Others</label>
              <Controller
                name="others"
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="data-[state=checked]:bg-red-500"
                  />
                )}
              />
            </div>
            {/* Save Button */}
            {/* <div className="flex justify-end pt-4">
              <Button
                type="submit"
                className="bg-red-500 hover:bg-red-600 text-white px-6 h-10 rounded-xl"
              >
                Save Changes
              </Button>
            </div> */}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
