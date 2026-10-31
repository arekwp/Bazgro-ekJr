import React, { useState } from 'react';
import { sound } from '../utils/audio';
import { CATEGORY_COLORS } from '../data/blockCatalog';
import { X, Sparkles, Compass, Cpu, HelpCircle } from 'lucide-react';

interface GuideModalProps {
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'blocks' | 'robotics' | 'sharing'>('blocks');

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-amber-50 rounded-3xl border-4 border-amber-400 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] select-none animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-amber-400 p-4 border-b-2 border-amber-500 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📖</span>
            <h2 className="text-xl font-black text-amber-950">
              Przewodnik po ScratchJr Web
            </h2>
          </div>
          <button
            onClick={() => {
              sound.playPop();
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-amber-200 hover:bg-white text-amber-950 font-black flex items-center justify-center"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-amber-200 bg-amber-100/60 p-1.5 gap-2">
          <button
            type="button"
            onClick={() => {
              sound.playPop();
              setActiveTab('blocks');
            }}
            className={`flex-1 py-2 px-3 rounded-2xl text-xs sm:text-sm font-black flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'blocks'
                ? 'bg-amber-400 text-amber-950 shadow-sm'
                : 'text-amber-800 hover:bg-amber-200'
            }`}
          >
            <Sparkles size={16} />
            <span>Kolory Bloczków</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playPop();
              setActiveTab('robotics');
            }}
            className={`flex-1 py-2 px-3 rounded-2xl text-xs sm:text-sm font-black flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'robotics'
                ? 'bg-amber-400 text-amber-950 shadow-sm'
                : 'text-amber-800 hover:bg-amber-200'
            }`}
          >
            <Compass size={16} />
            <span>Siatka Robotyki (20x15)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playPop();
              setActiveTab('sharing');
            }}
            className={`flex-1 py-2 px-3 rounded-2xl text-xs sm:text-sm font-black flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'sharing'
                ? 'bg-amber-400 text-amber-950 shadow-sm'
                : 'text-amber-800 hover:bg-amber-200'
            }`}
          >
            <Cpu size={16} />
            <span>GitHub & Grupa</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-slate-800 text-sm">
          {activeTab === 'blocks' && (
            <div className="space-y-4">
              <p className="text-xs sm:text-sm font-bold text-amber-900 bg-amber-100/70 p-3 rounded-2xl border border-amber-300">
                W ScratchJr bloczki łączą się od lewej do prawej jak puzzle! Każdy kolor ma swoje specjalne zadanie:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Yellow */}
                <div
                  className="p-3 rounded-2xl border-2 text-white shadow-xs"
                  style={{ backgroundColor: CATEGORY_COLORS.trigger.bg, borderColor: CATEGORY_COLORS.trigger.border }}
                >
                  <div className="font-black text-sm flex items-center gap-1.5 mb-1">
                    <span>🚩 Żółte: Rozruch / Start</span>
                  </div>
                  <p className="text-xs leading-relaxed text-amber-950 font-bold">
                    Uruchamiają program! Po kliknięciu zielonej flagi, po dotknięciu postaci na ekranie, przy zderzeniu z inną postacią lub po odebraniu kolorowej koperty.
                  </p>
                </div>

                {/* Blue */}
                <div
                  className="p-3 rounded-2xl border-2 text-white shadow-xs"
                  style={{ backgroundColor: CATEGORY_COLORS.motion.bg, borderColor: CATEGORY_COLORS.motion.border }}
                >
                  <div className="font-black text-sm flex items-center gap-1.5 mb-1">
                    <span>➔ Niebieskie: Ruch</span>
                  </div>
                  <p className="text-xs leading-relaxed text-blue-950 font-bold">
                    Poruszają robota lub zwierzaka: krok w prawo, lewo, w górę, w dół, obrót oraz skok. Kliknij liczbę pod spodem, by zmienić liczbę kroków!
                  </p>
                </div>

                {/* Purple */}
                <div
                  className="p-3 rounded-2xl border-2 text-white shadow-xs"
                  style={{ backgroundColor: CATEGORY_COLORS.looks.bg, borderColor: CATEGORY_COLORS.looks.border }}
                >
                  <div className="font-black text-sm flex items-center gap-1.5 mb-1">
                    <span>💬 Fioletowe: Wygląd</span>
                  </div>
                  <p className="text-xs leading-relaxed text-purple-950 font-bold">
                    Postać może mówić w dymku (z prawdziwym głosem lektora!), powiększać się, pomniejszać, ukrywać lub pojawiać na nowo.
                  </p>
                </div>

                {/* Green */}
                <div
                  className="p-3 rounded-2xl border-2 text-white shadow-xs"
                  style={{ backgroundColor: CATEGORY_COLORS.sound.bg, borderColor: CATEGORY_COLORS.sound.border }}
                >
                  <div className="font-black text-sm flex items-center gap-1.5 mb-1">
                    <span>🔊 Zielone: Dźwięki</span>
                  </div>
                  <p className="text-xs leading-relaxed text-emerald-950 font-bold">
                    Wesołe odgłosy generowane na żywo w przeglądarce: kliknięcie Pop, pisk Robota, sprężyna Boing, dzwoneczek Ding oraz miauknięcie Kota!
                  </p>
                </div>

                {/* Orange */}
                <div
                  className="p-3 rounded-2xl border-2 text-white shadow-xs"
                  style={{ backgroundColor: CATEGORY_COLORS.control.bg, borderColor: CATEGORY_COLORS.control.border }}
                >
                  <div className="font-black text-sm flex items-center gap-1.5 mb-1">
                    <span>⏱️ Pomarańczowe: Sterowanie</span>
                  </div>
                  <p className="text-xs leading-relaxed text-orange-950 font-bold">
                    Czekaj określoną liczbę dziesiątych części sekundy (np. 10 = 1 sekunda), zatrzymaj bieg programu lub zmień prędkość robota (żółw, człowiek, błyskawica).
                  </p>
                </div>

                {/* Red */}
                <div
                  className="p-3 rounded-2xl border-2 text-white shadow-xs"
                  style={{ backgroundColor: CATEGORY_COLORS.end.bg, borderColor: CATEGORY_COLORS.end.border }}
                >
                  <div className="font-black text-sm flex items-center gap-1.5 mb-1">
                    <span>⏹️ Czerwone: Zakończenie</span>
                  </div>
                  <p className="text-xs leading-relaxed text-red-950 font-bold">
                    Koniec programu, pętla bez końca (powtarza w nieskończoność) lub automatyczne przejście do kolejnej sceny (np. start rakiety -&gt; lądowanie na Księżycu).
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'robotics' && (
            <div className="space-y-3">
              <div className="bg-sky-50 border-2 border-sky-300 p-4 rounded-2xl space-y-2">
                <h4 className="font-black text-sky-950 flex items-center gap-2">
                  <span className="text-lg">📐</span>
                  <span>Jak korzystać z siatki współrzędnych 20x15?</span>
                </h4>
                <p className="text-xs sm:text-sm font-semibold text-sky-900 leading-relaxed">
                  Podobnie jak w prawdziwym ScratchJr, scena podzielona jest na <strong>20 kolumn</strong> (oś pozioma X) oraz <strong>15 wierszy</strong> (oś pionowa Y).
                </p>
                <ul className="text-xs space-y-1.5 list-disc list-inside font-bold text-sky-950">
                  <li>Włącz ikonę <strong>Siatki (#)</strong> w górnym menu, by zobaczyć linie i numery pól.</li>
                  <li>Przeciągnij postać po ekranie — nad jej głową pojawi się dokładna pozycja (np. X: 4, Y: 4).</li>
                  <li>Gdy Robot stoi na polu X=4 i ma dotrzeć do gwiazdki na X=9, wystarczy policzyć: 9 - 4 = <strong>5 kroków w prawo</strong>!</li>
                  <li>To idealny sposób na ćwiczenie logicznego myślenia, orientacji przestrzennej i liczenia kroków w robotyce.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'sharing' && (
            <div className="space-y-3">
              <div className="bg-emerald-50 border-2 border-emerald-300 p-4 rounded-2xl space-y-2">
                <h4 className="font-black text-emerald-950 flex items-center gap-2">
                  <span className="text-lg">🚀</span>
                  <span>Udostępnianie projektów dzieciom i publikacja na GitHubie</span>
                </h4>
                <p className="text-xs sm:text-sm font-semibold text-emerald-900 leading-relaxed">
                  Każdy projekt stworzony w tej aplikacji można w ułamku sekundy zapisać do pliku i przekazać innym:
                </p>
                <ol className="text-xs space-y-2 list-decimal list-inside font-bold text-emerald-950">
                  <li>
                    Kliknij przycisk <strong>Udostępnij (strzałka ze skrzydłami)</strong> w nagłówku lub ikonę pobierania na liście projektów.
                  </li>
                  <li>
                    Pobierze się lekki plik <code>.json</code> z pełnym kodem, scenami i postaciami.
                  </li>
                  <li>
                    Drugie dziecko na swoim telefonie lub komputerze klika <strong>Wczytaj z pliku</strong> na stronie głównej i natychmiast widzi projekt kolegi!
                  </li>
                  <li>
                    Całość możesz umieścić na darmowym <strong>GitHub Pages</strong> — aplikacja nie potrzebuje żadnego zewnętrznego serwera ani baz danych. Działa w 100% w przeglądarce i jest bezpieczna dla dzieci!
                  </li>
                </ol>

                <div className="mt-4 p-3 bg-amber-100 rounded-2xl border border-amber-300">
                  <h5 className="font-black text-amber-950 text-xs flex items-center gap-1.5 mb-1">
                    <span>📱 Pełny ekran bez paska adresu na telefonie:</span>
                  </h5>
                  <p className="text-xs text-amber-900 font-semibold leading-relaxed">
                    1. Kliknij przycisk <strong>Pełny ekran (ikona rozszerzających się strzałek)</strong> w górnym pasku, aby natychmiast ukryć pasek adresu przeglądarki.<br />
                    2. Lub w menu przeglądarki na telefonie kliknij <strong>„Dodaj do ekranu głównego” / „Zainstaluj aplikację”</strong> — gra otworzy się wtedy w trybie pełnoekranowym bez żadnych ramek przeglądarki, dokładnie jak aplikacja ze sklepu Google Play!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-amber-100 p-3 border-t border-amber-300 flex justify-end">
          <button
            type="button"
            onClick={() => {
              sound.playPop();
              onClose();
            }}
            className="px-5 py-2 rounded-2xl bg-amber-400 hover:bg-amber-500 active:scale-95 text-amber-950 font-black text-sm border-2 border-amber-500 shadow-sm transition-transform"
          >
            Rozumiem, ruszamy!
          </button>
        </div>
      </div>
    </div>
  );
};
