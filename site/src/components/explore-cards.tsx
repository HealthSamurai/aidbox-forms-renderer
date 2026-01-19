import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { withBase } from "@/lib/base-url.ts";

type ExploreCard = {
  href: string;
  eyebrow: string;
  title: string;
  description: string | undefined;
};

export default function ExploreCards({ cards }: { cards: ExploreCard[] }) {
  return (
    <section className="grid gap-4 sm:grid-cols-2">
      {cards.map((card) => (
        <a key={card.href} href={withBase(card.href)} className="group">
          <Card className="hover:bg-muted/50 shadow-none transition-all">
            <CardHeader className="space-y-2">
              <p className="text-muted-foreground text-xs font-medium">
                {card.eyebrow}
              </p>
              <CardTitle className="text-lg">{card.title}</CardTitle>
              {card.description ? (
                <CardDescription>{card.description}</CardDescription>
              ) : undefined}
            </CardHeader>
          </Card>
        </a>
      ))}
    </section>
  );
}
