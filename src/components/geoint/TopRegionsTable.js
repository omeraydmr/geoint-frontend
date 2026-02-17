'use client';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Badge } from 'primereact/badge';
import { ProgressBar } from 'primereact/progressbar';
import { Card } from 'primereact/card';

export default function TopRegionsTable({ regions, loading }) {
  const scoreBodyTemplate = (rowData) => {
    const score = rowData.geoint_score;
    let severity = 'info';

    if (score >= 70) severity = 'success';
    else if (score >= 40) severity = 'warning';
    else severity = 'danger';

    return (
      <div className="flex items-center gap-2">
        <Badge value={score.toFixed(1)} severity={severity} />
        <ProgressBar
          value={score}
          showValue={false}
          className="w-24"
          style={{ height: '8px' }}
        />
      </div>
    );
  };

  const trendBodyTemplate = (rowData) => {
    const direction = rowData.trend_direction;
    const icons = {
      up: { icon: 'pi-arrow-up', color: 'text-green-500' },
      down: { icon: 'pi-arrow-down', color: 'text-red-500' },
      stable: { icon: 'pi-minus', color: 'text-gray-500' }
    };

    const trend = icons[direction] || icons.stable;

    return (
      <i className={`pi ${trend.icon} ${trend.color}`}></i>
    );
  };

  const componentsBodyTemplate = (rowData) => {
    return (
      <div className="text-sm space-y-1">
        <div className="flex justify-between">
          <span className="text-gray-600">Arama:</span>
          <span className="font-medium">{rowData.search_index.toFixed(0)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Trend:</span>
          <span className="font-medium">{rowData.trend_score.toFixed(0)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Demografik:</span>
          <span className="font-medium">{rowData.demographic_fit.toFixed(0)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Rekabet:</span>
          <span className="font-medium">{rowData.competition_gap.toFixed(0)}</span>
        </div>
      </div>
    );
  };

  return (
    <Card title="En İyi Bölgeler" className="h-full">
      <DataTable
        value={regions}
        loading={loading}
        paginator
        rows={10}
        dataKey="region_id"
        emptyMessage="Veri bulunamadı"
        className="text-sm"
      >
        <Column
          field="region_name"
          header="Bölge"
          sortable
          style={{ minWidth: '200px' }}
        />

        <Column
          header="GEOINT Skoru"
          body={scoreBodyTemplate}
          sortable
          sortField="geoint_score"
          style={{ minWidth: '180px' }}
        />

        <Column
          header="Trend"
          body={trendBodyTemplate}
          align="center"
          style={{ width: '80px' }}
        />

        <Column
          header="Bileşenler"
          body={componentsBodyTemplate}
          style={{ minWidth: '200px' }}
        />
      </DataTable>
    </Card>
  );
}
