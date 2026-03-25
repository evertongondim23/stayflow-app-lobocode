import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { useHotel } from "../../context/HotelContext";
import type { LucideIcon } from "lucide-react";
import {
  DollarSign,
  Users,
  BedDouble,
  TrendingUp,
  CalendarCheck,
  Clock,
} from "lucide-react";
import { Card, CardContent } from "../../components/ui";

export function AdminDashboard() {
  const { revenueStats, reservations, rooms } = useHotel();

  // --- KPI Calculations ---
  // Ensure we have data to prevent crashes
  const safeRevenueStats = revenueStats || [];

  const totalRevenue = safeRevenueStats.reduce(
    (acc, curr) => acc + curr.revenue,
    0,
  );
  const totalExpenses = safeRevenueStats.reduce(
    (acc, curr) => acc + curr.expenses,
    0,
  );
  const profit = totalRevenue - totalExpenses;

  const occupiedRooms = rooms
    ? rooms.filter((r) => r.status === "OCCUPIED").length
    : 0;
  const totalRooms = rooms ? rooms.length : 1;
  const occupancyRate = Math.round((occupiedRooms / totalRooms) * 100);

  const checkInsToday = reservations
    ? reservations.filter((r) => r.status === "CHECKED_IN").length
    : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Receita Total (7d)"
          value={`R$ ${totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          trend="+12%"
          trendUp={true}
          color="bg-emerald-500"
        />
        <KPICard
          title="Taxa de Ocupação"
          value={`${occupancyRate}%`}
          icon={BedDouble}
          trend="-5%"
          trendUp={false}
          color="bg-sky-500"
        />
        <KPICard
          title="Hóspedes Ativos"
          value={checkInsToday.toString()}
          icon={Users}
          trend="+2"
          trendUp={true}
          color="bg-purple-500"
        />
        <KPICard
          title="Lucro Líquido"
          value={`R$ ${profit.toLocaleString()}`}
          icon={TrendingUp}
          trend="+8%"
          trendUp={true}
          color="bg-orange-500"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue vs Expenses Chart */}
        <Card className="shadow-sm border-slate-200">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800">
              Receita vs Despesas
            </h3>
            <select className="text-sm border-slate-200 rounded-md text-slate-500 bg-slate-50">
              <option>Últimos 7 dias</option>
              <option>Último Mês</option>
            </select>
          </div>
          <CardContent className="p-6">
            <div className="w-full h-[300px] min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={safeRevenueStats} barGap={0}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748b" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748b" }}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                    cursor={{ fill: "#f8fafc" }}
                  />
                  <Legend />
                  <Bar
                    dataKey="revenue"
                    name="Receita"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="expenses"
                    name="Despesas"
                    fill="#ef4444"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Occupancy Trend Area Chart */}
        <Card className="shadow-sm border-slate-200">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800">
              Tendência de Ocupação
            </h3>
            <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
              Tempo Real
            </span>
          </div>
          <CardContent className="p-6">
            <div className="w-full h-[300px] min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={safeRevenueStats}>
                  <defs>
                    <linearGradient
                      id="colorRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748b" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748b" }}
                  />
                  <RechartsTooltip />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#0ea5e9"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Operational Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsRow
          icon={Clock}
          label="Tempo Médio de Atendimento"
          value="4m 30s"
        />
        <StatsRow icon={CalendarCheck} label="% Pré-Checkin" value="68%" />
        <StatsRow icon={Users} label="No-Shows (Mês)" value="3" />
      </div>
    </div>
  );
}

// --- Helper Components ---

type KPICardProps = {
  title: string;
  value: string;
  icon: LucideIcon;
  trend: string;
  trendUp: boolean;
  color: string;
};

function KPICard({
  title,
  value,
  icon: Icon,
  trend,
  trendUp,
  color,
}: KPICardProps) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
        </div>
        <div
          className={`flex shrink-0 items-center justify-center rounded-lg p-3 ${color}`}
          aria-hidden
        >
          <Icon size={24} className="text-white" strokeWidth={2} />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span
          className={`text-xs font-bold px-1.5 py-0.5 rounded ${trendUp ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
        >
          {trend}
        </span>
        <span className="text-xs text-slate-400">vs. período anterior</span>
      </div>
    </div>
  );
}

type StatsRowProps = { icon: LucideIcon; label: string; value: string };

function StatsRow({ icon: Icon, label, value }: StatsRowProps) {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div
          className="flex items-center justify-center rounded-lg bg-slate-800 p-2"
          aria-hidden
        >
          <Icon size={20} className="text-white" strokeWidth={2} />
        </div>
        <span className="font-medium text-slate-600">{label}</span>
      </div>
      <span className="text-lg font-bold text-slate-800">{value}</span>
    </div>
  );
}
