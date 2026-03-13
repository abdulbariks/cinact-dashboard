import { useForm, Controller } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type FormData = {
  emailNotifications: boolean;
  smsNotification: boolean;
  newStudentRegistration: boolean;
  paymentReceived: boolean;
  newMessage: boolean;
  eventReminder: boolean;
};

export default function NotificationSettings() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      emailNotifications: true,
      smsNotification: false,
      newStudentRegistration: true,
      paymentReceived: false,
      newMessage: true,
      eventReminder: false,
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
            Notification Preferences
          </CardTitle>
          <hr className="border-[#243b55] mt-3" />
        </CardHeader>

        <CardContent className="px-0">
          <form
            id="notifications"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {/*  Email Notification */}
            <div className="flex items-center justify-between bg-transparent border border-[#243b55] rounded-xl p-5">
              <label className="text-sm font-medium text-white">
                Email Notification
              </label>
              <Controller
                name="emailNotifications"
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

            {/* SMS Notification */}
            <div className="flex items-center justify-between bg-transparent border border-[#243b55] rounded-xl p-5">
              <label className="text-sm font-medium text-white">
                SMS Notification
              </label>
              <Controller
                name="smsNotification"
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

            {/* New Student Registration */}
            <div className="flex items-center justify-between bg-transparent border border-[#243b55] rounded-xl p-5">
              <label className="text-sm font-medium text-white">
                New Student Registration
              </label>
              <Controller
                name="newStudentRegistration"
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
            {/* Payment Received */}
            <div className="flex items-center justify-between bg-transparent border border-[#243b55] rounded-xl p-5">
              <label className="text-sm font-medium text-white">
                Payment Received
              </label>
              <Controller
                name="paymentReceived"
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
            {/* New Message */}
            <div className="flex items-center justify-between bg-transparent border border-[#243b55] rounded-xl p-5">
              <label className="text-sm font-medium text-white">
                New Message
              </label>
              <Controller
                name="newMessage"
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
            {/* Event Reminder */}
            <div className="flex items-center justify-between bg-transparent border border-[#243b55] rounded-xl p-5">
              <label className="text-sm font-medium text-white">
                Event Reminder
              </label>
              <Controller
                name="eventReminder"
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
