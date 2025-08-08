'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { ageGroupData, type AgeGroupData } from '@/lib/data';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Legend } from 'recharts';

const chartConfig = {
  rate: {
    label: 'Vaccination Rate (%)',
    color: 'hsl(var(--chart-1))',
  },
};

export function AgeGroupCoverage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Coverage by Age Group</CardTitle>
        <CardDescription>
          Vaccination rates across different age demographics.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart data={ageGroupData} accessibilityLayer>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="age"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              unit="%"
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Bar dataKey="rate" fill="var(--color-rate)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
