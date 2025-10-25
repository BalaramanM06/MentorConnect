"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getReviewsByMentee, updateReview, deleteReview } from "@/utils/api";
import { Star, Edit3, Trash2, Save, X, BookOpen, Calendar } from "lucide-react";
import { Spinner } from "../../../components/ui/spinner";
import type { Review } from "@/types";

export default function MenteeReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [editData, setEditData] = useState<{ rating: number; comment: string }>({
    rating: 0,
    comment: "",
  });

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const data = await getReviewsByMentee();
        setReviews(data || []);
      } catch (e) {
        console.error("Error loading reviews:", e);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };
    loadReviews();
  }, []);

  const handleEdit = (review: Review) => {
    setEditingReviewId(review.id);
    setEditData({ rating: review.rating, comment: review.comment || "" });
  };

  const handleSave = async (id: string) => {
    try {
      const updated = await updateReview(id, editData);
      setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, ...updated } : r)));
      setEditingReviewId(null);
    } catch (e) {
      console.error("Failed to update review:", e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      await deleteReview(id);
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch (e) {
      console.error("Failed to delete review:", e);
    }
  };

  const handleRatingClick = (rating: number) => {
    setEditData((prev) => ({ ...prev, rating }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">
              View, edit, or remove your feedback on completed courses
            </p>
          </div>

          <Link
            href="/mentee/explore-courses"
            className="px-4 py-2 text-primary rounded-lg font-semibold"
          >
            ← Back to Courses
          </Link>
        </div>

        {/* Review Cards */}
        {reviews.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((r) => (
              <div
                key={r.id}
                className="bg-white rounded-2xl border border-border p-6 shadow-sm hover:shadow-md transition-all duration-200"
              >
                {/* Top Section */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <BookOpen className="w-4 h-4" />
                    <span className="font-medium">{r.courseName}</span>
                  </div>

                  <div className="flex gap-2">
                    {editingReviewId === r.id ? (
                      <>
                        <button
                          onClick={() => handleSave(r.id)}
                          className="p-2 rounded-lg text-primary-700 transition"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingReviewId(null)}
                          className="p-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 transition"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(r)}
                          className="p-2 rounded-lg hover:bg-primary-200 text-primary-700 transition"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(r.id)}
                          className="p-2 rounded-lg bg-red-100 hover:bg-red-200 text-primary-700 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Rating Stars */}
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 cursor-pointer transition ${
                        i < (editingReviewId === r.id ? editData.rating : r.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300 hover:text-yellow-400"
                      }`}
                      onClick={() =>
                        editingReviewId === r.id && handleRatingClick(i + 1)
                      }
                    />
                  ))}
                </div>

                {/* Comment Section */}
                {editingReviewId === r.id ? (
                  <textarea
                    value={editData.comment}
                    onChange={(e) =>
                      setEditData((prev) => ({ ...prev, comment: e.target.value }))
                    }
                    className="w-full text-sm border border-border rounded-lg p-2 focus:ring-2 focus:ring-primary outline-none"
                    rows={4}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {r.comment || "No comment provided."}
                  </p>
                )}

                {/* Date */}
                <div className="flex items-center justify-end gap-2 text-xs text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(r.date).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground mt-16">
            <p className="text-lg font-medium">No reviews yet</p>
            <p className="text-sm">
              Once you complete a course, you’ll be able to leave and manage reviews here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
