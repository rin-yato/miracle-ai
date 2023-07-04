import React from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import Text from "@/components/ui/text";
import { Icons } from "@/components/icons";

export default function CheckEmailPage() {
  return (
    <section className="flex flex-1">
      <div className="m-auto flex max-w-xs flex-col items-center justify-center">
        <Text variant="subheading" className="tracking-tighter">
          Check your Email
        </Text>
        <Text className="mt-2 text-center text-muted-foreground">
          We&apos;ve sent you an email. Click the link in your inbox to verified
          your account.
        </Text>
        <Button asChild className="mt-4">
          <Link
            href="https://mail.google.com/mail/u/0/#inbox"
            referrerPolicy="no-referrer"
          >
            Go to Mail
            <Icons.Mail className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
