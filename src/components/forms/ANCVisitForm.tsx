import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
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

const createANCSchema = (t: any) => z.object({
  visitDate: z.date({ required_error: t('required_field_error') }),
  trimester: z.string().min(1, t('required_field_error')),
  weight: z.string().min(1, t('required_field_error')),
  bloodPressure: z.string().min(1, t('required_field_error')),
  hemoglobin: z.string().optional(),
  ifaGiven: z.boolean().default(false),
  ttDose: z.string().min(1, t('required_field_error')),
  dangerSigns: z.array(z.string()).optional(),
  referredToPHC: z.boolean().default(false),
  notes: z.string().optional(),
});

type ANCVisitData = z.infer<ReturnType<typeof createANCSchema>>;

interface ANCVisitFormProps {
  patientName?: string;
  onSubmit: (data: ANCVisitData) => void;
  onCancel: () => void;
}

export const ANCVisitForm = ({ patientName, onSubmit, onCancel }: ANCVisitFormProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const form = useForm<ANCVisitData>({
    resolver: zodResolver(createANCSchema(t)),
    defaultValues: {
      weight: "",
      bloodPressure: "",
      hemoglobin: "",
      ifaGiven: false,
      ttDose: "",
      dangerSigns: [],
      referredToPHC: false,
      notes: "",
    },
  });

  const handleSubmit = (data: ANCVisitData) => {
    toast({
      title: t('anc_visit'),
      description: `Visit recorded for ${patientName || 'patient'}`,
    });
    onSubmit(data);
  };

  const dangerSigns = [
    { id: 'headache', label: t('danger_anc_headache') },
    { id: 'blur_vision', label: t('danger_anc_blur_vision') },
    { id: 'fever', label: t('danger_anc_fever') },
    { id: 'bleeding', label: t('danger_anc_bleeding') },
  ];

  return (
    <TooltipProvider>
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>{t('anc_visit')}</CardTitle>
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

                {/* Trimester */}
                <FormField
                  control={form.control}
                  name="trimester"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('trimester_label')} *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select trimester" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="first">{t('tri_1')}</SelectItem>
                          <SelectItem value="second">{t('tri_2')}</SelectItem>
                          <SelectItem value="third">{t('tri_3')}</SelectItem>
                        </SelectContent>
                      </Select>
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
                        <Input {...field} type="number" step="0.1" placeholder="55.5" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Blood Pressure */}
                <FormField
                  control={form.control}
                  name="bloodPressure"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('bp_label')} {t('unit_mmhg')} *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="120/80" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Hemoglobin */}
                <FormField
                  control={form.control}
                  name="hemoglobin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('hb_label')} {t('unit_g_dl')}</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" step="0.1" placeholder="12.5" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* TT Dose */}
                <FormField
                  control={form.control}
                  name="ttDose"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('tt_dose_label')} *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select TT dose" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">{t('tt_none')}</SelectItem>
                          <SelectItem value="tt1">{t('tt_1')}</SelectItem>
                          <SelectItem value="tt2">{t('tt_2')}</SelectItem>
                          <SelectItem value="booster">{t('tt_booster')}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* IFA Given Switch */}
              <FormField
                control={form.control}
                name="ifaGiven"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">{t('ifa_given_label')} *</FormLabel>
                      <FormDescription>
                        Iron and Folic Acid tablets provided to the patient
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
                        Mark if patient needs referral to Primary Health Center
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

              {/* Notes */}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('notes_label')}</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder={t('placeholder_notes')}
                        rows={4}
                      />
                    </FormControl>
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