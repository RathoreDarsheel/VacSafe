import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

const articles = [
  {
    title: 'Four countries in WHO’s Western Pacific Region eliminate rubella',
    source: 'World Health Organization',
    date: 'May 15, 2024',
    excerpt:
      'Brunei Darussalam, Hong Kong SAR (China), Macao SAR (China) and the Republic of Korea have eliminated rubella, a contagious viral infection that can have devastating consequences for pregnant women and their babies.',
    link: 'https://www.who.int/news/item/15-05-2024-four-countries-in-who-s-western-pacific-region-eliminate-rubella',
  },
  {
    title: 'Getting a Flu Vaccine in the 2023-2024 Season',
    source: 'Centers for Disease Control (CDC)',
    date: 'May 10, 2024',
    excerpt:
      'An annual flu vaccine is recommended for everyone 6 months and older. The CDC provides the latest information and recommendations for the current flu season.',
    link: 'https://www.cdc.gov/flu/prevent/vaccinations.htm',
  },
  {
    title: 'Five things you need to know about the HPV vaccine',
    source: 'Gavi, the Vaccine Alliance',
    date: 'April 29, 2024',
    excerpt:
      'The HPV vaccine is a critical tool in the fight against cervical cancer, which is the fourth most common cancer in women. Learn key facts about its safety and efficacy.',
    link: 'https://www.gavi.org/vaccineswork/five-things-you-need-know-about-hpv-vaccine',
  },
  {
    title: 'Childhood vaccination starts to recover from COVID-19 backsliding',
    source: 'UNICEF',
    date: 'July 18, 2023',
    excerpt:
      'Global immunization services reached 4 million more children in 2022 compared to the previous year, as countries step up their efforts to address the historic backsliding in vaccination.',
    link: 'https://www.unicef.org/press-releases/childhood-vaccination-starts-recover-covid-19-backsliding',
  },
];

export default function CommunityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Community Health News & Updates
        </h1>
        <p className="text-muted-foreground">
          Stay informed with the latest articles on health and vaccination.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {articles.map((article, index) => (
          <a
            key={index}
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group block"
          >
            <Card className="flex h-full flex-col overflow-hidden transition-all group-hover:border-primary/50 group-hover:shadow-lg">
              <CardHeader>
                <div className="text-sm text-muted-foreground">
                  <span>{article.source}</span> &middot;{' '}
                  <span>{article.date}</span>
                </div>
                <CardTitle className="text-lg leading-tight">
                  {article.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground">{article.excerpt}</p>
              </CardContent>
              <div className="flex items-center justify-end p-4 pt-0 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                Read More <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </Card>
          </a>
        ))}
      </div>
    </div>
  );
}
