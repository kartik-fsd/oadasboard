import { useRegistration } from "@/context/RegistrationContext";
import { motion } from "framer-motion";
import { UserCircle, Phone } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export const TaskerForm = () => {
  const { state, dispatch } = useRegistration();
  const { taskerDetails } = state;

  const formatPhoneNumber = (input: string) => {
    const cleaned = input.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
    return match
      ? `${match[1]}${match[2] ? "-" + match[2] : ""}${
          match[3] ? "-" + match[3] : ""
        }`
      : input;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      taskerDetails.name &&
      taskerDetails.phone.replace(/\D/g, "").length === 10
    ) {
      dispatch({ type: "SET_STEP", payload: 1 });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card className="w-full max-w-md mx-auto shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-full mx-auto mb-4">
            <UserCircle className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Tasker Details
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <UserCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  id="name"
                  value={taskerDetails.name}
                  onChange={(e) =>
                    dispatch({
                      type: "UPDATE_TASKER",
                      payload: { name: e.target.value },
                    })
                  }
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  id="phone"
                  value={taskerDetails.phone}
                  onChange={(e) =>
                    dispatch({
                      type: "UPDATE_TASKER",
                      payload: { phone: formatPhoneNumber(e.target.value) },
                    })
                  }
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full"
              disabled={
                !taskerDetails.name ||
                taskerDetails.phone.replace(/\D/g, "").length !== 10
              }
            >
              Next: Seller Details
            </Button>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
};
