"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { saveSettingsMock } from "@/services/api";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  organizationName: z.string().min(2, "Organization name must be at least 2 characters."),
  chatbotName: z.string().min(2, "Chatbot name must be at least 2 characters."),
  aiModel: z.string(),
  temperature: z.coerce.number().min(0).max(1),
  theme: z.string(),
});

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      organizationName: "Dexra Inc.",
      chatbotName: "Dexra Assist",
      aiModel: "gpt-4-turbo",
      temperature: 0.7,
      theme: "light",
    },
  });

  const onSubmit = async (values) => {
    setIsSaving(true);
    try {
      await saveSettingsMock(values);
      toast.success("Settings saved successfully.");
    } catch (error) {
      toast.error("Failed to save settings.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your dashboard preferences and AI configurations.
        </p>
      </div>

      <Separator />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          
          {/* General Settings */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>General</CardTitle>
              <CardDescription>
                Basic organization and platform settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="organizationName"
                render={({ field }) => (
                  <FormItem className="max-w-md">
                    <FormLabel>Organization Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="chatbotName"
                render={({ field }) => (
                  <FormItem className="max-w-md">
                    <FormLabel>Default Chatbot Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      This is the name your users will see when interacting with the chatbot.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* AI Settings */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>AI Configuration</CardTitle>
              <CardDescription>
                Tune the underlying language model and its behavior.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="aiModel"
                render={({ field }) => (
                  <FormItem className="max-w-md">
                    <FormLabel>AI Model</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an AI model" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                        <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                        <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="temperature"
                render={({ field }) => (
                  <FormItem className="max-w-md">
                    <FormLabel>Temperature ({field.value})</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-4">
                        <input 
                          type="range" 
                          min="0" 
                          max="1" 
                          step="0.1" 
                          className="w-full accent-primary" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Higher values make output more random, lower values make it more focused and deterministic.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Appearance Settings */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize the look and feel of your dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="theme"
                render={({ field }) => (
                  <FormItem className="max-w-md">
                    <FormLabel>Theme</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a theme" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="light">Light Theme</SelectItem>
                        <SelectItem value="dark">Dark Theme (Coming soon)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Currently, only the light theme is available in this version.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving changes..." : "Save Settings"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
