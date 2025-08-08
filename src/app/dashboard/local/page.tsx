import { IndiaMap } from '@/components/dashboard/india-map';

export default function LocalPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Local Outbreak Monitoring
        </h1>
        <p className="text-muted-foreground">
          Visualize real-time health data in your region.
        </p>
      </div>
      <IndiaMap />
    </div>
  );
}
