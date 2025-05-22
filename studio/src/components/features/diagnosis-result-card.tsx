import type { DiagnoseImageOutput } from "@/ai/flows/diagnose-image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, ExternalLink, ListChecks, Info } from "lucide-react";
import Link from "next/link";
import { GENERIC_SEARCH_PROVIDER_URL, DISEASE_RESOURCES } from "@/lib/constants";

interface DiagnosisResultCardProps {
  result: DiagnoseImageOutput;
}

export default function DiagnosisResultCard({ result }: DiagnosisResultCardProps) {
  const getResourceLink = (diseaseName: string): string => {

    const normalizedDiseaseKey = Object.keys(DISEASE_RESOURCES).find(
      key => key.toLowerCase() === diseaseName.toLowerCase()
    );
    if (normalizedDiseaseKey && DISEASE_RESOURCES[normalizedDiseaseKey]) {
        return DISEASE_RESOURCES[normalizedDiseaseKey];
    }


    return `${GENERIC_SEARCH_PROVIDER_URL}${encodeURIComponent(diseaseName)}`;
  };

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out border-accent rounded-xl">
      <CardHeader className="bg-card">
        <div className="flex items-center gap-3 mb-1">
          <ListChecks className="h-7 w-7 sm:h-8 sm:w-8 text-accent shrink-0" />
          <CardTitle className="text-xl sm:text-2xl font-bold text-primary">Можливі стани</CardTitle>
        </div>
        <CardDescription className="text-md text-muted-foreground">
          На основі аналізу зображення, ось деякі можливі варіанти. Це не медичний діагноз.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 p-6">
        {result.possibleDiseases.length > 0 ? (
          <ul className="space-y-3">
            {result.possibleDiseases.map((disease, index) => (
              <li key={index} className="p-3 sm:p-4 bg-secondary/30 rounded-lg shadow-sm border border-primary/20 hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 sm:gap-3">
                  <h4 className="text-md sm:text-lg font-semibold text-foreground flex-grow">{disease}</h4>
                  <Button asChild variant="outline" size="sm" className="bg-accent/10 hover:bg-accent/20 text-accent border-accent/50 hover:border-accent/70 w-full sm:w-auto shrink-0">
                    <Link href={getResourceLink(disease)} target="_blank" rel="noopener noreferrer">
                      Дізнатися більше <ExternalLink className="ml-1.5 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </Link>
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-6 px-4 bg-muted/50 rounded-md">
            <Info className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground font-medium">
              На основі наданого зображення конкретних станів не виявлено.
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Це може бути пов'язано з чіткістю зображення, характером візуальних ознак або іншими факторами. Якщо у вас є побоювання, зверніться до медичного працівника.
            </p>
          </div>
        )}
        <div className="mt-6 p-3 sm:p-4 bg-primary/10 border border-primary/30 rounded-md text-sm">
          <div className="flex items-start gap-2 text-primary-foreground/90">
            <Lightbulb className="h-4 w-4 sm:h-5 sm:w-5 text-primary shrink-0 mt-0.5" />
            <p><span className="font-semibold text-primary">Нагадування:</span> Цей ШІ-аналіз призначений лише для інформаційних цілей і не повинен розглядатися як заміна професійної медичної консультації, діагностики чи лікування. Завжди звертайтеся за допомогою до кваліфікованого медичного працівника з будь-яких питань, пов'язаних зі здоров'ям.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
