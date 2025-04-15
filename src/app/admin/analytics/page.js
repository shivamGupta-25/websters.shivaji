"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RefreshCw, BarChart3, PieChartIcon, Users, Calendar } from "lucide-react";
import toast from "react-hot-toast";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
  LabelList
} from "recharts";

export default function AnalyticsPage() {
  // State management
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    events: {},
    workshops: {},
    registrations: {
      techelons: {},
      workshop: {},
    },
  });
  // Add this state to track client-side rendering
  const [isMounted, setIsMounted] = useState(false);
  // Add this state to track viewport size
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0
  });

  // Colors for charts
  const COLORS = [
    "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8",
    "#82CA9D", "#FF6B6B", "#6C63FF", "#FFD166", "#06D6A0"
  ];

  // Fetch analytics data
  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/analytics");

      if (!response.ok) {
        throw new Error("Failed to fetch analytics data");
      }

      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      toast.error("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch and setup window size tracking
  useEffect(() => {
    fetchAnalytics();
    setIsMounted(true);
    
    // Update window size
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    // Set initial size
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Memoized calculations
  const eventStats = useMemo(() => {
    const stats = analytics?.events || {};
    return {
      totalEvents: stats.totalEvents || 0,
      featuredEvents: stats.featuredEvents || 0,
      eventsByCategory: stats.eventsByCategory || {},
      registrationsByEvent: stats.registrationsByEvent || {},
    };
  }, [analytics]);

  const workshopStats = useMemo(() => {
    const stats = analytics?.workshops || {};
    return {
      totalRegistrations: stats.totalRegistrations || 0,
      registrationsByDay: stats.registrationsByDay || {},
      registrationsByYear: stats.registrationsByYear || {},
      registrationsByCourse: stats.registrationsByCourse || {},
      registrationsByCollege: stats.registrationsByCollege || {},
    };
  }, [analytics]);

  const techelonsStats = useMemo(() => {
    const stats = analytics?.registrations?.techelons || {};
    return {
      totalRegistrations: stats.totalRegistrations || 0,
      registrationsByDay: stats.registrationsByDay || {},
      registrationsByYear: stats.registrationsByYear || {},
      registrationsByCourse: stats.registrationsByCourse || {},
      registrationsByCollege: stats.registrationsByCollege || {},
      teamSizeDistribution: stats.teamSizeDistribution || {},
    };
  }, [analytics]);

  // Format numbers with commas
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Transform data for charts
  const eventCategoryData = useMemo(() => {
    return Object.entries(eventStats.eventsByCategory || {}).map(([name, value]) => ({
      name, value
    }));
  }, [eventStats.eventsByCategory]);

  const topEventsData = useMemo(() => {
    return Object.entries(eventStats.registrationsByEvent || {})
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));
  }, [eventStats.registrationsByEvent]);

  const teamSizeData = useMemo(() => {
    return Object.entries(techelonsStats.teamSizeDistribution || {})
      .sort((a, b) => Number(a[0]) - Number(b[0]))
      .map(([size, count]) => ({
        name: size === "1" ? "Solo" : `${size} Members`,
        value: count,
        isTeam: size !== "1" // Flag to indicate if this is a team or solo entry
      }));
  }, [techelonsStats.teamSizeDistribution]);

  const techelonsRegistrationTrendData = useMemo(() => {
    return Object.entries(techelonsStats.registrationsByDay || {})
      .sort((a, b) => new Date(a[0]) - new Date(b[0]))
      .map(([day, count]) => ({
        date: new Date(day).toLocaleDateString(),
        count
      }));
  }, [techelonsStats.registrationsByDay]);

  const workshopRegistrationTrendData = useMemo(() => {
    return Object.entries(workshopStats.registrationsByDay || {})
      .sort((a, b) => new Date(a[0]) - new Date(b[0]))
      .map(([day, count]) => ({
        date: new Date(day).toLocaleDateString(),
        count
      }));
  }, [workshopStats.registrationsByDay]);

  const yearDistributionData = useMemo(() => {
    const techelonsYears = Object.entries(techelonsStats.registrationsByYear || {})
      .map(([year, count]) => ({ year, techelons: count, workshop: 0 }));

    const workshopYears = Object.entries(workshopStats.registrationsByYear || {});

    workshopYears.forEach(([year, count]) => {
      const existingYear = techelonsYears.find(item => item.year === year);
      if (existingYear) {
        existingYear.workshop = count;
      } else {
        techelonsYears.push({ year, techelons: 0, workshop: count });
      }
    });

    return techelonsYears;
  }, [techelonsStats.registrationsByYear, workshopStats.registrationsByYear]);

  const courseDistributionData = useMemo(() => {
    return Object.entries(techelonsStats.registrationsByCourse || {})
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([course, count]) => ({ name: course, count }));
  }, [techelonsStats.registrationsByCourse]);

  const collegeDistributionData = useMemo(() => {
    return Object.entries(workshopStats.registrationsByCollege || {})
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([college, count]) => ({ name: college, count }));
  }, [workshopStats.registrationsByCollege]);

  const techelonsCollegeData = useMemo(() => {
    return Object.entries(techelonsStats.registrationsByCollege || {})
      .sort((a, b) => b[1] - a[1])
      .slice(0, 7)
      .map(([college, count]) => ({ name: college, count }));
  }, [techelonsStats.registrationsByCollege]);

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      // Check if this is Techelons college or course data
      const isTechelonsData = payload.some(entry => 
        (entry.name === "Registrations" && 
          (label.includes("Engineering") || label.includes("Technology") || 
           label.includes("Science") || label.includes("Arts") || 
           label.includes("Commerce") || label.includes("B.") || 
           label.includes("M.") || label.includes("PhD")))
      );
      
      // Check if this is team size data
      const isTeamSizeData = payload.some(entry => entry.payload?.isTeam !== undefined);
      
      return (
        <div className="bg-white p-3 border rounded shadow-md">
          <p className="font-medium">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
          {isTechelonsData && (
            <p className="text-xs text-gray-500 mt-1">*From main participants only</p>
          )}
          {isTeamSizeData && payload[0]?.payload?.isTeam && (
            <p className="text-xs text-gray-500 mt-1">Team event registrations</p>
          )}
          {isTeamSizeData && !payload[0]?.payload?.isTeam && (
            <p className="text-xs text-gray-500 mt-1">Solo event registrations</p>
          )}
        </div>
      );
    }
    return null;
  };

  // Helper function to determine responsive values based on screen size
  const getResponsiveValue = (mobile, tablet, desktop) => {
    if (!isMounted) return desktop; // Default for server-side rendering
    const width = windowSize.width;
    if (width < 480) return mobile;
    if (width < 640) return tablet;
    return desktop;
  };

  // Only render charts if client-side
  if (!isMounted) {
    return (
      <div className="w-full px-2 py-2 sm:container sm:mx-auto sm:py-4 md:px-4 md:py-6">
        <div className="mb-4 flex flex-col gap-2 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-xl font-bold md:text-2xl lg:text-3xl">Analytics Dashboard</h1>
          <Button
            variant="outline"
            disabled={true}
            size="sm"
            className="text-xs sm:text-sm"
          >
            <RefreshCw className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4 animate-spin" />
            Loading Data...
          </Button>
        </div>
        {/* Loading state */}
        <div className="flex items-center justify-center h-96">
          <RefreshCw className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-2 py-2 sm:container sm:mx-auto sm:py-4 md:px-4 md:py-6">
      <div className="mb-4 flex flex-col gap-2 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-bold md:text-2xl lg:text-3xl">Analytics Dashboard</h1>
        <Button
          variant="outline"
          onClick={fetchAnalytics}
          disabled={loading}
          size="sm"
          className="text-xs sm:text-sm"
        >
          <RefreshCw className={`mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh Data
        </Button>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4 grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="techelons">Techelons</TabsTrigger>
          <TabsTrigger value="workshop">Workshop</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Total Events Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(eventStats.totalEvents)}</div>
                <p className="text-xs text-muted-foreground">
                  {formatNumber(eventStats.featuredEvents)} featured events
                </p>
              </CardContent>
            </Card>

            {/* Techelons Registrations Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Techelons Registrations</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(techelonsStats.totalRegistrations)}</div>
                <p className="text-xs text-muted-foreground">
                  Across {Object.keys(eventStats.registrationsByEvent).length} events
                </p>
              </CardContent>
            </Card>

            {/* Workshop Registrations Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Workshop Registrations</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(workshopStats.totalRegistrations)}</div>
                <p className="text-xs text-muted-foreground">
                  Workshop participation stats
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Events by Category */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Events by Category</CardTitle>
                <CardDescription>Distribution of events across categories</CardDescription>
              </CardHeader>
              <CardContent className="h-[250px] sm:h-[300px] md:h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={eventCategoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={getResponsiveValue(40, 50, 60)}
                      outerRadius={getResponsiveValue(60, 70, 80)}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, value, percent }) => 
                        getResponsiveValue(
                          `${(percent * 100).toFixed(0)}%`,
                          `${(percent * 100).toFixed(0)}%`,
                          `${name} (${value}, ${(percent * 100).toFixed(0)}%)`
                        )
                      }
                    >
                      {eventCategoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend layout={getResponsiveValue("horizontal", "horizontal", "vertical")} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Top Events by Registration */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Top Events by Registration</CardTitle>
                <CardDescription>Events with most participants</CardDescription>
              </CardHeader>
              <CardContent className="h-[250px] sm:h-[300px] md:h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={topEventsData}
                    margin={{
                      top: 5,
                      right: getResponsiveValue(5, 20, 30),
                      left: getResponsiveValue(5, 10, 20),
                      bottom: 60,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      height={60}
                      interval={0}
                      fontSize={getResponsiveValue(10, 11, 12)}
                    />
                    <YAxis fontSize={getResponsiveValue(10, 11, 12)} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" fill="#0088FE" name="Registrations">
                      {topEventsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                      <LabelList dataKey="count" position="top" fontSize={getResponsiveValue(10, 11, 12)} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Registration Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Registration Trends</CardTitle>
              <CardDescription>Comparison of registrations over time</CardDescription>
            </CardHeader>
            <CardContent className="h-[280px] sm:h-[320px] md:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={[...techelonsRegistrationTrendData, ...workshopRegistrationTrendData]
                    .reduce((acc, cur) => {
                      const existingItem = acc.find(item => item.date === cur.date);
                      if (existingItem) {
                        if ('count' in cur) existingItem.techelons = cur.count;
                        else existingItem.workshop = cur.count;
                      } else {
                        if ('count' in cur) acc.push({ date: cur.date, techelons: cur.count, workshop: 0 });
                        else acc.push({ date: cur.date, techelons: 0, workshop: cur.count });
                      }
                      return acc;
                    }, [])
                    .sort((a, b) => new Date(a.date) - new Date(b.date))
                  }
                  margin={{
                    top: 10,
                    right: getResponsiveValue(5, 20, 30),
                    left: getResponsiveValue(0, 0, 0),
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" fontSize={getResponsiveValue(10, 11, 12)} />
                  <YAxis fontSize={getResponsiveValue(10, 11, 12)} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area type="monotone" dataKey="techelons" stackId="1" stroke="#8884d8" fill="#8884d8" name="Techelons" />
                  <Area type="monotone" dataKey="workshop" stackId="1" stroke="#82ca9d" fill="#82ca9d" name="Workshop" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Year Distribution Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Year Distribution Comparison</CardTitle>
              <CardDescription>Registrations by student year for both programs (Techelons: main participants only)</CardDescription>
            </CardHeader>
            <CardContent className="h-[250px] sm:h-[300px] md:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={yearDistributionData}
                  margin={{
                    top: 20,
                    right: getResponsiveValue(5, 20, 30),
                    left: getResponsiveValue(5, 10, 20),
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" fontSize={getResponsiveValue(10, 11, 12)} />
                  <YAxis fontSize={getResponsiveValue(10, 11, 12)} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="techelons" fill="#8884d8" name="Techelons">
                    <LabelList dataKey="techelons" position="top" fontSize={getResponsiveValue(10, 11, 12)} />
                  </Bar>
                  <Bar dataKey="workshop" fill="#82ca9d" name="Workshop">
                    <LabelList dataKey="workshop" position="top" fontSize={getResponsiveValue(10, 11, 12)} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Techelons Tab */}
        <TabsContent value="techelons" className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Registrations by Event */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Registrations by Event</CardTitle>
                <CardDescription>Total registrations for each event</CardDescription>
              </CardHeader>
              <CardContent className="h-[320px] sm:h-[400px] md:h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={Object.entries(eventStats.registrationsByEvent || {})
                      .sort((a, b) => b[1] - a[1])
                      .map(([name, count]) => ({ name, count }))}
                    margin={{
                      top: 5,
                      right: getResponsiveValue(5, 20, 30),
                      left: getResponsiveValue(5, 10, 20),
                      bottom: 70,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      height={70}
                      interval={0}
                      fontSize={getResponsiveValue(8, 10, 12)}
                    />
                    <YAxis fontSize={getResponsiveValue(10, 11, 12)} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" fill="#0088FE" name="Registrations">
                      {Object.entries(eventStats.registrationsByEvent || {})
                        .sort((a, b) => b[1] - a[1])
                        .map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      <LabelList dataKey="count" position="top" fontSize={getResponsiveValue(10, 11, 12)} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Registrations by Course */}
            <Card>
              <CardHeader>
                <CardTitle>Registrations by Course</CardTitle>
                <CardDescription>Distribution by course (top 5) - main participants only</CardDescription>
              </CardHeader>
              <CardContent className="h-[250px] sm:h-[320px] md:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={courseDistributionData}
                    margin={{
                      top: 5,
                      right: getResponsiveValue(5, 20, 30),
                      left: getResponsiveValue(5, 10, 20),
                      bottom: 60,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      height={60}
                      interval={0}
                      fontSize={getResponsiveValue(10, 11, 12)}
                    />
                    <YAxis fontSize={getResponsiveValue(10, 11, 12)} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" fill="#8884d8" name="Registrations">
                      {courseDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                      <LabelList dataKey="count" position="top" fontSize={getResponsiveValue(10, 11, 12)} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Team Size Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Team Size Distribution</CardTitle>
                <CardDescription>Number of registrations by team size (team and solo events)</CardDescription>
              </CardHeader>
              <CardContent className="h-[250px] sm:h-[320px] md:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={teamSizeData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={getResponsiveValue(60, 70, 80)}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value, percent }) => 
                        getResponsiveValue(
                          `${(percent * 100).toFixed(0)}%`,
                          `${(percent * 100).toFixed(0)}%`,
                          `${name} (${value}, ${(percent * 100).toFixed(0)}%)`
                        )
                      }
                    >
                      {teamSizeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend layout={getResponsiveValue("horizontal", "horizontal", "vertical")} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Registrations by College */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Registrations by College</CardTitle>
                <CardDescription>Distribution by college (top 7) - main participants only</CardDescription>
              </CardHeader>
              <CardContent className="h-[260px] sm:h-[320px] md:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={techelonsCollegeData}
                    margin={{
                      top: 5,
                      right: getResponsiveValue(5, 20, 30),
                      left: getResponsiveValue(5, 10, 20),
                      bottom: 60,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      height={60}
                      interval={0}
                      fontSize={getResponsiveValue(8, 10, 12)}
                    />
                    <YAxis fontSize={getResponsiveValue(10, 11, 12)} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" fill="#FFBB28" name="Registrations">
                      {techelonsCollegeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                      ))}
                      <LabelList dataKey="count" position="top" fontSize={getResponsiveValue(10, 11, 12)} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Registrations by Day */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Daily Registration Trend</CardTitle>
                <CardDescription>Registrations over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[260px] sm:h-[320px] md:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={techelonsRegistrationTrendData}
                    margin={{
                      top: 5,
                      right: getResponsiveValue(5, 20, 30),
                      left: getResponsiveValue(5, 10, 20),
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" fontSize={getResponsiveValue(10, 11, 12)} />
                    <YAxis fontSize={getResponsiveValue(10, 11, 12)} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                      name="Registrations"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Workshop Tab */}
        <TabsContent value="workshop" className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Workshop Registration by Year */}
            <Card>
              <CardHeader>
                <CardTitle>Registrations by Year</CardTitle>
                <CardDescription>Distribution by student year - main participants only</CardDescription>
              </CardHeader>
              <CardContent className="h-[250px] sm:h-[320px] md:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={Object.entries(workshopStats.registrationsByYear || {})
                        .map(([name, value]) => ({ name, value }))}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={getResponsiveValue(60, 70, 80)}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value, percent }) => 
                        getResponsiveValue(
                          `${(percent * 100).toFixed(0)}%`,
                          `${(percent * 100).toFixed(0)}%`,
                          `${name} (${value}, ${(percent * 100).toFixed(0)}%)`
                        )
                      }
                    >
                      {Object.entries(workshopStats.registrationsByYear || {}).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend layout={getResponsiveValue("horizontal", "horizontal", "vertical")} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Workshop Registration by Course */}
            <Card>
              <CardHeader>
                <CardTitle>Registrations by Course</CardTitle>
                <CardDescription>Distribution by course (top 5)</CardDescription>
              </CardHeader>
              <CardContent className="h-[250px] sm:h-[320px] md:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={Object.entries(workshopStats.registrationsByCourse || {})
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 5)
                      .map(([course, count]) => ({ name: course, count }))}
                    margin={{
                      top: 5,
                      right: getResponsiveValue(5, 20, 30),
                      left: getResponsiveValue(5, 10, 20),
                      bottom: 60,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      height={60}
                      interval={0}
                      fontSize={getResponsiveValue(10, 11, 12)}
                    />
                    <YAxis fontSize={getResponsiveValue(10, 11, 12)} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" fill="#82ca9d" name="Registrations">
                      {Object.entries(workshopStats.registrationsByCourse || {})
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 5)
                        .map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      <LabelList dataKey="count" position="top" fontSize={getResponsiveValue(10, 11, 12)} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Workshop Registration by Day */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Daily Registration Trend</CardTitle>
                <CardDescription>Registrations over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[260px] sm:h-[320px] md:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={workshopRegistrationTrendData}
                    margin={{
                      top: 5,
                      right: getResponsiveValue(5, 20, 30),
                      left: getResponsiveValue(5, 10, 20),
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" fontSize={getResponsiveValue(10, 11, 12)} />
                    <YAxis fontSize={getResponsiveValue(10, 11, 12)} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#82ca9d"
                      activeDot={{ r: 8 }}
                      name="Registrations"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}