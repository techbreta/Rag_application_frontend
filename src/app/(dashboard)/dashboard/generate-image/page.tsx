"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ensureCloudinaryHttps } from "@/lib/cloudinary";
import Button from "@/components/ui/Button";
import AnimatedPage from "@/components/layout/AnimatedPage";
import Card from "@/components/ui/Card";
import {
  Sparkles,
  Download,
  Wand2,
  Loader2,
  ImageIcon,
  ArrowRight,
  Check,
} from "lucide-react";
import api from "@/lib/axios";
import Link from "next/link";

interface GenerateImageResponse {
  status: string;
  data: {
    message: string;
    image: {
      id: string;
      prompt: string;
      cloudinaryUrl: string;
      mistralConversationId?: string;
      createdAt: string;
      metadata?: Record<string, any>;
    };
  };
}

export default function GenerateImagePage() {
  const [prompt, setPrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState<
    GenerateImageResponse["data"]["image"] | null
  >(null);
  const queryClient = useQueryClient();

  const generateMutation = useMutation({
    mutationFn: async (text: string) => {
      const { data } = await api.post<GenerateImageResponse>(
        "/v1/rag/images/generate",
        { text },
      );
      console.log("Generate Image Response:", data);
      return data;
    },
    onSuccess: (data) => {
      setGeneratedImage(data.data.image);
      queryClient.invalidateQueries({ queryKey: ["userImages"] });
    },
  });

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    generateMutation.mutate(prompt);
  };

  const handleDownload = async (imageUrl: string, imagePrompt: string) => {
    try {
      // Add Cloudinary's download flag to force download instead of opening in browser
      const downloadUrl = imageUrl.includes("/upload/")
        ? imageUrl.replace("/upload/", "/upload/fl_attachment/")
        : imageUrl;

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${imagePrompt.replace(/[^a-zA-Z0-9]/g, "-").substring(0, 50)}-${Date.now()}.png`;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Download failed:", err);
      // Fallback: open in new tab
      window.open(imageUrl, "_blank");
    }
  };

  const handleReset = () => {
    setPrompt("");
    setGeneratedImage(null);
    generateMutation.reset();
  };

  return (
    <AnimatedPage>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          AI Image Generator
        </h1>
        <p className="text-sm text-slate-400">
          Describe the image you want to create and let AI bring it to life
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Left Column - Input */}
        <div className="space-y-6">
          <Card>
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Wand2 className="h-5 w-5 text-violet-400" />
              Describe Your Image
            </h2>

            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Image Prompt
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="E.g., A futuristic city at sunset with flying cars, vibrant neon lights, and tall skyscrapers..."
                  rows={6}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-3 text-white placeholder:text-slate-500 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all duration-200 resize-none"
                  disabled={generateMutation.isPending}
                />
                <p className="text-xs text-slate-500 mt-2">
                  Be descriptive! The more details you provide, the better the
                  result.
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={!prompt.trim() || generateMutation.isPending}
                  className="flex-1"
                >
                  {generateMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Image
                    </>
                  )}
                </Button>
                {(generatedImage || generateMutation.isPending) && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleReset}
                    disabled={generateMutation.isPending}
                  >
                    Reset
                  </Button>
                )}
              </div>
            </form>

            {/* Error */}
            {generateMutation.isError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 rounded-lg bg-red-500/10 border border-red-500/20 p-4"
              >
                <p className="text-sm text-red-400">
                  {generateMutation.error instanceof Error
                    ? generateMutation.error.message
                    : "Failed to generate image. Please try again."}
                </p>
              </motion.div>
            )}
          </Card>

          {/* Tips */}
          <Card className="bg-gradient-to-br from-violet-600/5 to-indigo-600/5 border-violet-500/20">
            <h3 className="text-sm font-semibold text-violet-300 mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Pro Tips
            </h3>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <span className="text-violet-400 mt-0.5">•</span>
                <span>
                  Include details about style, lighting, colors, and mood
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-violet-400 mt-0.5">•</span>
                <span>
                  Specify art styles like &quot;realistic&quot;,
                  &quot;anime&quot;, &quot;oil painting&quot;
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-violet-400 mt-0.5">•</span>
                <span>Mention camera angles and composition if needed</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-violet-400 mt-0.5">•</span>
                <span>The more specific you are, the better the results</span>
              </li>
            </ul>
          </Card>
        </div>

        {/* Right Column - Output */}
        <div>
          <Card className="h-full flex flex-col">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-violet-400" />
              Generated Image
            </h2>

            <div className="flex-1 flex items-center justify-center">
              <AnimatePresence mode="wait">
                {generateMutation.isPending ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-12"
                  >
                    <div className="relative w-20 h-20 mx-auto mb-6">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 opacity-20 animate-pulse" />
                      <div className="absolute inset-2 rounded-full bg-slate-900 flex items-center justify-center">
                        <Loader2 className="h-8 w-8 text-violet-400 animate-spin" />
                      </div>
                    </div>
                    <p className="text-sm text-slate-400 mb-2">
                      Creating your image...
                    </p>
                    <p className="text-xs text-slate-500">
                      This may take a moment
                    </p>
                  </motion.div>
                ) : generatedImage ? (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full space-y-4"
                  >
                    {/* Image Preview */}
                    <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-800 border border-slate-700">
                      <Image
                        src={ensureCloudinaryHttps(
                          generatedImage.cloudinaryUrl,
                        )}
                        alt={generatedImage.prompt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        priority
                      />
                    </div>

                    {/* Success Message */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3"
                    >
                      <Check className="h-4 w-4" />
                      <span>Image generated successfully!</span>
                    </motion.div>

                    {/* Image Info */}
                    <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                      <p className="text-xs text-slate-400 mb-2">Prompt:</p>
                      <p className="text-sm text-slate-300 leading-relaxed">
                        {generatedImage.prompt}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <Button
                        className="flex-1"
                        onClick={() =>
                          handleDownload(
                            ensureCloudinaryHttps(generatedImage.cloudinaryUrl),
                            generatedImage.prompt,
                          )
                        }
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                      <Link href="/dashboard/images" className="flex-1">
                        <Button variant="outline" className="w-full">
                          View Gallery
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-12"
                  >
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-800/50 mb-6">
                      <ImageIcon className="h-10 w-10 text-slate-600" />
                    </div>
                    <p className="text-sm text-slate-400 mb-1">
                      No image generated yet
                    </p>
                    <p className="text-xs text-slate-500">
                      Enter a prompt and click generate
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Card>
        </div>
      </div>
    </AnimatedPage>
  );
}
