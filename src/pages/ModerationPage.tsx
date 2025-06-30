import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabase-client";
import { Report } from "../types/auth";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Typography } from "../components/ui/Typography";

const fetchReports = async (): Promise<Report[]> => {
  const { data, error } = await supabase
    .from('reports')
    .select(`
      *,
      reporter:reporter_id(email),
      reviewer:reviewed_by(email)
    `)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data as Report[];
};

const updateReportStatus = async (reportId: string, status: string, reviewerId: string) => {
  const { error } = await supabase
    .from('reports')
    .update({
      status,
      reviewed_at: new Date().toISOString(),
      reviewed_by: reviewerId
    })
    .eq('id', reportId);

  if (error) throw new Error(error.message);
};

export const ModerationPage = () => {
  const [filter, setFilter] = useState<string>('pending');
  const { profile, user } = useAuth();
  const queryClient = useQueryClient();

  // Redirect non-moderators
  if (!profile?.is_moderator) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 max-w-md mx-auto text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <Typography variant="h2" className="mb-4 text-gray-900">
            Access Restricted
          </Typography>
          <Typography variant="body" className="text-gray-600">
            Only moderators can access the moderation dashboard.
          </Typography>
        </Card>
      </div>
    );
  }

  const { data: reports, isLoading, error } = useQuery<Report[], Error>({
    queryKey: ['reports'],
    queryFn: fetchReports,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { mutate: updateStatus } = useMutation({
    mutationFn: ({ reportId, status }: { reportId: string; status: string }) =>
      updateReportStatus(reportId, status, user!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });

  const filteredReports = reports?.filter(report => 
    filter === 'all' ? true : report.status === filter
  ) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'dismissed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Typography variant="h1" className="mb-8 text-center">
            Moderation Dashboard
          </Typography>
          <div className="text-center">
            <Typography variant="body">Loading reports...</Typography>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Typography variant="h1" className="mb-8 text-center">
            Moderation Dashboard
          </Typography>
          <div className="text-center">
            <Typography variant="body" className="text-red-600">
              Error loading reports: {error.message}
            </Typography>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Typography variant="h1" className="mb-8 text-center text-orange-600">
          Moderation Dashboard
        </Typography>

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {[
              { key: 'pending', label: 'Pending' },
              { key: 'reviewed', label: 'Reviewed' },
              { key: 'resolved', label: 'Resolved' },
              { key: 'dismissed', label: 'Dismissed' },
              { key: 'all', label: 'All' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filter === key
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {label} ({reports?.filter(r => key === 'all' ? true : r.status === key).length || 0})
              </button>
            ))}
          </div>
        </div>

        {/* Reports List */}
        <div className="space-y-4">
          {filteredReports.length === 0 ? (
            <Card className="p-8 text-center">
              <Typography variant="body" className="text-gray-500">
                No {filter === 'all' ? '' : filter} reports found.
              </Typography>
            </Card>
          ) : (
            filteredReports.map((report) => (
              <Card key={report.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                        {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                      </span>
                      <Typography variant="caption" className="text-gray-500">
                        {report.reported_item_type.charAt(0).toUpperCase() + report.reported_item_type.slice(1)} #{report.reported_item_id}
                      </Typography>
                      <Typography variant="caption" className="text-gray-500">
                        {new Date(report.created_at).toLocaleDateString()}
                      </Typography>
                    </div>
                    <Typography variant="body" className="text-gray-900 mb-2">
                      <strong>Reason:</strong> {report.reason}
                    </Typography>
                    <Typography variant="caption" className="text-gray-600">
                      Reported by: {(report as any).reporter?.email || 'Unknown'}
                    </Typography>
                    {report.reviewed_at && (
                      <Typography variant="caption" className="text-gray-600 block">
                        Reviewed on: {new Date(report.reviewed_at).toLocaleDateString()} by {(report as any).reviewer?.email || 'Unknown'}
                      </Typography>
                    )}
                  </div>
                  
                  {report.status === 'pending' && (
                    <div className="flex space-x-2">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => updateStatus({ reportId: report.id, status: 'resolved' })}
                      >
                        Resolve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateStatus({ reportId: report.id, status: 'dismissed' })}
                      >
                        Dismiss
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};