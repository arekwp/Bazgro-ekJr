import React, { useRef } from 'react';
import { Project } from '../types/scratch';
import { BACKGROUND_TEMPLATES } from '../data/backgrounds';
import { CHARACTER_TEMPLATES } from '../data/characters';
import { sound } from '../utils/audio';
import { Plus, FolderDown, Download, Trash2, Copy, Sparkles, BookOpen } from 'lucide-react';

interface ProjectLibraryProps {
  projects: Project[];
  onOpenProject: (projectId: string) => void;
  onCreateProject: () => void;
  onDuplicateProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
  onExportProject: (project: Project) => void;
  onImportProject: (imported: Project) => void;
  onOpenGuide: () => void;
}

export const ProjectLibrary: React.FC<ProjectLibraryProps> = ({
  projects,
  onOpenProject,
  onCreateProject,
  onDuplicateProject,
  onDeleteProject,
  onExportProject,
  onImportProject,
  onOpenGuide,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && parsed.pages && Array.isArray(parsed.pages)) {
          // ensure fresh unique ID
          const projectWithNewId: Project = {
            ...parsed,
            id: `proj_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            name: `${parsed.name || 'Zaimportowany Projekt'} (Kopia)`,
            updatedAt: Date.now(),
          };
          onImportProject(projectWithNewId);
          sound.playCheer();
        }
      } catch {
        alert('Nie udało się wczytać pliku projektu. Upewnij się, że to poprawny plik .json ze ScratchJr Web.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-100 via-amber-50 to-orange-100 flex flex-col p-4 sm:p-8 select-none">
      {/* Hidden file input for importing project JSON */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Top Banner */}
      <header className="max-w-6xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between pb-6 border-b-2 border-amber-300 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-3xl bg-amber-400 border-4 border-amber-500 shadow-lg flex items-center justify-center text-3xl">
            🤖
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-amber-950 tracking-tight">
              ScratchJr Web
            </h1>
            <p className="text-xs sm:text-sm font-bold text-amber-800">
              Klub Robotyki i Programowania dla Dzieci
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap justify-center">
          <button
            type="button"
            onClick={() => {
              sound.playPop();
              fileInputRef.current?.click();
            }}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-white hover:bg-amber-50 active:scale-95 text-amber-950 font-black text-xs sm:text-sm border-2 border-amber-300 shadow-sm transition-transform"
          >
            <FolderDown size={18} className="text-amber-600" />
            <span>Wczytaj z pliku</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playPop();
              onOpenGuide();
            }}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-amber-200 hover:bg-amber-300 active:scale-95 text-amber-950 font-black text-xs sm:text-sm border-2 border-amber-400 shadow-sm transition-transform"
          >
            <BookOpen size={18} className="text-amber-800" />
            <span>Przewodnik</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl w-full mx-auto my-6 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-black text-amber-950 flex items-center gap-2">
            <span>Moje Projekty</span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900">
              {projects.length}
            </span>
          </h2>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
          {/* Create New Project Card */}
          <button
            type="button"
            onClick={() => {
              sound.playPop();
              onCreateProject();
            }}
            className="h-52 sm:h-60 rounded-3xl bg-amber-200/80 hover:bg-amber-300/80 border-4 border-dashed border-amber-400 active:scale-95 transition-all shadow-sm flex flex-col items-center justify-center p-4 gap-3 text-amber-950 group"
          >
            <div className="w-16 h-16 rounded-full bg-amber-400 group-hover:scale-110 flex items-center justify-center shadow-md border-2 border-amber-500 transition-transform">
              <Plus size={36} strokeWidth={3} className="text-amber-950" />
            </div>
            <span className="font-black text-base sm:text-lg">Nowy Projekt</span>
            <span className="text-[11px] font-bold text-amber-800/80 text-center">
              Czysta plansza do tworzenia
            </span>
          </button>

          {/* User Projects List */}
          {projects.map((proj) => {
            const firstPage = proj.pages[0];
            const bg = BACKGROUND_TEMPLATES[firstPage?.backgroundId || 'grid'] || BACKGROUND_TEMPLATES.grid;

            return (
              <div
                key={proj.id}
                className="h-52 sm:h-60 rounded-3xl bg-white border-4 border-amber-300 shadow-md hover:shadow-xl hover:border-amber-500 transition-all flex flex-col overflow-hidden group select-none relative"
              >
                {/* Stage Mini Preview */}
                <div
                  onClick={() => {
                    sound.playPop();
                    onOpenProject(proj.id);
                  }}
                  className="flex-1 relative cursor-pointer overflow-hidden bg-slate-900"
                >
                  {/* Background */}
                  <div className="w-full h-full pointer-events-none">
                    {bg.renderSvg({ className: 'w-full h-full object-cover' })}
                  </div>

                  {/* Character mini icons */}
                  {firstPage?.characters.slice(0, 3).map((char, cIdx) => {
                    const tmpl = CHARACTER_TEMPLATES[char.characterId] || CHARACTER_TEMPLATES.robot;
                    return (
                      <div
                        key={cIdx}
                        className="absolute w-10 h-10 pointer-events-none drop-shadow-md"
                        style={{
                          left: `${((char.x - 0.5) / 20) * 100}%`,
                          top: `${(1 - (char.y - 0.5) / 15) * 100}%`,
                          transform: 'translate(-50%, -50%)',
                        }}
                      >
                        {tmpl.renderSvg({ className: 'w-full h-full' })}
                      </div>
                    );
                  })}

                  {/* Page count badge */}
                  <span className="absolute top-2 left-2 text-[10px] font-black bg-amber-400/90 text-amber-950 px-2 py-0.5 rounded-full shadow-xs">
                    {proj.pages.length} {proj.pages.length === 1 ? 'scena' : 'sceny'}
                  </span>
                </div>

                {/* Card Bottom Meta & Actions */}
                <div className="p-3 bg-amber-50 border-t-2 border-amber-200 flex items-center justify-between">
                  <div
                    onClick={() => {
                      sound.playPop();
                      onOpenProject(proj.id);
                    }}
                    className="flex-1 truncate cursor-pointer"
                  >
                    <h3 className="font-black text-sm text-amber-950 truncate hover:text-amber-700">
                      {proj.name}
                    </h3>
                    <p className="text-[10px] font-bold text-amber-800/70">
                      {new Date(proj.updatedAt).toLocaleDateString('pl-PL')}
                    </p>
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="flex items-center gap-1 shrink-0 ml-1">
                    <button
                      type="button"
                      onClick={() => {
                        sound.playPop();
                        onDuplicateProject(proj);
                      }}
                      className="p-1.5 rounded-xl hover:bg-amber-200 text-amber-800 active:scale-90 transition-transform"
                      title="Duplikuj projekt"
                    >
                      <Copy size={14} />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        sound.playPop();
                        onExportProject(proj);
                      }}
                      className="p-1.5 rounded-xl hover:bg-amber-200 text-amber-800 active:scale-90 transition-transform"
                      title="Pobierz plik projektu (JSON)"
                    >
                      <Download size={14} />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        sound.playTrash();
                        onDeleteProject(proj.id);
                      }}
                      className="p-1.5 rounded-xl hover:bg-red-100 text-red-600 active:scale-90 transition-transform"
                      title="Usuń projekt"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Helpful Footer Info for Robotics Clubs & Parents */}
      <footer className="max-w-6xl w-full mx-auto mt-auto pt-6 border-t-2 border-amber-300 flex flex-col sm:flex-row items-center justify-between text-xs text-amber-900/80 gap-2">
        <p className="font-bold flex items-center gap-1.5">
          <Sparkles size={14} className="text-amber-600" />
          Gotowe do uruchomienia na telefonach z Androidem, iOS i w dowolnej przeglądarce!
        </p>
        <p className="font-semibold text-amber-800">
          Udostępnij dzieciakom lub wgraj na GitHub
        </p>
      </footer>
    </div>
  );
};
