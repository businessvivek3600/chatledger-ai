'use client';

import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  Plus,
  FileText,
  Trash2,
  Sparkles,
  CheckCircle2,
  X,
  Layers,
  Database,
} from 'lucide-react';
import { apiRequest } from '../../../lib/api';
import { useLanguage } from '../../../i18n/LanguageContext';

export default function KnowledgeBasePage() {
  const { t } = useLanguage();
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [docType, setDocType] = useState('FAQ');
  const [rawText, setRawText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchDocs = async () => {
    try {
      const res = await apiRequest<any[]>('/knowledge-base/documents');
      setDocuments(res);
    } catch (err) {
      console.error('Failed to load knowledge base', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleCreateDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !rawText) return;

    setIsSubmitting(true);
    try {
      await apiRequest('/knowledge-base/documents', {
        method: 'POST',
        body: JSON.stringify({ title, docType, rawText }),
      });

      setIsModalOpen(false);
      setTitle('');
      setRawText('');
      fetchDocs();
    } catch (err: any) {
      alert(`Error indexing document: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this document from AI memory?')) return;
    try {
      await apiRequest(`/knowledge-base/documents/${id}`, { method: 'DELETE' });
      fetchDocs();
    } catch (err) {
      alert('Delete failed');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#356AE6]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-[#202938] tracking-tight flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#356AE6]" />
            {t('knowledgeBase.title', 'Knowledge Base & Document Indexing (RAG)')}
          </h1>
          <p className="text-xs text-[#707B8B]">
            {t('knowledgeBase.subtitle', 'Upload clinic protocols, doctor fee schedules, and FAQs for instant AI retrieval.')}
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 rounded-lg bg-[#243B5A] hover:bg-[#1a2d45] text-white font-semibold text-xs shadow-xs transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4 text-white" />
          {t('knowledgeBase.uploadDoc', 'Add Document / FAQs')}
        </button>
      </div>

      {/* Documents List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="bg-white p-5 rounded-xl border border-[#E6EAF0] shadow-xs flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-[#F2F4F7] text-[#243B5A] flex items-center justify-center font-bold text-xs border border-[#E6EAF0]">
                    <FileText className="w-4 h-4 text-[#356AE6]" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#202938]">{doc.title}</h3>
                    <div className="text-[11px] text-[#707B8B]">
                      Type: <strong className="text-[#202938]">{doc.docType}</strong> • {new Date(doc.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(doc.id)}
                  className="p-1.5 text-[#98A2B3] hover:text-[#D64B50] transition-colors rounded-md"
                  title="Remove document"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3 rounded-lg bg-[#F7F8FA] border border-[#E6EAF0] text-xs text-[#202938] line-clamp-4 leading-relaxed font-mono">
                {doc.rawText}
              </div>
            </div>

            <div className="pt-3 border-t border-[#E6EAF0] flex items-center justify-between text-xs">
              <span className="text-[11px] text-[#707B8B] font-medium flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-[#98A2B3]" />
                {doc.chunkCount || doc._count?.chunks || 0} Semantic Chunks
              </span>
              <span className="text-[10px] font-bold text-[#23865B] bg-[#23865B]/10 px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-[#23865B]/20">
                <CheckCircle2 className="w-3 h-3 text-[#23865B]" />
                INDEXED & ACTIVE
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Add Document */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#202938]/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-5 max-w-lg w-full shadow-lg border border-[#E6EAF0] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6EAF0]">
              <h3 className="text-sm font-bold text-[#202938]">Index Knowledge Document</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#98A2B3] hover:text-[#202938]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateDoc} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-[#202938]">Document Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Clinic OPD Timings & Doctor Schedule"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[#E6EAF0] px-3 py-2 text-xs text-[#202938] focus:border-[#356AE6] outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-[#202938]">Category / Type</label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[#E6EAF0] px-3 py-2 text-xs text-[#202938] bg-white focus:border-[#356AE6] outline-none"
                >
                  <option value="FAQ">Frequently Asked Questions (FAQ)</option>
                  <option value="PDF">Service Catalog / Price Brochure</option>
                  <option value="POLICY">Cancellation & Refund Policy</option>
                  <option value="MANUAL">Doctor & Operational Guidelines</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-[#202938]">Content / Knowledge Text *</label>
                <textarea
                  rows={6}
                  required
                  placeholder="Paste questions, answers, clinic instructions, or service descriptions here..."
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[#E6EAF0] px-3 py-2 text-xs text-[#202938] leading-relaxed font-mono focus:border-[#356AE6] outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-[#E6EAF0] text-xs font-semibold text-[#707B8B] hover:bg-[#F2F4F7]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-lg bg-[#243B5A] text-white font-semibold text-xs hover:bg-[#1a2d45] transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Chunking & Indexing...' : 'Index Document'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
