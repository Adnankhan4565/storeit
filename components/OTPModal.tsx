"use client";
import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import Image from "next/image";
import { Button } from "./ui/button";
import { verifySecret, sendEmailOTP } from "@/lib/actions/user.actions";
import { useRouter } from "next/navigation";

const OTPModal = ({
  accountId,
  email,
}: {
  accountId: string;
  email: string;
}) => {
  const router = useRouter();
  const [isOpen, setisOpen] = useState(true);
  const [password, setpassword] = useState("");
  const [isLoading, setisLoading] = useState(false);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setisLoading(true);
    try {
      // Call to API to verify OTP
      const sessionId = await verifySecret({ accountId, password });
      if (sessionId) router.push("/");
    } catch (error) {
      console.log("Failed to verify OTP", error);
    }

    setisLoading(false);
  };

  const handleResendOTP = async () => {
    // call to api to resend OTP
    await sendEmailOTP({ email });
  };
  return (
    <AlertDialog open={isOpen} onOpenChange={setisOpen}>
      <AlertDialogContent className="shad-alert-dialog">
        <AlertDialogHeader className="relative flex justify-center">
          <AlertDialogTitle className="h2 text-center">
            Enter Your OTP
          </AlertDialogTitle>
          <Image
            src={"/assets/icons/close-dark.svg"}
            width={20}
            height={20}
            onClick={() => setisOpen(false)}
            alt="close icon"
            className="otp-close-button"
          />
          <AlertDialogDescription className="subtitle-2 text-center text-light-100">
            we&apos;ve sent an OTP to{" "}
            <span className="pl-1 text-brand">{email}</span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <InputOTP maxLength={6} value={password} onChange={setpassword}>
          <InputOTPGroup className="shad-otp">
            <InputOTPSlot index={0} className="shad-otp-slot" />
            <InputOTPSlot index={1} className="shad-otp-slot" />
            <InputOTPSlot index={2} className="shad-otp-slot" />
            <InputOTPSlot index={3} className="shad-otp-slot" />
            <InputOTPSlot index={4} className="shad-otp-slot" />
            <InputOTPSlot index={5} className="shad-otp-slot" />
          </InputOTPGroup>
        </InputOTP>

        <AlertDialogFooter>
          <div className="flex w-full flex-col gap-4">
            {" "}
            <AlertDialogAction
              onClick={handleSubmit}
              className="shad-submit-btn h-12"
            >
              Submit
              {isLoading && (
                <Image
                  src={"/assets/icons/loader.svg"}
                  width={24}
                  height={24}
                  alt="loading"
                  className={`ml-2 animate-spin `}
                />
              )}
            </AlertDialogAction>
            <div className="subtitle-2 mt-2 text-center text-light-100">
              Didnt get a code
              <Button
                type="button"
                variant={"link"}
                onClick={handleResendOTP}
                className="pl-1 text-brand"
              >
                Resend OTP
              </Button>
            </div>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default OTPModal;
