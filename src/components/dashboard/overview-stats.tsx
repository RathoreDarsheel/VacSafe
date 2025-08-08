'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { overallCoverage } from '@/lib/data';
import { Users, Syringe, ShieldCheck } from 'lucide-react';
import { Label, Pie, PieChart, RadialBar, RadialBarChart } from 'recharts';

const chartConfig = {
  coverage: {
    label: 'Coverage',
  },
  primary: {
    label: 'Vaccinated',
    color: 'hsl(var(--chart-1))',
  },
  secondary: {
    label: 'Remaining',
    color: 'hsl(var(--muted))',
  },
};

export function OverviewStats() {
  const chartData = [
    { name: 'primary', value: overallCoverage.rate, fill: 'var(--color-primary)' },
  ];

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Population</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {overallCoverage.population.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            Total individuals in the community
          </p>
        </CardContent>
      </Card>
      <Card className="sm:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Overall Coverage</CardTitle>
          <CardDescription>
            Percentage of the community that is vaccinated.
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-0">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <RadialBarChart
              data={chartData}
              startAngle={90}
              endAngle={-270}
              innerRadius="70%"
              outerRadius="100%"
              barSize={24}
              cy="50%"
            >
              <RadialBar
                dataKey="value"
                background={{ fill: 'hsl(var(--muted))' }}
                cornerRadius={12}
              />
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-foreground text-4xl font-bold"
              >
                {overallCoverage.rate.toFixed(0)}%
              </text>
            </RadialBarChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Vaccinated</CardTitle>
          <Syringe className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {(
              (overallCoverage.population * overallCoverage.rate) /
              100
            ).toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
          <p className="text-xs text-muted-foreground">
            Based on {overallCoverage.rate}% coverage rate
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
