import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const DataVisualization = () => {
  const { data: session } = useSession();
  const [stats, setStats] = useState({
    users: 0,
    posts: 0,
    comments: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (session?.user?.isAdmin) {
      const fetchStats = async () => {
        try {
          setLoading(true);
          setError(null);
          
          // Fetch all data from JSONPlaceholder
          const [usersRes, postsRes, commentsRes] = await Promise.all([
            fetch('https://jsonplaceholder.typicode.com/users'),
            fetch('https://jsonplaceholder.typicode.com/posts'),
            fetch('https://jsonplaceholder.typicode.com/comments')
          ]);

          if (!usersRes.ok || !postsRes.ok || !commentsRes.ok) {
            throw new Error('Failed to fetch data');
          }

          const [users, posts, comments] = await Promise.all([
            usersRes.json(),
            postsRes.json(),
            commentsRes.json()
          ]);

          setStats({
            users: users.length,
            posts: posts.length,
            comments: comments.length
          });
        } catch (error) {
          console.error('Error fetching stats:', error);
          setError('Failed to load statistics');
        } finally {
          setLoading(false);
        }
      };

      fetchStats();
    }
  }, [session]);

  if (!session?.user?.isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center p-20 max-w-6xl mx-auto">
  <h2 className="text-1xl text-center text-gray-800">Data visualizations are only available to admin users</h2>
</div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        {error}
      </div>
    );
  }

  const chartOptions = {
    chart: {
      type: 'donut',
      toolbar: {
        show: true
      }
    },
    labels: ['Users', 'Posts', 'Comments'],
    colors: ['#8B5CF6', '#EC4899', '#10B981'],
    legend: {
      position: 'bottom'
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return Math.round(val) + '%';
      }
    },
    tooltip: {
      y: {
        formatter: function (value) {
          return value.toLocaleString();
        }
      }
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: '100%'
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  };

  const chartSeries = [stats.users, stats.posts, stats.comments];

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Admin Dashboard Analytics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
        <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 mr-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.users.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-pink-100 mr-4">
              <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Posts</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.posts.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 mr-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Comments</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.comments.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Data Distribution</h3>
        <Chart
          options={chartOptions}
          series={chartSeries}
          type="donut"
          height={300}
        />
      </div>
    </div>
  );
};

export default DataVisualization;