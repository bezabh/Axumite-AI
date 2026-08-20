import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Upload, FileText, Image as ImageIcon, Music, Video, FileCode, 
  Trash2, Download, Search, Filter, HardDrive, RefreshCw, CheckCircle2,
  AlertTriangle, Eye, ShieldCheck, Sparkles, ExternalLink, Tag, Clock, 
  Database, Lock, FilePlus, ChevronRight, Cloud
} from 'lucide-react';
import { UserProfile, UserFileRecord, UserStorageStats, FileCategory } from '../types';
import { 
  uploadFileToFirebaseStorage,
  uploadUserFileToFirestore, 
  fetchUserFilesFromFirestore, 
  deleteUserFileFromFirestore, 
  getUserStorageStats 
} from '../lib/firebase';
import { useLanguage } from '../context/LanguageContext';

interface UserFileManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onSendToChat?: (fileContext: string) => void;
  onSendToTranslator?: (text: string) => void;
}

export const UserFileManagerModal: React.FC<UserFileManagerModalProps> = ({
  isOpen,
  onClose,
  user,
  onSendToChat,
  onSendToTranslator,
}) => {
  const { language } = useLanguage();
  const [files, setFiles] = useState<UserFileRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFileForPreview, setSelectedFileForPreview] = useState<UserFileRecord | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [storageStats, setStorageStats] = useState<UserStorageStats>({
    usedBytes: 0,
    quotaBytes: 50 * 1024 * 1024,
    fileCount: 0,
    categoryBreakdown: { document: 0, image: 0, audio: 0, geez_script: 0, video: 0, other: 0 }
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load user files whenever modal opens or user changes
  useEffect(() => {
    if (isOpen && user?.email) {
      loadFiles();
    }
  }, [isOpen, user?.email]);

  const loadFiles = async () => {
    setLoading(true);
    try {
      const userFiles = await fetchUserFilesFromFirestore(user.email, user.id);
      setFiles(userFiles);
      const stats = await getUserStorageStats(user.email, user.role);
      setStorageStats(stats);
    } catch (e) {
      console.warn('Error loading files:', e);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    const file = selectedFiles[0];
    setUploading(true);
    setStatusMessage(null);

    // Determine category
    let category: FileCategory = 'other';
    if (file.type.startsWith('image/')) category = 'image';
    else if (file.type.startsWith('audio/')) category = 'audio';
    else if (file.type.startsWith('video/')) category = 'video';
    else if (file.type.includes('pdf') || file.type.includes('word') || file.type.includes('document') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
      category = 'document';
    } else if (file.name.includes('geez') || file.name.includes('fidel') || file.name.includes('axum')) {
      category = 'geez_script';
    }

    try {
      // 1. Upload to Firebase Storage Bucket and sync Firestore metadata
      const saved = await uploadFileToFirebaseStorage(file, file.name, user.email, {
        category,
        userId: user.id,
        fileSize: file.size,
        fileType: file.type,
        description: `Uploaded on ${new Date().toLocaleDateString()} (${(file.size / 1024).toFixed(1)} KB)`,
        tags: [category, file.name.split('.').pop() || 'file'],
      });

      setFiles(prev => [saved, ...prev.filter(f => f.id !== saved.id)]);
      
      // Refresh storage quota stats
      const stats = await getUserStorageStats(user.email, user.role);
      setStorageStats(stats);

      setStatusMessage({
        type: 'success',
        text: language === 'ti' 
          ? `ፋይል "${file.name}" ናብ Firebase Cloud Storage ብዓወት ተዓቂቡ ኣሎ!` 
          : `File "${file.name}" uploaded to Firebase Storage successfully!`
      });
    } catch (err: any) {
      console.error('File upload error:', err);
      setStatusMessage({
        type: 'error',
        text: `Upload error: ${err?.message || 'Failed to upload to Firebase Storage'}`
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (fileRecord: UserFileRecord) => {
    if (!window.confirm(language === 'ti' ? `ነዚ ፋይል "${fileRecord.fileName}" ካብ Firebase Storage ንምድምሳስ ርግጸኛ ዲኹም?` : `Are you sure you want to delete "${fileRecord.fileName}" from Firebase Storage?`)) {
      return;
    }

    setDeletingId(fileRecord.id);
    try {
      await deleteUserFileFromFirestore(user.email, fileRecord.id, fileRecord.storagePath);
      setFiles(prev => prev.filter(f => f.id !== fileRecord.id));
      if (selectedFileForPreview?.id === fileRecord.id) {
        setSelectedFileForPreview(null);
      }
      const stats = await getUserStorageStats(user.email, user.role);
      setStorageStats(stats);
      setStatusMessage({
        type: 'success',
        text: language === 'ti' ? `ፋይል "${fileRecord.fileName}" ብዓወት ተደምሲሱ ኣሎ` : `File "${fileRecord.fileName}" deleted successfully.`
      });
    } catch (e) {
      setStatusMessage({
        type: 'error',
        text: 'Failed to delete file from cloud database.'
      });
    } finally {
      setDeletingId(null);
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'image': return <ImageIcon className="w-5 h-5 text-emerald-500" />;
      case 'audio': return <Music className="w-5 h-5 text-amber-500" />;
      case 'video': return <Video className="w-5 h-5 text-purple-500" />;
      case 'geez_script': return <Sparkles className="w-5 h-5 text-yellow-600" />;
      default: return <FileText className="w-5 h-5 text-blue-500" />;
    }
  };

  const filteredFiles = files.filter(f => {
    const matchesCategory = selectedCategory === 'all' || f.category === selectedCategory;
    const matchesQuery = searchQuery === '' || 
      f.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.description && f.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesQuery;
  });

  const percentageUsed = Math.min(100, Math.round((storageStats.usedBytes / (storageStats.quotaBytes || 1)) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-3 sm:p-5 animate-fade-in text-slate-800">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl w-full max-w-5xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-[#0F2856] via-[#1A3A75] to-[#254F96] text-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-400 flex items-center justify-center shadow-md">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white">
                  {language === 'ti' ? 'ናይ ተጠቃሚ ክላውድ ፋይል መኽዘን' : 'User Cloud File Vault & Storage'}
                </h3>
                <span className="text-[10px] px-2 py-0.5 bg-amber-400 text-slate-950 font-black rounded-full font-mono">
                  FIRESTORE
                </span>
              </div>
              <p className="text-xs text-slate-300">
                {language === 'ti' 
                  ? `ናይ ብሕቲ ዳታቤዝ፡ ${user.email} (ውሑስ ናይ ባለቤትነት ቁጽጽር)`
                  : `Private cloud database storage for ${user.email} (Owner Encrypted)`}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={loadFiles}
              disabled={loading}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Refresh files"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Status Toast Banner */}
        {statusMessage && (
          <div className={`px-4 py-2.5 flex items-center justify-between text-xs font-semibold ${
            statusMessage.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-b border-emerald-200' : 'bg-rose-50 text-rose-800 border-b border-rose-200'
          }`}>
            <div className="flex items-center space-x-2">
              {statusMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-rose-600" />}
              <span>{statusMessage.text}</span>
            </div>
            <button onClick={() => setStatusMessage(null)} className="text-slate-400 hover:text-slate-700">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Modal Main Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5 bg-slate-50/50">
          
          {/* Top Bar: Storage Quota & Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Storage Quota Card */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Database className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold text-slate-700">
                    {language === 'ti' ? 'ናይ ክላውድ ዓቕሚ (Storage Quota)' : 'Storage Usage'}
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-blue-600">
                  {formatBytes(storageStats.usedBytes)} / {formatBytes(storageStats.quotaBytes)}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden mb-2">
                <div 
                  className={`h-full transition-all rounded-full ${
                    percentageUsed > 85 ? 'bg-rose-500' : percentageUsed > 60 ? 'bg-amber-500' : 'bg-blue-600'
                  }`}
                  style={{ width: `${Math.max(4, percentageUsed)}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>{files.length} {language === 'ti' ? 'ዝተዓቀቡ ፋይላት' : 'files stored'}</span>
                <span className="font-semibold text-slate-700">{percentageUsed}% used</span>
              </div>
            </div>

            {/* Security Rules & Access Authority Card */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-slate-800 flex items-center space-x-1">
                  <span>{language === 'ti' ? 'ናይ ደሕንነት ውሕስነት (Security Rules)' : 'Access Protection Active'}</span>
                </p>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  {language === 'ti' 
                    ? 'ነፍሲ ወከፍ ተጠቃሚ ናቱ ፋይላት ጥራይ ክርእን ከስተኻኽልን ይኽእል።' 
                    : 'Firestore rules strictly enforce user isolation. Only you have access.'}
                </p>
              </div>
            </div>

            {/* Quick Upload Button */}
            <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-4 rounded-2xl shadow-md text-white flex items-center justify-between">
              <div>
                <p className="font-bold text-sm">{language === 'ti' ? 'ሓድሽ ፋይል ኣእትው' : 'Upload New File'}</p>
                <p className="text-amber-100 text-xs mt-0.5">PDF, Word, Audio, Ge'ez texts</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileUpload}
                className="hidden"
                accept=".pdf,.doc,.docx,.txt,.md,.json,.csv,.jpg,.jpeg,.png,.webp,.mp3,.wav,.m4a"
              />
              <button
                type="button"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-300 rounded-xl font-bold text-xs flex items-center space-x-2 transition-transform active:scale-95 shadow-sm"
              >
                <Upload className={`w-4 h-4 ${uploading ? 'animate-bounce' : ''}`} />
                <span>{uploading ? (language === 'ti' ? 'ይጽዕን ኣሎ...' : 'Uploading...') : (language === 'ti' ? 'ምረጽ' : 'Upload')}</span>
              </button>
            </div>

          </div>

          {/* Search, Filters, & Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
            {/* Search Box */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={language === 'ti' ? 'ፋይላት ድለ...' : 'Search your files...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800"
              />
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {[
                { id: 'all', label: language === 'ti' ? 'ኩሎም' : 'All Files' },
                { id: 'document', label: language === 'ti' ? 'ሰነዳት' : 'Documents' },
                { id: 'image', label: language === 'ti' ? 'ስእልታት' : 'Images' },
                { id: 'audio', label: language === 'ti' ? 'ድምጺ' : 'Audio' },
                { id: 'geez_script', label: language === 'ti' ? 'ግእዝ ጽሑፋት' : 'Ge\'ez Heritage' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                    selectedCategory === cat.id
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Files Grid / List */}
          {loading ? (
            <div className="py-16 text-center text-slate-400 flex flex-col items-center justify-center space-y-3">
              <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
              <p className="text-xs font-medium">{language === 'ti' ? 'ካብ ክላውድ ዳታቤዝ ፋይላት ይድለ ኣለዉ...' : 'Loading files from Firestore...'}</p>
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-3xl border border-dashed border-slate-300 p-8 flex flex-col items-center justify-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <FilePlus className="w-7 h-7" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">
                {language === 'ti' ? 'ዝተረኽበ ፋይል የለን' : 'No Files in Your Vault Yet'}
              </h4>
              <p className="text-xs text-slate-500 max-w-sm">
                {language === 'ti' 
                  ? 'ናይ ሰነድ፣ ስእሊ፣ ወይ ናይ ድምጺ ፋይላት ብምዕቃብ ኣብ ክላውድ ዳታቤዝኩም ኣቀምጡ።' 
                  : 'Upload documents, translations, Ge\'ez scripts, or voice recordings to save them securely in your account.'}
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-transform active:scale-95"
              >
                {language === 'ti' ? 'ቀዳማይ ፋይል ኣእትው' : 'Upload First File'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredFiles.map((fileRecord) => (
                <div
                  key={fileRecord.id}
                  className="bg-white rounded-2xl p-4 border border-slate-200/90 hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between space-y-3 group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                        {getCategoryIcon(fileRecord.category)}
                      </div>
                      <div className="overflow-hidden">
                        <h5 className="text-xs font-bold text-slate-800 truncate" title={fileRecord.fileName}>
                          {fileRecord.fileName}
                        </h5>
                        <p className="text-[11px] text-slate-400 mt-0.5 flex items-center space-x-2 font-mono">
                          <span>{formatBytes(fileRecord.fileSize)}</span>
                          <span>•</span>
                          <span>{new Date(fileRecord.uploadDate).toLocaleDateString()}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {fileRecord.description && (
                    <p className="text-xs text-slate-600 line-clamp-2 bg-slate-50 p-2 rounded-xl">
                      {fileRecord.description}
                    </p>
                  )}

                  {/* Actions footer */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-1.5">
                      {fileRecord.fileData && (
                        <button
                          type="button"
                          onClick={() => setSelectedFileForPreview(fileRecord)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 rounded-lg font-semibold flex items-center space-x-1 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{language === 'ti' ? 'ርአ' : 'View'}</span>
                        </button>
                      )}
                      {fileRecord.downloadUrl && (
                        <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <Cloud className="w-2.5 h-2.5 mr-0.5 text-emerald-600" />
                          Storage
                        </span>
                      )}
                      {(fileRecord.fileData || fileRecord.downloadUrl) && (
                        <a
                          href={fileRecord.downloadUrl || fileRecord.fileData}
                          target="_blank"
                          rel="noopener noreferrer"
                          download={fileRecord.fileName}
                          className="p-1.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-600 text-slate-700 rounded-lg transition-colors"
                          title="Download from Firebase Storage"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>

                    <button
                      type="button"
                      disabled={deletingId === fileRecord.id}
                      onClick={() => handleDelete(fileRecord)}
                      className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className={`w-3.5 h-3.5 ${deletingId === fileRecord.id ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* File Preview Modal Overlay */}
        {selectedFileForPreview && (
          <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    {getCategoryIcon(selectedFileForPreview.category)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{selectedFileForPreview.fileName}</h4>
                    <p className="text-xs text-slate-400 font-mono">{formatBytes(selectedFileForPreview.fileSize)} • {selectedFileForPreview.fileType}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedFileForPreview(null)}
                  className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Preview Content */}
              <div className="max-h-80 overflow-y-auto bg-slate-50 p-4 rounded-2xl border border-slate-200">
                {selectedFileForPreview.fileType.startsWith('image/') ? (
                  <img
                    src={selectedFileForPreview.downloadUrl || selectedFileForPreview.fileData}
                    alt={selectedFileForPreview.fileName}
                    className="max-h-72 mx-auto rounded-xl object-contain shadow-sm"
                  />
                ) : selectedFileForPreview.fileType.startsWith('audio/') ? (
                  <audio controls className="w-full" src={selectedFileForPreview.downloadUrl || selectedFileForPreview.fileData} />
                ) : (
                  <pre className="text-xs text-slate-700 whitespace-pre-wrap font-mono">
                    {selectedFileForPreview.fileData?.startsWith('data:text') || selectedFileForPreview.fileData?.startsWith('data:application/json')
                      ? atob(selectedFileForPreview.fileData.split(',')[1] || '')
                      : selectedFileForPreview.description || 'Binary Document content stored safely in Firebase Storage.'}
                  </pre>
                )}
              </div>

              {/* Quick AI Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center space-x-2">
                  {onSendToChat && (
                    <button
                      type="button"
                      onClick={() => {
                        onSendToChat(`Here is my saved document context "${selectedFileForPreview.fileName}":\n\n${selectedFileForPreview.description || selectedFileForPreview.fileName}`);
                        setSelectedFileForPreview(null);
                        onClose();
                      }}
                      className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{language === 'ti' ? 'ናብ AI Chat ልኣኽ' : 'Analyze in AI Chat'}</span>
                    </button>
                  )}
                </div>

                <a
                  href={selectedFileForPreview.downloadUrl || selectedFileForPreview.fileData}
                  target="_blank"
                  rel="noopener noreferrer"
                  download={selectedFileForPreview.fileName}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-amber-300 rounded-xl text-xs font-bold flex items-center space-x-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{language === 'ti' ? 'ኣውርድ (Download)' : 'Download'}</span>
                </a>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
