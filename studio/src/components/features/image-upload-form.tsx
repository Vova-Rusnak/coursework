
"use client";

import type { DiagnoseImageOutput } from "@/ai/flows/diagnose-image";
import { zodResolver } from "@hookform/resolvers/zod";
import NextImage from "next/image";
import { useState, type ChangeEvent, useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, UploadCloud, AlertTriangle, RefreshCw, CheckCircle } from "lucide-react";
import DiagnosisResultCard from "./diagnosis-result-card";
import { diagnoseImageAction } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";

const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const FormSchema = z.object({
  imageFile: z
    .custom<FileList>((val) => val instanceof FileList, "Файл зображення обов'язковий (має бути FileList).")
    .refine((files) => files && files.length > 0, "Зображення обов'язкове.")
    .refine(
      (files) => files && files[0]?.size <= MAX_FILE_SIZE_BYTES,
      `Максимальний розмір файлу ${MAX_FILE_SIZE_MB} МБ.`
    )
    .refine(
      (files) => files && ACCEPTED_IMAGE_TYPES.includes(files[0]?.type),
      `Підтримуються лише формати .jpg, .png, .webp, .gif.`
    ),
});

type FormValues = z.infer<typeof FormSchema>;

export default function ImageUploadForm() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnoseImageOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    mode: "onChange",
    defaultValues: {
      imageFile: typeof window !== "undefined" ? new DataTransfer().files : undefined,
    }
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    reset,
    watch,
  } = form;

  const imageFile = watch("imageFile");

  useEffect(() => {
    const currentFile = imageFile?.[0];

    if (currentFile instanceof File) {
      if (ACCEPTED_IMAGE_TYPES.includes(currentFile.type) && currentFile.size <= MAX_FILE_SIZE_BYTES) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.onerror = () => {
          console.error("Помилка FileReader під час створення прев'ю:", reader.error);
          setImagePreview(null);
        };
        reader.readAsDataURL(currentFile);
      } else {
        setImagePreview(null);
      }
    } else {
      setImagePreview(null);
    }
  }, [imageFile]);


  const { onChange: rhfImageFileOnChange, ...imageFileRestProps } = register("imageFile");

  const handleImageChangeAndSideEffects = (event: ChangeEvent<HTMLInputElement>) => {
    rhfImageFileOnChange(event);
    setDiagnosisResult(null);
    setError(null);
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (!data.imageFile || data.imageFile.length === 0) {
      setError("Будь ласка, оберіть файл зображення.");
      toast({
        variant: "destructive",
        title: "Помилка валідації",
        description: "Будь ласка, оберіть файл зображення.",
      });
      return;
    }
    if (!isValid) {
        setError("Обраний файл недійсний. Будь ласка, перевірте вимоги.");
        toast({
            variant: "destructive",
            title: "Помилка валідації",
            description: errors.imageFile?.message || "Обраний файл недійсний.",
        });
        return;
    }

    setIsLoading(true);
    setError(null);
    setDiagnosisResult(null);

    const file = data.imageFile[0];
    const reader = new FileReader();

    reader.onload = async () => {
      const photoDataUri = reader.result as string;
      try {
        const result = await diagnoseImageAction({ photoDataUri });
        if (result.error) {
          setError(result.error);
          toast({
            variant: "destructive",
            title: "Аналіз не вдався",
            description: result.error,
          });
        } else if (result.data) {
          setDiagnosisResult(result.data);
           toast({
            title: "Аналіз завершено",
            description: "Виявлено можливі стани.",
            action: <CheckCircle className="text-green-500" />,
          });
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Сталася непередбачена помилка. Будь ласка, спробуйте ще раз.";
        setError(errorMessage);
        toast({
          variant: "destructive",
          title: "Помилка",
          description: errorMessage,
        });
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    reader.onerror = () => {
      const readError = "Не вдалося прочитати файл зображення для аналізу.";
      setError(readError);
      toast({
        variant: "destructive",
        title: "Помилка читання файлу",
        description: readError,
      });
      setIsLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleReset = () => {
    reset();
    setImagePreview(null);
    setDiagnosisResult(null);
    setError(null);
    setIsLoading(false);
  };

  const showResetButton = isDirty || imagePreview || diagnosisResult || error;

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <Label htmlFor="imageFile" className="sr-only">
            Завантажити зображення
          </Label>
          <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md transition-colors ${errors.imageFile ? 'border-destructive' : 'border-primary/50 hover:border-primary'}`}>
            <div className="space-y-2 text-center">
              {imagePreview && !errors.imageFile ? (
                <div className="my-2">
                  <NextImage
                    src={imagePreview}
                    alt="Попередній перегляд зображення"
                    width={200}
                    height={200}
                    className="mx-auto max-h-48 w-auto object-contain rounded-md shadow-md"
                    data-ai-hint="medical skin condition"
                  />
                </div>
              ) : (
                <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" aria-hidden="true" />
              )}
              <div className="flex text-sm text-muted-foreground justify-center">
                <Label
                  htmlFor="imageFile"
                  className="relative cursor-pointer rounded-md font-medium text-accent hover:text-accent/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-ring px-1"
                >
                  <span>Завантажте файл</span>
                  <Input
                    id="imageFile"
                    type="file"
                    className="sr-only"
                    accept={ACCEPTED_IMAGE_TYPES.join(",")}
                    {...imageFileRestProps}
                    onChange={handleImageChangeAndSideEffects}
                  />
                </Label>
                <p className="pl-1 hidden sm:inline">або перетягніть</p>
              </div>
              <p className="text-xs text-muted-foreground">
                {ACCEPTED_IMAGE_TYPES.map(type => type.split('/')[1].toUpperCase()).join(', ')} до {MAX_FILE_SIZE_MB} МБ
              </p>
            </div>
          </div>
          {errors.imageFile && (
            <p className="mt-2 text-sm text-destructive flex items-center gap-1">
              <AlertTriangle className="h-4 w-4 shrink-0" /> {errors.imageFile.message}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button type="submit" disabled={isLoading || !isValid} className="w-full sm:flex-1">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {isLoading ? "Аналіз..." : "Отримати діагноз"}
          </Button>
          {showResetButton && (
              <Button type="button" variant="outline" onClick={handleReset} className="w-full sm:flex-1">
               <RefreshCw className="mr-2 h-4 w-4" /> Скинути форму
              </Button>
          )}
        </div>
      </form>

      {error && !isLoading && (
        <div className="mt-4 p-4 bg-destructive/10 border border-destructive text-destructive rounded-md flex items-start gap-3 animate-in fade-in-50">
          <AlertTriangle className="h-5 w-5 mt-0.5 shrink-0" />
          <div>
            <h3 className="font-semibold">Аналіз не вдався</h3>
            <p>{error}</p>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="mt-6 text-center py-8 space-y-3 animate-in fade-in-50">
            <Loader2 className="mx-auto h-12 w-12 text-primary animate-spin" />
            <p className="text-lg font-semibold text-primary">Аналізуємо ваше зображення...</p>
            <p className="text-sm text-muted-foreground">Це може зайняти кілька хвилин. Будь ласка, зачекайте.</p>
        </div>
      )}

      {diagnosisResult && !isLoading && (
        <div className="mt-6 animate-in fade-in-50">
          <DiagnosisResultCard result={diagnosisResult} />
        </div>
      )}
    </div>
  );
}
