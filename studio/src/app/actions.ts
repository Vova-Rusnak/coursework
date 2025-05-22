
"use server";

import { diagnoseImage, type DiagnoseImageInput, type DiagnoseImageOutput } from "@/ai/flows/diagnose-image";
import { z } from "zod";

const DiagnoseImageActionInputSchema = z.object({
  photoDataUri: z.string().trim().min(1, "URI даних зображення не може бути порожнім.")
    .refine(val => val.startsWith('data:image/'), {
      message: "URI даних фотографії має бути дійсним URI даних зображення (наприклад, data:image/jpeg;base64,...)."
    }),
});

interface ActionResult {
  data?: DiagnoseImageOutput;
  error?: string;
}

export async function diagnoseImageAction(
  input: DiagnoseImageInput
): Promise<ActionResult> {
  const validatedInput = DiagnoseImageActionInputSchema.safeParse(input);

  if (!validatedInput.success) {

    const errorMessages = validatedInput.error.flatten().fieldErrors.photoDataUri?.join(", ")
                          || "Надано недійсні вхідні дані для діагностики зображення.";
    return { error: errorMessages };
  }

  try {

    const result = await diagnoseImage({ photoDataUri: validatedInput.data.photoDataUri });
    return { data: result };
  } catch (error) {
    console.error("Помилка в diagnoseImageAction:", error);
    if (error instanceof Error) {
      return { error: error.message || "Діагностика ШІ не вдалася. Будь ласка, спробуйте ще раз." };
    }
    return { error: "Діагностика ШІ не вдалася через невідому помилку. Будь ласка, спробуйте ще раз." };
  }
}
