"use client";

import React, { useEffect, useState } from "react";
import { getReviews } from "@/utils/api"; // your API returning dummy or live data
import { Star, Search, User, BookOpen, Calendar } from "lucide-react";
import Link from "next/link";
import { Spinner } from "../../../components/ui/spinner";
import type { Review } from "@/types";

export default function MentorReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "5" | "4" | "3" | "recent">("all");

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const data = await getReviews();
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

  const filteredReviews = reviews
    .filter((r) =>
      searchQuery.trim()
        ? (r.courseName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (r.menteeName || "").toLowerCase().includes(searchQuery.toLowerCase())
        : true
    )
    .filter((r) => {
      if (filter === "recent") {
        const now = Date.now();
        const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
        return new Date(r.date).getTime() >= weekAgo;
      }
      if (["5", "4", "3"].includes(filter)) {
        return Math.floor(r.rating) === parseInt(filter);
      }
      return true;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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
            <h2 className="text-3xl font-bold text-foreground">Reviews</h2>
            <p className="text-sm text-muted-foreground">
              Read what your mentees think about your courses and mentorship.
            </p>
          </div>

          <Link
            href="/mentor/courses"
            className="px-4 py-2 text-primary rounded-lg font-semibold"
          >
            ← Back to Courses
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <div className="relative w-full md:w-1/2">
            <Search className="absolute left-3 top-2.5 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Search by mentee or course..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex gap-2">
            {["all", "recent", "5", "4", "3"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  filter === f
                    ? "bg-primary text-white"
                    : "bg-white border border-border text-muted-foreground hover:bg-primary/5"
                }`}
              >
                {f === "all"
                  ? "All"
                  : f === "recent"
                  ? "Recent"
                  : `${f}-Star`}
              </button>
            ))}
          </div>
        </div>

        {/* Review Cards */}
        {filteredReviews.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReviews.map((r) => (
              <div
                key={r.id}
                className="bg-white rounded-2xl border border-border p-6 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{r.menteeName}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(r.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.round(r.rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="mb-4 border-b pb-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <BookOpen className="w-4 h-4" />
                    <span>{r.courseName}</span>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {r.comment || "No comment provided."}
                </p>

                <div className="flex items-center justify-end gap-2 text-xs text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(r.date).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground mt-16">
            <p className="text-lg font-medium">No reviews found</p>
            <p className="text-sm">Once mentees complete your courses, their feedback will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
