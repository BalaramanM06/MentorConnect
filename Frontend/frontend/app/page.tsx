"use client";

import React, { Suspense, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight, BookOpen, Users, Zap, Bolt, Award, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import clsx from "clsx";

// Dynamic 3D Scene
const ThreeDScene = dynamic(() => import("../components/ThreeDScene"), {
  ssr: false,
  loading: () => <ThreeDSceneSkeleton />,
});

// Features Data
const FEATURES = [
  { id: "mentors", icon: Users, title: "Expert Mentors", description: "Learn from industry professionals with deep domain experience." },
  { id: "courses", icon: BookOpen, title: "Structured Courses", description: "Hands-on, project-based courses with measurable outcomes." },
  { id: "realtime", icon: Zap, title: "Real-time Support", description: "Live sessions and immediate mentor feedback for fast progress." },
  { id: "certificates", icon: Award, title: "Certificates", description: "Earn shareable certificates when you complete a course." },
  { id: "sessions", icon: Clock, title: "Scheduled Sessions", description: "Book and join mentor sessions with conflict-free scheduling." },
  { id: "fast", icon: Bolt, title: "Fast Onboarding", description: "Sign up and get matched with a mentor in minutes." },
];

// Role-Based Routing
type Role = "MENTOR" | "MENTEE" | null;
const formatRolePath = (role: Role) => role === "MENTOR" ? "/mentor/dashboard" : role === "MENTEE" ? "/mentee/dashboard" : "/login";
const formatRolePathToCourse = (role: Role) => role === "MENTOR" ? "/mentor/courses" : role === "MENTEE" ? "/mentee/explore-courses" : "/login";

// CTA Button
function CTA({ label, href, onClick, dark = true, icon }: { label: string; href?: string; onClick?: () => void; dark?: boolean; icon?: React.ReactNode }) {
  const base = "inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-transform transform";
  const darkStyle = "bg-black text-white hover:scale-[1.03] active:scale-[0.98] shadow";
  const lightStyle = "bg-white text-black border border-gray-300 hover:scale-[1.03] active:scale-[0.98] shadow-sm";

  const classes = clsx(base, dark ? darkStyle : lightStyle);

  if (href) return <Link href={href} className={classes}>{label} {icon || <ArrowRight className="w-4 h-4" />}</Link>;
  return <button onClick={onClick} className={classes}>{label} {icon || <ArrowRight className="w-4 h-4" />}</button>;
}

// Skeleton for 3D Scene
function ThreeDSceneSkeleton() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-white">
      <div className="animate-pulse w-3/4 h-3/4 rounded-2xl bg-gray-100 shadow-inner" />
    </div>
  );
}

// Feature Card
function FeatureCard({ icon: Icon, title, description }: { icon: any; title: string; description: string }) {
  return (
    <article className="group bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transform transition-all hover:-translate-y-1">
      <div className="flex items-center gap-4 mb-3">
        <div className="w-14 h-14 flex items-center justify-center rounded-md bg-black text-white">
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-semibold text-lg text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </article>
  );
}

// Right Content
function RightContent({ onNavigateToDashboard, onNavigateToCourses, userRole, isLoggedIn }: { onNavigateToDashboard: () => void; onNavigateToCourses: () => void; userRole: Role; isLoggedIn: boolean }) {
  return (
    <div className="px-8 py-12 max-w-3xl w-full">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900">
        Connect with Expert Mentors
      </h1>
      <p className="mt-4 text-lg text-gray-600 max-w-xl">
        Personalized mentorship, structured courses, and real-time sessions to accelerate your career.
      </p>

      <div className="mt-6 flex gap-4 flex-wrap">
        {isLoggedIn ? (
          <CTA label="Go to Dashboard" onClick={onNavigateToDashboard} dark />
        ) : (
          <>
            <CTA label="Login" href="/login" dark />
            <CTA label="Sign Up" href="/signup" dark={false} />
          </>
        )}
        <CTA label="Explore Courses" onClick={onNavigateToCourses} dark={false} icon={<BookOpen className="w-4 h-4" />} />
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3">
        <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-3 shadow">
          <div className="w-10 h-10 flex items-center justify-center rounded-md bg-black text-white">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">+280 Verified Mentors</p>
            <p className="text-xs text-gray-500">Top mentors across industries</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-3 shadow">
          <div className="w-10 h-10 flex items-center justify-center rounded-md bg-black text-white">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Instant Scheduling</p>
            <p className="text-xs text-gray-500">Find conflict-free session slots</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Left 3D Container
function Left3DContainer() {
  return (
    <div className="w-full h-full min-h-[420px] rounded-3xl overflow-hidden border border-gray-200 bg-white">
      <Suspense fallback={<ThreeDSceneSkeleton />}>
        <ThreeDScene />
      </Suspense>
    </div>
  );
}


// Main Home Page
export default function HomePageClient() {
  const router = useRouter();
  const { user } = useAuth() as { user: { role?: Role } | null };
  const [search, setSearch] = useState("");
  const isLoggedIn = Boolean(user);
  const role = user?.role || null;

  const filteredFeatures = useMemo(() => {
    if (!search) return FEATURES;
    return FEATURES.filter((f) => f.title.toLowerCase().includes(search.toLowerCase()));
  }, [search]);

  const onNavigateToDashboard = () => router.push(formatRolePath(role));
  const onNavigateToCourses = () => router.push(formatRolePathToCourse(role));

  return (
    <main className="min-h-screen w-full bg-white">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="col-span-12 lg:col-span-6"><Left3DContainer /></div>
          <div className="col-span-12 lg:col-span-6 flex flex-col justify-center">
            <RightContent
              userRole={role}
              isLoggedIn={isLoggedIn}
              onNavigateToDashboard={onNavigateToDashboard}
              onNavigateToCourses={onNavigateToCourses}
            />
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Mentor Connect?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFeatures.map((f) => <FeatureCard key={f.id} {...f} />)}
          </div>
        </div>
      </section>
    </main>
  );
}
