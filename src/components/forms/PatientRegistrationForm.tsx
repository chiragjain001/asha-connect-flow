import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, Info } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const createPatientSchema = (t: any) => z.object({
  householdId: z.string().min(1, t('required_field_error')),
  fullName: z.string().min(1, t('required_field_error')),
  dateOfBirth: z.date({ required_error: t('required_field_error') }),
  gender: z.string().min(1, t('required_field_error')),
  relationToHead: z.string().min(1, t('required_field_error')),
  mobileNumber: z.string().regex(/^\d{10}$/, t('invalid_mobile_error')).optional().or(z.literal('')),
  village: z.string().min(1, t('required_field_error')),
  abhaId: z.string().regex(/^\d{14}$/, t('invalid_abha_error')).optional().or(z.literal('')),
  aadhaarNumber: z.string().regex(/^\d{12}$/, t('invalid_aadhaar_error')).optional().or(z.literal('')),
  healthStatus: z.string().min(1, t('required_field_error')),
  knownConditions: z.array(z.string()).optional(),
});

type PatientFormData = z.infer<ReturnType<typeof createPatientSchema>>;

interface PatientRegistrationFormProps {
  onSubmit: (data: PatientFormData) => void;
  onCancel: () => void;
}

export const PatientRegistrationForm = ({ onSubmit, onCancel }: PatientRegistrationFormProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const form = useForm<PatientFormData>({
    resolver: zodResolver(createPatientSchema(t)),
    defaultValues: {
      householdId: `HH-${Date.now()}`,
      fullName: "",
      gender: "",
      relationToHead: "",
      mobileNumber: "",
      village: "",
      abhaId: "",
      aadhaarNumber: "",
      healthStatus: "",
      knownConditions: [],
    },
  });

  const handleSubmit = (data: PatientFormData) => {
    toast({
      title: t('patient_registration'),
      description: `${data.fullName} registered successfully`,
    });
    onSubmit(data);
  };

  const conditions = [
    { id: 'diabetes', label: t('cond_diabetes') },
    { id: 'hypertension', label: t('cond_hypertension') },
    { id: 'tb', label: t('cond_tb') },
  ];

  return (
    <TooltipProvider>
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>{t('patient_registration')}</CardTitle>
          <CardDescription>
            Fill in the patient's demographic and health information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Household ID */}
                <FormField
                  control={form.control}
                  name="householdId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        {t('household_id_label')}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-4 h-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{t('tooltip_household_id')}</p>
                          </TooltipContent>
                        </Tooltip>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} readOnly className="bg-muted" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Full Name */}
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('full_name_label')} *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Date of Birth */}
                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>{t('dob_label')} *</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Gender */}
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('gender_label')} *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="female">{t('gender_female')}</SelectItem>
                          <SelectItem value="male">{t('gender_male')}</SelectItem>
                          <SelectItem value="other">{t('gender_other')}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Relation to Head */}
                <FormField
                  control={form.control}
                  name="relationToHead"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('relation_to_head_label')} *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select relation" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="self">{t('rel_self')}</SelectItem>
                          <SelectItem value="spouse">{t('rel_spouse')}</SelectItem>
                          <SelectItem value="son">{t('rel_son')}</SelectItem>
                          <SelectItem value="daughter">{t('rel_daughter')}</SelectItem>
                          <SelectItem value="father">{t('rel_father')}</SelectItem>
                          <SelectItem value="mother">{t('rel_mother')}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Mobile Number */}
                <FormField
                  control={form.control}
                  name="mobileNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('mobile_number_label')}</FormLabel>
                      <FormControl>
                        <Input {...field} type="tel" placeholder="+91 9876543210" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Village */}
                <FormField
                  control={form.control}
                  name="village"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('village_label')} *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* ABHA ID */}
                <FormField
                  control={form.control}
                  name="abhaId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        {t('abha_id_label')}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-4 h-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{t('tooltip_abha_id')}</p>
                          </TooltipContent>
                        </Tooltip>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="91-1234-5678-9012" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Aadhaar Number */}
                <FormField
                  control={form.control}
                  name="aadhaarNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        {t('aadhaar_label')}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-4 h-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{t('tooltip_aadhaar')}</p>
                          </TooltipContent>
                        </Tooltip>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="1234 5678 9012" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Health Status */}
                <FormField
                  control={form.control}
                  name="healthStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('health_status_label')} *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select health status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="pregnant">{t('status_pregnant')}</SelectItem>
                          <SelectItem value="lactating">{t('status_lactating')}</SelectItem>
                          <SelectItem value="child">{t('status_child')}</SelectItem>
                          <SelectItem value="adolescent">{t('status_adolescent')}</SelectItem>
                          <SelectItem value="general">{t('status_general')}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Known Medical Conditions */}
              <FormField
                control={form.control}
                name="knownConditions"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">{t('known_conditions_label')}</FormLabel>
                      <FormDescription>
                        Select any known medical conditions for this patient.
                      </FormDescription>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {conditions.map((condition) => (
                        <FormField
                          key={condition.id}
                          control={form.control}
                          name="knownConditions"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={condition.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(condition.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...(field.value || []), condition.id])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== condition.id
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {condition.label}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 pt-6 border-t">
                <Button type="button" variant="outline" onClick={onCancel}>
                  {t('cancel')}
                </Button>
                <Button type="submit">
                  {t('save')}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};