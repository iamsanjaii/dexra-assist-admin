"use client";

import { useState, useEffect } from "react";
import { fetchDashboardStats, fetchRecentUploads, fetchActivityFeed } from "@/services/api";

export function useDashboard() {
  const [stats, setStats] = useState(null);
  const [recentUploads, setRecentUploads] = useState([]);
  const [activityFeed, setActivityFeed] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        const [statsData, uploadsData, activityData] = await Promise.all([
          fetchDashboardStats(),
          fetchRecentUploads(),
          fetchActivityFeed(),
        ]);
        setStats(statsData);
        setRecentUploads(uploadsData);
        setActivityFeed(activityData);
      } catch (err) {
        setError("Failed to load dashboard data.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  return { stats, recentUploads, activityFeed, isLoading, error };
}
