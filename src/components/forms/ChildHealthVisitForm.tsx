import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
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

const createChildHealthSchema = (t: any) => z.object({
  visitDate: z.date({ required_error: t('required_field_error') }),
  weight: z.string().min(1, t('required_field_error')),
  height: z.string().min(1, t('required_field_error')),
  immunizationStatus: z.record(z.string()).optional(),
  feedingStatus: z.string().min(1, t('required_field_error')),
  dangerSigns: z.array(z.string()).optional(),
  referredToPHC: z.boolean().default(false),
});

type ChildHealthData = z.infer<ReturnType<typeof createChildHealthSchema>>;

interface ChildHealthVisitFormProps {
  patientName?: string;
  onSubmit: (data: ChildHealthData) => void;
  onCancel: () => void;
}

export const ChildHealthVisitForm = ({ patientName, onSubmit, onCancel }: ChildHealthVisitFormProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const form = useForm<ChildHealthData>({
    resolver: zodResolver(createChildHealthSchema(t)),
    defaultValues: {
      weight: "",
      height: "",
      immunizationStatus: {},
      feedingStatus: "",
      dangerSigns: [],
      referredToPHC: false,
    },
  });

  const handleSubmit = (data: ChildHealthData) => {
    toast({
      title: t('child_health_visit'),
      description: `Visit recorded for ${patientName || 'child'}`,
    });
    onSubmit(data);
  };

  const immunizations = [
    { id: 'bcg', label: t('imm_bcg') },
    { id: 'opv', label: t('imm_opv') },
    { id: 'penta', label: t('imm_penta') },
    { id: 'measles', label: t('imm_measles') },
  ];

  const immunizationOptions = [
    { value: 'given_today', label: t('opt_given_today') },
    { value: 'already_given', label: t('opt_already_given') },
    { value: 'due', label: t('opt_due') },
  ];

  const dangerSigns = [
    { id: 'fever', label: t('danger_child_fever') },
    { id: 'diarrhea', label: t('danger_child_diarrhea') },
    { id: 'fast_breathing', label: t('danger_child_fast_breathing') },
    { id: 'lethargy', label: t('danger_child_lethargy') },
  ];

  return (
    <TooltipProvider>
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>{t('child_health_visit')}</CardTitle>
          <CardDescription>
            {patientName && `Recording visit for ${patientName}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Visit Date */}
                <FormField
                  control={form.control}
                  name="visitDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>{t('visit_date_label')} *</FormLabel>
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
                            disabled={(date) => date > new Date()}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Weight */}
                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('weight_label')} {t('unit_kg')} *</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" step="0.1" placeholder="12.5" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Height */}
                <FormField
                  control={form.control}
                  name="height"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('height_label')} {t('unit_cm')} *</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" step="0.1" placeholder="75.5" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Feeding Status */}
                <FormField
                  control={form.control}
                  name="feedingStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('feeding_status_label')} *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select feeding status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="exclusive_breastfeeding">
                            {t('feed_exclusive_breastfeeding')}
                          </SelectItem>
                          <SelectItem value="complementary_started">
                            {t('feed_complementary_started')}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Immunization Status */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-medium">{t('immunization_status_label')} *</h3>
                  <p className="text-sm text-muted-foreground">
                    Select the status of each immunization for this child.
                  </p>
                </div>
                <div className="grid gap-4">
                  {immunizations.map((immunization) => (
                    <div key={immunization.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <span className="font-medium">{immunization.label}</span>
                      <Select
                        onValueChange={(value) => {
                          const current = form.getValues("immunizationStatus") || {};
                          form.setValue("immunizationStatus", {
                            ...current,
                            [immunization.id]: value
                          });
                        }}
                      >
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          {immunizationOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
              </div>

              {/* Danger Signs */}
              <FormField
                control={form.control}
                name="dangerSigns"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">{t('danger_signs_label')}</FormLabel>
                      <FormDescription>
                        Select any danger signs observed during the visit.
                      </FormDescription>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {dangerSigns.map((sign) => (
                        <FormField
                          key={sign.id}
                          control={form.control}
                          name="dangerSigns"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={sign.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(sign.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...(field.value || []), sign.id])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== sign.id
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {sign.label}
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

              {/* Referred to PHC Switch */}
              <FormField
                control={form.control}
                name="referredToPHC"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base flex items-center gap-2">
                        {t('referred_phc_label')} *
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-4 h-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{t('tooltip_referred_phc')}</p>
                          </TooltipContent>
                        </Tooltip>
                      </FormLabel>
                      <FormDescription>
                        Mark if child needs referral to Primary Health Center
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
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