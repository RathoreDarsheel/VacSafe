'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Lightbulb, Loader2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { runSimulationAndGetReminder } from '@/lib/actions';
import type { SmartVaccineReminderOutput } from '@/ai/flows/vaccine-reminder-flow';
import { overallCoverage } from '@/lib/data';

export function RiskSimulator() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SmartVaccineReminderOutput | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  // Data is now sourced from mock data file
  const immunity = overallCoverage.rate;
  const efficacy = 95; // Kept as a fixed value for now
  const infected = 10; // Kept as a fixed value for now

  const handleSimulate = async () => {
    setIsLoading(true);
    setResult(null);
    setError(null);
    const response = await runSimulationAndGetReminder({
      communityImmunity: immunity,
      vaccineEfficacy: efficacy,
      initialInfected: infected,
    });
    if (response.success && response.data) {
      setResult(response.data);
    } else {
      setError(response.error || 'An unknown error occurred.');
    }
    setIsLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Outbreak Risk Simulator</CardTitle>
        <CardDescription>
          Run a simulation based on current community data to receive
          AI-powered recommendations.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-lg border bg-card p-4 shadow-sm">
                <p className="text-sm font-medium text-muted-foreground">Community Immunity</p>
                <p className="text-2xl font-bold">{immunity}%</p>
            </div>
             <div className="rounded-lg border bg-card p-4 shadow-sm">
                <p className="text-sm font-medium text-muted-foreground">Assumed Vaccine Efficacy</p>
                <p className="text-2xl font-bold">{efficacy}%</p>
            </div>
             <div className="rounded-lg border bg-card p-4 shadow-sm">
                <p className="text-sm font-medium text-muted-foreground">Assumed Initial Infected</p>
                <p className="text-2xl font-bold">{infected}</p>
            </div>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-4">
        <Button onClick={handleSimulate} disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Run Simulation & Get Recommendation
        </Button>
        {result && (
          <Alert
            variant={result.shouldRemind ? 'destructive' : 'default'}
            className="bg-card"
          >
            {result.shouldRemind ? (
              <AlertTriangle className="h-4 w-4" />
            ) : (
              <CheckCircle2 className="h-4 w-4" />
            )}
            <AlertTitle className="flex items-center gap-2">
              <Lightbulb />
              AI Recommendation
            </AlertTitle>
            <AlertDescription>{result.reason}</AlertDescription>
          </Alert>
        )}
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardFooter>
    </Card>
  );
}
