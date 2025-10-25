"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getCertificates } from "@/utils/api";
import { Spinner } from "../../../components/ui/spinner";
import type { Certificate } from "@/types";
import { Award, Download, ExternalLink, ArrowLeft } from "lucide-react";

export default function MyCertificates() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const data = await getCertificates();
        if (mounted) setCertificates(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Error loading certificates:", e);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  function getDirectDownloadUrl(url: string) {
    try {
      const u = new URL(url);
      if (u.hostname.includes("drive.google.com")) {
        const parts = u.pathname.split("/").filter(Boolean);
        const fileIdIndex = parts.indexOf("d") >= 0 ? parts.indexOf("d") + 1 : -1;
        if (fileIdIndex > 0 && parts[fileIdIndex]) {
          const id = parts[fileIdIndex];
          return `https://drive.google.com/uc?export=download&id=${id}`;
        }
        const idParam = u.searchParams.get("id");
        if (idParam) return `https://drive.google.com/uc?export=download&id=${idParam}`;
      }
      if (u.hostname.includes("dropbox.com")) {
        if (u.searchParams.get("dl") === "0") {
          u.searchParams.set("dl", "1");
        }
        return u.toString();
      }
      return url;
    } catch {
      return url;
    }
  }

  const downloadCertificate = async (cert: Certificate) => {
    if (!cert?.certificateUrl) return;
    setDownloading((prev) => ({ ...prev, [cert.id]: true }));
    try {
      const direct = getDirectDownloadUrl(cert.certificateUrl);
      const a = document.createElement("a");
      a.href = direct;

      if (direct.includes("uc?export=download") || direct.includes("dl=1") || direct.match(/\.(pdf|png|jpg|jpeg)$/i)) {
        a.setAttribute("download", `${cert.courseName || "certificate"}-${cert.id}.pdf`);
        a.setAttribute("rel", "noopener noreferrer");
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        window.open(direct, "_blank", "noopener,noreferrer");
      }
    } catch {
      window.open(cert.certificateUrl, "_blank", "noopener,noreferrer");
    } finally {
      setTimeout(() => setDownloading((prev) => ({ ...prev, [cert.id]: false })), 600);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg border border-border shadow-sm p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Award className="w-6 h-6 text-green-600" />
              My Certificates
            </h1>
            <p className="text-sm text-muted-foreground">
              Review, download, or preview your earned course certificates.
            </p>
          </div>
          <Link
            href="/mentee/dashboard"
            className="inline-flex items-center gap-2 text-primary font-semibold text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>

        {certificates.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="p-5 border border-border rounded-xl bg-white hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-semibold text-foreground text-base">
                    {cert.courseName}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Issued on {new Date(cert.issuedAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <button
                    onClick={() => downloadCertificate(cert)}
                    className="inline-flex items-center gap-2 px-3 py-2 bg-primary text-white rounded-lg font-semibold text-sm"
                  >
                    {downloading[cert.id] ? "Downloading..." : (
                      <>
                        <Download className="w-4 h-4" /> Download
                      </>
                    )}
                  </button>

                  <a
                    href={cert.certificateUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-border rounded-lg text-sm"
                  >
                    Preview <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                <div className="text-xs text-muted-foreground mt-3">
                  Certificate ID:{" "}
                  <span className="font-mono text-xs">{cert.id}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Award className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">
              No certificates yet. Complete courses to earn your first certificate!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
