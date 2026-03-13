import { useForm, Controller } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Bell, CreditCard, Mail, MessageCircle } from "lucide-react"; // Import icons
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type FormData = {
  emailNotifications: boolean;
  bookingAlerts: boolean;
  paymentAlerts: boolean;
  systemAnnouncements: boolean;
};

export default function NotificationSettings() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      emailNotifications: true,
      bookingAlerts: true,
      paymentAlerts: false,
      systemAnnouncements: true,
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
        </CardHeader>

        <CardContent className="px-0">
          <form
            id="notifications"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {/* Assignment Notification */}
            <div className="flex items-center justify-between bg-transparent border border-[#243b55] rounded-xl p-5">
              <div className="flex gap-3">
                {/* <Mail size={20} className="text-[#7c8db5] mt-1" /> */}
                <div>
                  <label className="text-sm font-medium text-white">
                    Assignment Notification
                  </label>
                </div>
              </div>

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

            {/* New Message */}
            <div className="flex items-center justify-between bg-transparent border border-[#243b55] rounded-xl p-5">
              <div className="flex gap-3">
                {/* <Bell size={20} className="text-[#7c8db5] mt-1" /> */}
                <div>
                  <label className="text-sm font-medium text-white">
                    New Message
                  </label>
                </div>
              </div>

              <Controller
                name="bookingAlerts"
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

            {/* Class Reminder */}
            <div className="flex items-center justify-between bg-transparent border border-[#243b55] rounded-xl p-5">
              <div className="flex gap-3">
                {/* <CreditCard size={20} className="text-[#7c8db5] mt-1" /> */}
                <div>
                  <label className="text-sm font-medium text-white">
                    Class Reminder
                  </label>
                  {/* <p className="text-xs text-[#7c8db5]">
                    Get notified about payment activities
                  </p> */}
                </div>
              </div>

              <Controller
                name="paymentAlerts"
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

            {/* System Announcements */}
            {/* <div className="flex items-center justify-between">
              <div className="flex gap-3">
                <MessageCircle size={20} className="text-[#7c8db5] mt-1" />
                <div>
                  <label className="text-sm font-medium text-white">
                    System Announcements
                  </label>
                  <p className="text-xs text-[#7c8db5]">
                    Receive updates about platform features and changes
                  </p>
                </div>
              </div>

              <Controller
                name="systemAnnouncements"
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </div> */}

            {/* Save Button */}
            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                className="bg-red-500 hover:bg-red-600 text-white px-6 h-10 rounded-xl"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
