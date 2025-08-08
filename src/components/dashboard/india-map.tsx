'use client';
import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import mapData from '@highcharts/map-collection/countries/in/in-all.geo.json';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import highchartsMap from "highcharts/modules/map";

// Initialize the map module
if (typeof Highcharts === 'object') {
  highchartsMap(Highcharts);
}

// Mock data function - in a real app, this would come from an API
const generateMockData = () => {
    return mapData.features.map(feature => ({
        'hc-key': feature.properties['hc-key'],
        value: Math.floor(Math.random() * 100) // Random outbreak risk value
    }));
};


export function IndiaMap() {
    const [chartOptions, setChartOptions] = useState<Highcharts.Options | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const data = generateMockData();

        setChartOptions({
            chart: {
                map: mapData,
                backgroundColor: 'transparent',
            },
            title: {
                text: 'Regional Outbreak Risk Assessment',
                style: {
                    color: 'hsl(var(--foreground))',
                    fontSize: '1.25rem', // 20px
                    fontWeight: '600'
                }
            },
            subtitle: {
                text: 'Simulated risk levels based on vaccination coverage and population density',
                 style: {
                    color: 'hsl(var(--muted-foreground))'
                }
            },
            mapNavigation: {
                enabled: true,
                buttonOptions: {
                    verticalAlign: 'bottom'
                }
            },
            colorAxis: {
                min: 0,
                max: 100,
                stops: [
                    [0, '#E6F7FF'], // Low risk - light blue
                    [0.5, '#FFA07A'], // Medium risk - light salmon
                    [1, '#FF4500']  // High risk - orange-red
                ],
            },
            series: [{
                type: 'map',
                data: data,
                name: 'Outbreak Risk',
                states: {
                    hover: {
                        color: 'hsl(var(--primary))'
                    }
                },
                dataLabels: {
                    enabled: true,
                    format: '{point.properties.name}',
                     style: {
                        color: 'hsl(var(--card-foreground))',
                        fontSize: '8px',
                        textOutline: 'none'
                    }
                }
            }],
             tooltip: {
                backgroundColor: 'hsl(var(--card))',
                borderColor: 'hsl(var(--border))',
                style: {
                    color: 'hsl(var(--card-foreground))'
                },
                formatter: function () {
                    // @ts-ignore
                    return `<b>${this.point.name}</b><br>Risk Score: ${this.point.value}`;
                }
            },
            credits: {
                enabled: false
            }
        });
        setIsLoading(false);
    }, []);

    return (
        <Card className="shadow-lg">
            <CardContent className="p-4">
                 {isLoading ? (
                     <div className="flex h-[500px] w-full items-center justify-center">
                         <Loader2 className="h-8 w-8 animate-spin text-primary" />
                     </div>
                ) : chartOptions ? (
                    <HighchartsReact
                        highcharts={Highcharts}
                        constructorType={'mapChart'}
                        options={chartOptions}
                    />
                ) : null}
            </CardContent>
        </Card>
    );
}
