import React from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// Design System Chart Colors mapping
export const chartColors = [
  'var(--primary)',
  'var(--success)',
  'var(--warning)',
  'var(--danger)',
  '#8B5CF6', // Purple
  '#06B6D4', // Cyan
  '#F43F5E'  // Rose
];

export interface ChartBaseProps {
  data: any[];
  height?: number;
}

// ------------------------------------------
// LINE CHART
// ------------------------------------------
export interface LineChartProps extends ChartBaseProps {
  lines: { dataKey: string; name?: string; color?: string }[];
  xAxisKey?: string;
}

export const LineChart: React.FC<LineChartProps> = ({ data, height = 300, lines, xAxisKey = 'name' }) => {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <RechartsLineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
          <XAxis dataKey={xAxisKey} axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} dx={-10} />
          <Tooltip
            contentStyle={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-floating)' }}
            itemStyle={{ color: 'var(--text-main)', fontSize: 14 }}
          />
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
          {lines.map((line, i) => (
            <Line
              key={line.dataKey}
              type="monotone"
              dataKey={line.dataKey}
              name={line.name || line.dataKey}
              stroke={line.color || chartColors[i % chartColors.length]}
              strokeWidth={2}
              dot={{ r: 4, strokeWidth: 2 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
};

// ------------------------------------------
// BAR CHART
// ------------------------------------------
export interface BarChartProps extends ChartBaseProps {
  bars: { dataKey: string; name?: string; color?: string }[];
  xAxisKey?: string;
}

export const BarChart: React.FC<BarChartProps> = ({ data, height = 300, bars, xAxisKey = 'name' }) => {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <RechartsBarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
          <XAxis dataKey={xAxisKey} axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} dx={-10} />
          <Tooltip
            contentStyle={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-floating)' }}
            itemStyle={{ color: 'var(--text-main)', fontSize: 14 }}
            cursor={{ fill: 'var(--surface-hover)' }}
          />
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
          {bars.map((bar, i) => (
            <Bar
              key={bar.dataKey}
              dataKey={bar.dataKey}
              name={bar.name || bar.dataKey}
              fill={bar.color || chartColors[i % chartColors.length]}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

// ------------------------------------------
// DONUT CHART
// ------------------------------------------
export interface DonutChartProps extends ChartBaseProps {
  dataKey: string;
  nameKey?: string;
  colors?: string[];
  innerRadius?: number | string;
  outerRadius?: number | string;
}

export const DonutChart: React.FC<DonutChartProps> = ({ 
  data, 
  height = 300, 
  dataKey, 
  nameKey = 'name',
  colors = chartColors,
  innerRadius = '60%',
  outerRadius = '80%'
}) => {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <RechartsPieChart>
          <Pie
            data={data}
            dataKey={dataKey}
            nameKey={nameKey}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={2}
            stroke="var(--surface)"
            strokeWidth={2}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-floating)' }}
            itemStyle={{ color: 'var(--text-main)', fontSize: 14 }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
};
