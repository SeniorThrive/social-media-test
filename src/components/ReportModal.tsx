import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { useAuth } from "../context/AuthContext";
import { ReportInput } from "../types/auth";
import { Button } from "./ui/Button";
import { Textarea } from "./ui/Textarea";
import { Typography } from "./ui/Typography";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  itemId: number;
  itemType: 'post' | 'comment';
  itemTitle?: string;
}

const createReport = async (report: ReportInput) => {
  const { error } = await supabase
    .from('reports')
    .insert(report);

  if (error) throw new Error(error.message);
};

const reportReasons = [
  'Spam or unwanted content',
  'Harassment or bullying',
  'Inappropriate content',
  'Misinformation',
  'Hate speech',
  'Violence or threats',
  'Other'
];

export const ReportModal = ({ isOpen, onClose, itemId, itemType, itemTitle }: Props) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: createReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      onClose();
      setSelectedReason('');
      setCustomReason('');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedReason) return;

    const reason = selectedReason === 'Other' ? customReason : selectedReason;
    
    mutate({
      reported_item_id: itemId,
      reported_item_type: itemType,
      reason: reason.trim(),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Typography variant="h2" className="text-gray-900">
              Report {itemType}
            </Typography>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {itemTitle && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <Typography variant="caption" className="text-gray-600 mb-1">
                Reporting:
              </Typography>
              <Typography variant="body" className="text-gray-900 font-medium">
                {itemTitle}
              </Typography>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Typography variant="body" className="block mb-3 font-medium text-gray-900">
                Why are you reporting this {itemType}?
              </Typography>
              <div className="space-y-2">
                {reportReasons.map((reason) => (
                  <label key={reason} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="reason"
                      value={reason}
                      checked={selectedReason === reason}
                      onChange={(e) => setSelectedReason(e.target.value)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <Typography variant="body" className="text-gray-700">
                      {reason}
                    </Typography>
                  </label>
                ))}
              </div>
            </div>

            {selectedReason === 'Other' && (
              <div>
                <Typography variant="body" className="block mb-2 font-medium text-gray-900">
                  Please specify:
                </Typography>
                <Textarea
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="Describe the issue..."
                  rows={3}
                  required
                />
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                variant="primary"
                disabled={isPending || !selectedReason || (selectedReason === 'Other' && !customReason.trim())}
                className="flex-1"
              >
                {isPending ? 'Submitting...' : 'Submit Report'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isPending}
              >
                Cancel
              </Button>
            </div>

            {isError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <Typography variant="caption" className="text-red-700">
                  Error submitting report: {error?.message || 'Please try again.'}
                </Typography>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};