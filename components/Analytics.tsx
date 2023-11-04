import React, { useEffect, useState } from "react";
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "../firebaseClient";
import { useAddress } from "@thirdweb-dev/react";
import {
  PieChart,
  Pie,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import UAParser from "ua-parser-js";
import dayjs from "dayjs";

interface View {
  timestamp: string;
  platform: string;
  referrer: string;
  slug: string;
}

const colorsForDevices: { [key: string]: string } = {
  Web: "#FF5733",
  Mobile: "#33FF57",
  Tablet: "#3357FF",
  Unknown: "#FF33F6",
};

const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const Analytics: React.FC = () => {
  const [viewsData, setViewsData] = useState<View[]>([]);
  const [timeframe, setTimeframe] = useState("all");

  const address = useAddress();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      let formattedLabel = label;
      let value = data.value || data.count;
  
      if (dayjs(label).isValid()) {
        const date = dayjs(label).toDate();
        switch (timeframe) {
          case "1d":
            formattedLabel = new Intl.DateTimeFormat("default", { hour: "2-digit", minute: "2-digit" }).format(date);
            break;
          case "1w":
            formattedLabel = new Intl.DateTimeFormat("default", { weekday: "short" }).format(date);
            break;
          case "1m":
            formattedLabel = new Intl.DateTimeFormat("default", { month: "short", day: "numeric" }).format(date);
            break;
          default:
            formattedLabel = new Intl.DateTimeFormat("default", { year: "numeric", month: "short", day: "numeric" }).format(date);
            break;
        }
      }
  
      if (data.name && colorsForDevices[data.name]) {
        formattedLabel = data.name;
      }
  
      if (data.name && !colorsForDevices[data.name]) {
        formattedLabel = `Referrer: ${data.name}`;
      }
  
      return (
        <div className="custom-tooltip p-2 bg-gray-800 text-white rounded-md">
          <p className="label">{`${formattedLabel} : ${value}`}</p>
        </div>
      );
    }
    return null;
  };
  

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      if (!address) {
        console.error("Address is undefined.");
        return;
      }

      const viewsRef = collection(db, "users", address, "views");
      const viewsQuery = query(viewsRef);
      const querySnapshot = await getDocs(viewsQuery);

      const data = querySnapshot.docs.map((doc) => doc.data() as View);
      setViewsData(data);
    };

    fetchAnalyticsData();
  }, [address]);

  const formatTimeframe = (timeframe: string) => {
    switch (timeframe) {
      case "1d":
        return "Last 24 Hours";
      case "1w":
        return "Last Week";
      case "1m":
        return "Last Month";
      default:
        return "All Time";
    }
  };

  const filteredData = viewsData.filter((view) => {
    const timestamp = dayjs(view.timestamp);
    switch (timeframe) {
      case "1d":
        return dayjs().diff(timestamp, "day") < 1;
      case "1w":
        return dayjs().diff(timestamp, "week") < 1;
      case "1m":
        return dayjs().diff(timestamp, "month") < 1;
      default:
        return true;
    }
  });

  const platformChartData = Object.entries(
    filteredData.reduce((acc, view) => {
      const ua = new UAParser(view.platform);
      let device: string = "Web";
      if (ua.getDevice().type) {
        device = ua.getDevice().model || ua.getDevice().type || "Unknown";
      }
      acc[device] = (acc[device] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number })
  ).map(([name, value]) => ({
    name,
    value,
    fill: colorsForDevices[name] || getRandomColor(),
  }));

  const referrerChartData = Object.entries(
    filteredData.reduce((acc, view) => {
      acc[view.referrer] = (acc[view.referrer] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number })
  ).map(([name, value]) => ({ name, value, fill: getRandomColor() }));

  const timeSeriesData = filteredData.reduce((acc, view) => {
    const date = dayjs(view.timestamp);
    const format = timeframe === "1d" ? "YYYY-MM-DD HH:00" : "YYYY-MM-DD";
    const formattedDate = date.format(format);
    acc[formattedDate] = (acc[formattedDate] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  if (timeframe === "1d") {
    for (let i = 0; i <= 24; i++) {
      const date = dayjs().subtract(i, "hour").format("YYYY-MM-DD HH:00");
      timeSeriesData[date] = timeSeriesData[date] || 0;
    }
  }

  const lineChartData = Object.entries(timeSeriesData)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => dayjs(a.date).unix() - dayjs(b.date).unix());

  return (
    <div className="analytics-container p-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold mb-2 md:mb-0">Analytics</h2>
        <div className="flex flex-col md:flex-row items-center">
          <div className="outline outline-1 p-2 rounded-md mb-2 md:mb-0 md:mr-4">
            Total Views: {filteredData.length}
          </div>
          <select
            onChange={(e) => setTimeframe(e.target.value)}
            value={timeframe}
            className="p-2 border rounded-md w-full md:w-auto"
          >
            <option value="all">All Time</option>
            <option value="1d">Last 24 Hours</option>
            <option value="1w">Last Week</option>
            <option value="1m">Last Month</option>
          </select>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-medium mb-2">Total Views Over Time</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={lineChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(str) => {
                const date = new Date(str);
                const formatterOptions = {
                  hour: "2-digit",
                  minute: "2-digit",
                  timeZoneName: "short",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                };
                switch (timeframe) {
                  case "1d":
                    return new Intl.DateTimeFormat("default", {
                      hour: "2-digit",
                      minute: "2-digit",
                    }).format(date);
                  case "1w":
                    return new Intl.DateTimeFormat("default", {
                      weekday: "short",
                    }).format(date);
                  case "1m":
                    return new Intl.DateTimeFormat("default", {
                      month: "short",
                      day: "numeric",
                    }).format(date);
                  default:
                    return new Intl.DateTimeFormat("default", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    }).format(date);
                }
              }}
            />

            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#53fc18"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-medium mb-2">
          Page Views - {formatTimeframe(timeframe)}
        </h3>
        <div className="views-list mt-4">
          <h4 className="text-lg font-medium mb-2">Device Distribution</h4>
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/2 md:pr-2 mb-4 md:mb-0">
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    dataKey="value"
                    isAnimationActive={false}
                    data={platformChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  />
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full md:w-1/2 md:pl-2">
              <ul className="list-inside list-disc">
                {platformChartData.map(({ name, value }) => (
                  <li key={name}>
                    <span className="font-bold">{name}</span>
                    <span className="ml-2">- {value} views</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-medium mb-2">Referrer Sources</h3>
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 md:pr-2 mb-4 md:mb-0">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={referrerChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="w-full md:w-1/2 md:pl-2">
            <ul className="list-inside list-disc">
              {referrerChartData.map(({ name, value }) => (
                <li key={name}>
                  <span className="font-bold">{name}</span>
                  <span className="ml-2">- {value} views</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
