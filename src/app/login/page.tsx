import { Wrench } from "lucide-react";

import { LoginForm } from "@/components/auth/login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="items-center text-center">
          <CardTitle className="flex items-center justify-center gap-2 font-mono text-xl font-bold tracking-tight">
            <Wrench className="text-brand size-5 shrink-0" />
            Hardware Hub
          </CardTitle>
          <CardDescription>Sign in to manage equipment</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
