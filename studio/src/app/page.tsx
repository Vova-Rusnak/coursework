
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import ImageUploadForm from '@/components/features/image-upload-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, AlertTriangle, Info } from 'lucide-react';
import DirectApiKeyDialog from '@/components/features/direct-api-key-dialog';

export default function HomePage() {
  const apiKeyIsSet = !!process.env.GOOGLE_API_KEY || !!process.env.GOOGLE_GENAI_API_KEY;

  return (
    <div className="flex flex-col min-h-screen text-foreground">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-5xl mx-auto space-y-10">
          <section aria-labelledby="app-introduction" className="text-center">
            <h1 id="app-introduction" className="text-4xl sm:text-5xl font-extrabold text-primary mb-4">
              Ласкаво просимо до Diagnosify
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Ваш ШІ-асистент для попереднього аналізу візуальних симптомів. Завантажте зображення ураженої ділянки, щоб отримати інформацію.
            </p>
          </section>

          <Card className="bg-card shadow-lg rounded-xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-primary flex items-center">
                <AlertTriangle className="mr-2 h-6 w-6 text-destructive" />
                Важливо: Налаштування API ключа Gemini (Google AI)
              </CardTitle>
              <CardDescription className="text-muted-foreground pt-1">
                Для використання функції ШІ-діагностики необхідний API ключ від Google AI Studio.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {apiKeyIsSet ? (
                <div className="p-3 bg-green-50 border border-green-300 text-green-700 rounded-md text-sm dark:bg-green-900/30 dark:border-green-700 dark:text-green-300">
                  <p><strong className="font-semibold">API ключ успішно завантажено з файлу `.env`.</strong> ШІ-діагностика повинна працювати.</p>
                </div>
              ) : (
                <div className="p-3 bg-red-50 border border-red-300 text-red-700 rounded-md text-sm dark:bg-red-900/30 dark:border-red-700 dark:text-red-300">
                  <p><strong className="font-semibold">API ключ не знайдено у файлі `.env`.</strong> ШІ-діагностика не працюватиме без нього.</p>
                </div>
              )}
              <div className="text-sm text-muted-foreground space-y-2">
                <p>
                  <strong className="text-foreground">Рекомендований спосіб (для стабільної роботи ШІ на сервері):</strong>
                </p>
                <ol className="list-decimal list-inside pl-4 space-y-1">
                  <li>Перейдіть на сайт <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-accent underline hover:text-accent/80">Google AI Studio</a> та отримайте ваш API ключ.</li>
                  <li>У кореневій папці вашого проекту (там же, де `package.json`) знайдіть або створіть файл з ім'ям <code className="font-mono bg-muted px-1 py-0.5 rounded">.env</code>.</li>
                  <li>Додайте у файл <code className="font-mono bg-muted px-1 py-0.5 rounded">.env</code> наступний рядок, замінивши <code className="font-mono bg-muted px-1 py-0.5 rounded">ВАШ_API_КЛЮЧ_ТУТ</code> на ваш діючий ключ:
                    <pre className="mt-1 p-2 bg-muted/70 rounded-md text-xs"><code>GOOGLE_API_KEY=ВАШ_API_КЛЮЧ_ТУТ</code></pre>
                  </li>
                  <li><strong className="text-destructive">КРИТИЧНО ВАЖЛИВО:</strong> Збережіть файл <code className="font-mono bg-muted px-1 py-0.5 rounded">.env</code> та <strong className="text-destructive">повністю перезапустіть сервер розробки</strong> (зазвичай <code className="font-mono bg-muted/70 px-1 py-0.5 rounded">Ctrl+C</code> або <code className="font-mono bg-muted/70 px-1 py-0.5 rounded">Cmd+C</code> в терміналі, а потім знову <code className="font-mono bg-muted/70 px-1 py-0.5 rounded">npm run dev</code> та <code className="font-mono bg-muted/70 px-1 py-0.5 rounded">npm run genkit:dev</code>).</li>
                </ol>
              </div>
              <div className="mt-4">
                <DirectApiKeyDialog />
              </div>
               <div className="mt-3 p-3 border border-blue-300 rounded-md bg-blue-50 text-sm text-blue-700 flex items-start dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-400">
                <Info className="h-4 w-4 mr-2 mt-0.5 shrink-0" />
                <span>
                  Файл <code className="font-mono bg-blue-100 dark:bg-blue-800 px-0.5 rounded">.env</code> використовується для зберігання конфіденційної інформації. Якщо ваш проект буде у публічному репозиторії (наприклад, GitHub), переконайтеся, що <code className="font-mono bg-blue-100 dark:bg-blue-800 px-0.5 rounded">.env</code> додано до <code className="font-mono bg-blue-100 dark:bg-blue-800 px-0.5 rounded">.gitignore</code>.
                </span>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            <section aria-labelledby="upload-title" className="lg:col-span-3">
              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out rounded-xl overflow-hidden bg-card">
                <CardHeader>
                  <CardTitle id="upload-title" className="text-2xl sm:text-3xl font-bold text-primary">
                    Завантажте ваше зображення
                  </CardTitle>
                  <CardDescription className="text-md sm:text-lg text-muted-foreground pt-1">
                    Зробіть чітку фотографію ураженої ділянки. Наш ШІ проаналізує її та запропонує можливі стани.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <ImageUploadForm />
                </CardContent>
              </Card>
            </section>

            <aside aria-labelledby="info-title" className="lg:col-span-2">
              <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out rounded-xl bg-secondary/20 border-primary/30">
                <CardHeader className="flex flex-row items-center gap-3">
                  <Lightbulb className="w-8 h-8 text-accent shrink-0" />
                  <CardTitle id="info-title" className="text-xl sm:text-2xl font-semibold text-primary">
                    Як це працює та Відмова від відповідальності
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-muted-foreground text-sm sm:text-base">
                  <p><span className="font-semibold text-foreground">1. Завантажте зображення:</span> Оберіть чітке, добре освітлене фото проблемної ділянки.</p>
                  <p><span className="font-semibold text-foreground">2. ШІ-Аналіз:</span> Наша система обробляє зображення для виявлення візуальних ознак, пов'язаних із різними станами.</p>
                  <p><span className="font-semibold text-foreground">3. Перегляньте припущення:</span> Отримайте список можливих станів. Це припущення, а не остаточний діагноз.</p>
                  <div className="mt-4 p-3 bg-destructive/80 text-destructive-foreground rounded-md shadow">
                    <p className="font-bold">
                      Важливо: Цей інструмент призначений лише для інформаційних цілей і не замінює професійну медичну консультацію. Завжди звертайтеся до кваліфікованого медичного працівника для діагностики та лікування будь-яких захворювань.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
