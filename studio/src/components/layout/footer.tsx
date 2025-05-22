export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="py-6 bg-background border-t border-border/70 mt-auto">
      <div className="container mx-auto text-center text-muted-foreground text-xs sm:text-sm px-4">
        <p>&copy; {currentYear} Diagnosify. Всі права захищено.</p>
        <p className="mt-1">
          Цей інструмент надає інформацію лише в освітніх цілях і не є заміною професійної медичної консультації, діагностики чи лікування.
        </p>
      </div>
    </footer>
  );
}
