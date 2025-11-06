"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Upload,
  FileText,
  Globe,
  MessageSquare,
  HelpCircle,
} from "lucide-react";

export function SourcesPage() {
  const [activeTab, setActiveTab] = useState("files");
  const [files, setFiles] = useState([
    {
      id: 1,
      name: "himanshi_singh_resume_software_engineer_2025.pdf",
      size: "3 KB",
    },
    {
      id: 2,
      name: "himanshi_singh_resume_software_engineer_2025.pdf",
      size: "3 KB",
    },
  ]);

  return (
    <div className="p-8">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Sources</h1>
            <p className="text-muted-foreground">
              Manage your chatbot training data
            </p>
          </div>
          <Button>Learn more</Button>
        </div>

        <TabsList className="grid w-full max-w-2xl grid-cols-5">
          <TabsTrigger value="files" className="flex items-center gap-2">
            <FileText size={16} />
            <span className="hidden sm:inline">Files</span>
          </TabsTrigger>
          <TabsTrigger value="text" className="flex items-center gap-2">
            <MessageSquare size={16} />
            <span className="hidden sm:inline">Text</span>
          </TabsTrigger>
          <TabsTrigger value="website" className="flex items-center gap-2">
            <Globe size={16} />
            <span className="hidden sm:inline">Website</span>
          </TabsTrigger>
          <TabsTrigger value="qa" className="flex items-center gap-2">
            <HelpCircle size={16} />
            <span className="hidden sm:inline">Q&A</span>
          </TabsTrigger>
          <TabsTrigger value="notion">Notion</TabsTrigger>
        </TabsList>

        {/* Files Tab */}
        <TabsContent value="files" className="mt-6 space-y-6">
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2">
              <h2 className="text-2xl font-bold mb-2">Files</h2>
              <p className="text-muted-foreground mb-6">
                Upload documents to train your AI. Extract text from PDFs, DOCX,
                and TXT files.
              </p>

              <div>
                <h3 className="text-lg font-semibold mb-4">Add files</h3>
                <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6 text-amber-800 dark:text-amber-200 text-sm flex items-center gap-2">
                  <HelpCircle size={16} />
                  If you are uploading a PDF, make sure you can select/highlight
                  the text.
                </div>

                <div className="border-2 border-dashed border-border rounded-lg p-12 text-center mb-6">
                  <Upload
                    size={32}
                    className="mx-auto mb-3 text-muted-foreground"
                  />
                  <p className="font-semibold mb-1">
                    Drag & drop files here, or click to select files
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Supported file types: pdf, doc, docx, txt
                  </p>
                </div>

                <h3 className="text-lg font-semibold mb-4">File sources</h3>
                <div className="flex items-center gap-4 mb-4">
                  <input type="checkbox" id="select-all" />
                  <label htmlFor="select-all" className="text-sm">
                    Select all
                  </label>
                  <select className="ml-auto border border-border rounded-lg p-2 text-sm bg-background">
                    <option>Sort by: Default</option>
                  </select>
                </div>

                <div className="space-y-2">
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center gap-4 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <input type="checkbox" />
                      <FileText size={20} className="text-muted-foreground" />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {file.size}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm">
                        ⋯
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sources Summary */}
            <div className="bg-card border border-border rounded-lg p-6 h-fit">
              <h3 className="font-semibold mb-4">Sources</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <div className="flex items-center gap-2">
                    <FileText size={16} />
                    <span className="text-sm">2 Files</span>
                  </div>
                  <span className="font-semibold">7 KB</span>
                </div>
                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <div className="flex items-center gap-2">
                    <MessageSquare size={16} />
                    <span className="text-sm">2 Text Files</span>
                  </div>
                  <span className="font-semibold">388 B</span>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Total size</span>
                  <span>7 KB / 400 KB</span>
                </div>
              </div>
              <Button className="w-full mt-6">Retrain agent</Button>
            </div>
          </div>
        </TabsContent>

        {/* Text Tab */}
        <TabsContent value="text" className="mt-6 space-y-6">
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2">
              <h2 className="text-2xl font-bold mb-2">Text</h2>
              <p className="text-muted-foreground mb-6">
                Add plain text-based sources to train your AI Agent with precise
                information.
              </p>

              <div>
                <h3 className="text-lg font-semibold mb-4">Add text snippet</h3>

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    Title
                  </label>
                  <Input placeholder="Ex: Refund requests" />
                </div>

                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium">Text Content</label>
                    <span className="text-xs text-muted-foreground">0 B</span>
                  </div>
                  <div className="border border-border rounded-lg p-4 mb-3 flex gap-2 bg-muted/30">
                    <button className="text-sm hover:bg-muted p-2 rounded transition-colors">
                      T
                    </button>
                    <button className="text-sm hover:bg-muted p-2 rounded transition-colors">
                      B
                    </button>
                    <button className="text-sm hover:bg-muted p-2 rounded transition-colors">
                      I
                    </button>
                    <button className="text-sm hover:bg-muted p-2 rounded transition-colors">
                      S
                    </button>
                    <button className="text-sm hover:bg-muted p-2 rounded transition-colors">
                      ⋮
                    </button>
                  </div>
                  <textarea
                    placeholder="Enter your text"
                    className="w-full border border-border rounded-lg p-3 bg-background text-sm min-h-48 resize-none"
                  ></textarea>
                </div>

                <Button>Add text snippet</Button>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 h-fit">
              <h3 className="font-semibold mb-4">Sources</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <div className="flex items-center gap-2">
                    <FileText size={16} />
                    <span className="text-sm">2 Files</span>
                  </div>
                  <span className="font-semibold">7 KB</span>
                </div>
                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <div className="flex items-center gap-2">
                    <MessageSquare size={16} />
                    <span className="text-sm">2 Text Files</span>
                  </div>
                  <span className="font-semibold">388 B</span>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Total size</span>
                  <span>7 KB / 400 KB</span>
                </div>
              </div>
              <Button className="w-full mt-6">Retrain agent</Button>
            </div>
          </div>
        </TabsContent>

        {/* Website Tab */}
        <TabsContent value="website" className="mt-6 space-y-6">
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2">
              <h2 className="text-2xl font-bold mb-2">Website</h2>
              <p className="text-muted-foreground mb-6">
                Crawl web pages or submit sitemaps to update your AI with the
                latest content.
              </p>

              <div>
                <h3 className="text-lg font-semibold mb-4">Add links</h3>

                <div className="flex gap-4 mb-6 border-b border-border">
                  <button className="pb-3 border-b-2 border-primary font-medium">
                    Crawl links
                  </button>
                  <button className="pb-3 text-muted-foreground">
                    Sitemap
                  </button>
                  <button className="pb-3 text-muted-foreground">
                    Individual link
                  </button>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">URL</label>
                  <div className="flex gap-2">
                    <select className="border border-border rounded-lg p-2 bg-background text-sm">
                      <option>https://</option>
                    </select>
                    <Input placeholder="www.example.com" className="flex-1" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    Links found during crawling or sitemap retrieval may be
                    updated if new links are discovered or some links are
                    invalid.
                  </p>
                </div>

                <div>
                  <button className="text-sm font-medium text-foreground mb-4">
                    Advanced options
                  </button>
                  <Button className="ml-auto">Fetch links</Button>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 h-fit">
              <h3 className="font-semibold mb-4">Sources</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <div className="flex items-center gap-2">
                    <FileText size={16} />
                    <span className="text-sm">2 Files</span>
                  </div>
                  <span className="font-semibold">7 KB</span>
                </div>
                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <div className="flex items-center gap-2">
                    <MessageSquare size={16} />
                    <span className="text-sm">2 Text Files</span>
                  </div>
                  <span className="font-semibold">388 B</span>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Total size</span>
                  <span>7 KB / 400 KB</span>
                </div>
              </div>
              <Button className="w-full mt-6">Retrain agent</Button>
            </div>
          </div>
        </TabsContent>

        {/* Q&A Tab */}
        <TabsContent value="qa" className="mt-6">
          <div className="p-8 text-center text-muted-foreground">
            <p>Q&A content coming soon...</p>
          </div>
        </TabsContent>

        {/* Notion Tab */}
        <TabsContent value="notion" className="mt-6">
          <div className="p-8 text-center text-muted-foreground">
            <p>Notion integration coming soon...</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
