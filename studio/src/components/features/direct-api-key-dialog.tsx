
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { KeyRound, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const LOCAL_STORAGE_KEY = 'diagnosify_user_gemini_api_key';

export default function DirectApiKeyDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showRisks, setShowRisks] = useState(true);
  const [confirmedRisks, setConfirmedRisks] = useState(false);
  const [storedKeyExists, setStoredKeyExists] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const existingKey = localStorage.getItem(LOCAL_STORAGE_KEY);
      setStoredKeyExists(!!existingKey);
      if (existingKey && !apiKey) {
      }
    }
  }, [isOpen]);

  const handleSaveKey = () => {
    if (!apiKey.trim()) {
      toast({
        variant: "destructive",
        title: "Помилка",
        description: "API ключ не може бути порожнім.",
      });
      return;
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_KEY, apiKey.trim());
      setStoredKeyExists(true);
      toast({
        title: "API ключ збережено в браузері",
        description: (
          <div>
            <p>Ключ збережено в локальному сховищі вашого браузера.</p>
            <p className="font-semibold mt-2">
              Для роботи поточної серверної ШІ-діагностики все ще необхідно налаштувати ключ у файлі <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">.env</code> та перезапустити сервер.
            </p>
          </div>
        ),
        action: <CheckCircle className="text-green-500" />,
        duration: 10000,
      });
      setIsOpen(false);
    }
  };

  const handleRemoveKey = () => {
     if (typeof window !== 'undefined') {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      setStoredKeyExists(false);
      setApiKey('');
      toast({
        title: "API ключ видалено з браузера",
        description: "Збережений у браузері API ключ було видалено.",
      });
    }
  }

  const handleProceed = () => {
    setShowRisks(false);
    setConfirmedRisks(true);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setShowRisks(true);
      setConfirmedRisks(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full sm:w-auto shadow-sm hover:shadow-md transition-shadow text-sm">
          <KeyRound className="mr-2 h-4 w-4" />
          Ввести/Переглянути API ключ (для браузера)
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-card">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-primary flex items-center">
            <KeyRound className="mr-2 h-5 w-5" />
            Керування API ключем Gemini для браузера
          </DialogTitle>
        </DialogHeader>

        {showRisks && !confirmedRisks && (
          <div className="py-4 space-y-3">
            <Alert variant="destructive">
              <AlertTriangle className="h-5 w-5" />
              <AlertTitle className="font-semibold">Попередження про ризики!</AlertTitle>
              <AlertDescription>
                <ul className="list-disc pl-5 space-y-1 mt-1">
                  <li>Збереження API-ключа безпосередньо в браузері (в <code className="font-mono text-xs">localStorage</code>) менш безпечне, ніж використання файлу <code className="font-mono text-xs">.env</code> для серверних операцій. Ключ буде доступний скриптам на цій сторінці.</li>
                  <li>Цей метод зберігає ключ лише для вашого поточного браузера. Він не буде доступний в інших браузерах або на інших пристроях.</li>
                  <li><strong className="font-bold">Важливо:</strong> Збережений таким чином ключ <strong className="font-bold">НЕ БУДЕ</strong> автоматично використовуватися серверною частиною програми (Genkit AI) для діагностики зображень. Для цього все ще потрібне налаштування файлу <code className="font-mono text-xs">.env</code> та перезапуск сервера розробки.</li>
                  <li>Цей спосіб може бути корисним для майбутніх функцій, які могли б працювати повністю на стороні клієнта, або для тимчасового тестування, якщо ви розумієте обмеження.</li>
                </ul>
              </AlertDescription>
            </Alert>
            <Button onClick={handleProceed} className="w-full">Я розумію ризики та хочу продовжити</Button>
          </div>
        )}

        {confirmedRisks && (
          <div className="py-4 space-y-4">
            <p className="text-sm text-muted-foreground">
              Введіть ваш API ключ Gemini. Він буде збережений в локальному сховищі вашого браузера.
            </p>
            <div>
              <label htmlFor="apiKeyInput" className="block text-sm font-medium text-foreground mb-1">
                API Ключ Gemini
              </label>
              <Input
                id="apiKeyInput"
                type="password"
                placeholder="AIzaSy..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="bg-input"
              />
            </div>
            {storedKeyExists && !apiKey && (
               <p className="text-xs text-muted-foreground">
                У вашому браузері вже збережено ключ. Якщо ви введете новий, він перезапише старий. Щоб побачити збережений ключ, тимчасово змініть тип поля в інструментах розробника браузера з 'password' на 'text'.
              </p>
            )}
             <div className="p-3 border border-blue-300 rounded-md bg-blue-50 text-sm text-blue-700 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-300">
                <Info className="h-4 w-4 mr-2 inline-block shrink-0 relative -top-px" />
                <span>
                  Нагадуємо: для роботи ШІ-діагностики на сервері все ще потрібен ключ у <code className="font-mono bg-blue-100 dark:bg-blue-800 px-0.5 rounded text-xs">.env</code> файлі та перезапуск сервера.
                </span>
              </div>
          </div>
        )}

        <DialogFooter className="pt-2 gap-2 sm:gap-0">
          {confirmedRisks && (
            <>
              <Button onClick={handleSaveKey}>Зберегти ключ у браузері</Button>
              {storedKeyExists && (
                <Button variant="destructive" onClick={handleRemoveKey} className="mr-auto sm:mr-0">Видалити з браузера</Button>
              )}
            </>
          )}
          <DialogClose asChild>
            <Button variant="outline">Закрити</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
