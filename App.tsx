/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Play, 
  Plus, 
  Settings, 
  X, 
  LogOut, 
  Trash2, 
  Film, 
  ChevronRight,
  Info,
  Lock,
  Home as HomeIcon,
  Clapperboard,
  Upload,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Movie {
  id: string;
  title: string;
  thumbnail: string;
  externalUrl: string;
  description?: string;
  category?: string;
}

const DEFAULT_MOVIES: Movie[] = [
  {
    id: 'superman-default',
    title: 'SUPERMAN: O Último Filho do Amanhã',
    thumbnail: 'https://picsum.photos/seed/superman/800/450',
    externalUrl: 'https://odysee.com/@Odysee:8/Odysee-Explainer:b',
    description: 'Uma releitura épica do Homem de Aço criada inteiramente por IA.',
    category: 'IA Feature'
  }
];

type Tab = 'inicio' | 'filmes';

interface MovieCardProps {
  movie: Movie;
  isAdmin: boolean;
  onDelete: (id: string) => void;
  onPlay: (url: string) => void;
  key?: React.Key;
}

function MovieCard({ movie, isAdmin, onDelete, onPlay }: MovieCardProps) {
  return (
    <div className="relative group">
      <div 
        className="card-hover-effect aspect-[2/3] md:aspect-video rounded-xl overflow-hidden cursor-pointer relative shadow-lg border border-white/5"
        onClick={() => onPlay(movie.externalUrl)}
      >
        <img 
          src={movie.thumbnail} 
          alt={movie.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-black">
              <Play fill="currentColor" size={16} className="ml-0.5" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest">Assistir</span>
          </div>
          <h4 className="font-bold text-sm line-clamp-2">{movie.title}</h4>
        </div>
      </div>
      <div className="mt-3 flex justify-between items-start px-1">
        <div>
          <h4 className="font-bold text-xs line-clamp-1 group-hover:text-cyan-400 transition-colors">{movie.title}</h4>
          <span className="text-[9px] text-gray-500 uppercase tracking-widest font-black">{movie.category}</span>
        </div>
        {isAdmin && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onDelete(movie.id);
            }}
            className="text-gray-500 hover:text-red-500 hover:bg-red-500/10 transition-all p-2 bg-white/5 rounded-full"
            title="Excluir Filme"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('inicio');
  const [movies, setMovies] = useState<Movie[]>(() => {
    const saved = localStorage.getItem('filmai_movies_v3');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.length > 0 ? parsed : DEFAULT_MOVIES;
      } catch (e) {
        return DEFAULT_MOVIES;
      }
    }
    return DEFAULT_MOVIES;
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [password, setPassword] = useState('');
  
  // Form state
  const [newMovie, setNewMovie] = useState({
    title: '',
    thumbnail: '',
    externalUrl: '',
    description: '',
    category: 'IA Feature'
  });

  // Save movies to localStorage
  useEffect(() => {
    localStorage.setItem('filmai_movies_v3', JSON.stringify(movies));
  }, [movies]);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAdmin(true);
      setShowAdminLogin(false);
      setPassword('');
    } else {
      alert('Senha incorreta');
    }
  };

  const handleAddMovie = (e: React.FormEvent) => {
    e.preventDefault();
    const movie: Movie = {
      ...newMovie,
      id: Date.now().toString()
    };
    setMovies([movie, ...movies]);
    setShowAddModal(false);
    setNewMovie({ title: '', thumbnail: '', externalUrl: '', description: '', category: 'IA Feature' });
    alert('Vitrine Atualizada com Sucesso! Postado na Comunidade.');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewMovie({ ...newMovie, thumbnail: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const deleteMovie = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este filme?')) {
      setMovies(prev => prev.filter(m => m.id !== id));
    }
  };

  const clearAllMovies = () => {
    if (window.confirm('ATENÇÃO: Isso apagará TODOS os filmes da vitrine. Deseja continuar?')) {
      setMovies([]);
    }
  };

  const handlePlay = (url: string) => {
    window.open(url, '_blank');
  };

  const featuredMovie = useMemo(() => movies[0] || DEFAULT_MOVIES[0], [movies]);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-cyan-600 selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 px-6 py-4 flex items-center justify-between bg-gradient-to-b from-black/90 to-transparent backdrop-blur-sm">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setActiveTab('inicio')}>
            <div className="relative w-12 h-12 flex items-center justify-center">
              {/* Stylized Logo representing the Brain/Reel combo */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full opacity-20 group-hover:opacity-40 transition-opacity blur-sm"></div>
              <div className="relative z-10 flex items-center">
                <div className="w-6 h-10 border-r-2 border-white/20 flex flex-col justify-around py-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/40"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-white/40"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-white/40"></div>
                </div>
                <div className="w-6 h-10 flex flex-col justify-around py-1 pl-1">
                  <div className="w-full h-0.5 bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div>
                  <div className="w-3/4 h-0.5 bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div>
                  <div className="w-full h-0.5 bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div>
                </div>
              </div>
            </div>
            <div className="flex flex-col -space-y-1">
              <h1 className="text-2xl font-black tracking-tighter text-white font-display">
                FILMAI <span className="text-cyan-400">AI</span>
              </h1>
              <span className="text-[8px] uppercase tracking-[0.4em] text-gray-500 font-bold">Movies</span>
            </div>
          </div>
          
          <div className="hidden md:flex gap-8 text-sm font-bold uppercase tracking-widest">
            <button 
              onClick={() => setActiveTab('inicio')}
              className={`transition-colors flex items-center gap-2 ${activeTab === 'inicio' ? 'text-white border-b-2 border-cyan-400 pb-1' : 'text-gray-400 hover:text-white'}`}
            >
              <HomeIcon size={16} /> Início
            </button>
            <button 
              onClick={() => setActiveTab('filmes')}
              className={`transition-colors flex items-center gap-2 ${activeTab === 'filmes' ? 'text-white border-b-2 border-cyan-400 pb-1' : 'text-gray-400 hover:text-white'}`}
            >
              <Clapperboard size={16} /> Filmes
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {isAdmin ? (
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowAddModal(true)}
                className="bg-cyan-600 text-white px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 hover:bg-cyan-700 transition-colors shadow-lg shadow-cyan-600/20"
              >
                <Plus size={18} /> Painel do Criador
              </button>
              <button 
                onClick={() => setIsAdmin(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                title="Sair do Modo Criador"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setShowAdminLogin(true)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
              title="Acesso Criador"
            >
              <Settings size={20} />
            </button>
          )}
        </div>
      </nav>

      {activeTab === 'inicio' ? (
        <>
          {/* Hero Section */}
          <section className="relative h-[95vh] w-full overflow-hidden">
            <div className="absolute inset-0">
              {/* Cinematic Banner Placeholder matching the provided creative */}
              <img 
                src="https://picsum.photos/seed/filmai-hero/1920/1080?blur=2" 
                alt="Destaque" 
                className="w-full h-full object-cover opacity-40 scale-105"
                referrerPolicy="no-referrer"
              />
              {/* Energy/Lightning Overlay Effect */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.1),transparent_70%)]"></div>
              <div className="absolute inset-0 netflix-gradient" />
            </div>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 space-y-8">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-4"
              >
                <h2 className="text-6xl md:text-9xl font-black tracking-tighter font-display leading-none text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                  FILMAI <span className="text-cyan-400">AI</span>
                </h2>
                <h3 className="text-xl md:text-3xl font-bold tracking-[0.2em] text-gray-400 uppercase">Movies</h3>
              </motion.div>

              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="text-lg md:text-2xl text-cyan-100/80 font-light tracking-wide max-w-2xl italic"
              >
                "Where Hollywood stopped, we continue"
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
                className="flex items-center gap-6 pt-8"
              >
                <button 
                  onClick={() => handlePlay(featuredMovie.externalUrl)}
                  className="bg-white text-black px-12 py-5 rounded-full font-black uppercase tracking-widest flex items-center gap-3 hover:bg-cyan-400 hover:text-black transition-all hover:scale-110 text-lg shadow-[0_0_40px_rgba(255,255,255,0.2)]"
                >
                  <Play fill="currentColor" size={24} /> Assistir Agora
                </button>
              </motion.div>
            </div>
          </section>

          {/* Trending Section */}
          <main className="px-6 md:px-16 -mt-32 relative z-10 pb-20">
            <div className="space-y-12">
              <div>
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 font-display">
                  Bombando <ChevronRight className="text-cyan-400" />
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {movies.slice(0, 5).map((movie) => (
                    <MovieCard key={movie.id} movie={movie} isAdmin={isAdmin} onDelete={deleteMovie} onPlay={handlePlay} />
                  ))}
                </div>
              </div>
            </div>
          </main>
        </>
      ) : (
        /* Movies Tab */
        <main className="pt-32 px-6 md:px-16 pb-20 min-h-screen">
          <div className="space-y-12">
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-4xl font-black font-display">Catálogo de Filmes</h2>
                <div className="text-sm text-gray-500">{movies.length} títulos disponíveis</div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                {movies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} isAdmin={isAdmin} onDelete={deleteMovie} onPlay={handlePlay} />
                ))}
              </div>
              
              {movies.length === 0 && (
                <div className="text-center py-40 space-y-4 opacity-50">
                  <Film size={64} className="mx-auto text-gray-700" />
                  <p className="text-xl">Nenhum filme adicionado ainda.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      )}

      {/* Footer */}
      <footer className="border-t border-white/5 py-16 px-16 text-center space-y-6 bg-black">
        <div className="flex items-center justify-center gap-2">
          <div className="w-8 h-8 bg-cyan-600 rounded flex items-center justify-center">
            <Film className="text-white" size={16} />
          </div>
          <h1 className="text-xl font-black tracking-tighter text-white opacity-80">FILMAI <span className="text-cyan-400">AI</span></h1>
        </div>
        <p className="text-gray-500 text-sm italic max-w-md mx-auto">"Onde Hollywood parou, nós continuamos. A revolução do cinema feita por Inteligência Artificial."</p>
        <div className="flex justify-center gap-8 text-xs text-gray-600 uppercase tracking-widest font-bold">
          <a href="#" className="hover:text-cyan-400 transition-colors">Privacidade</a>
          <a href="#" className="hover:text-cyan-400 transition-colors">Termos</a>
          <a href="#" className="hover:text-cyan-400 transition-colors">Contato</a>
        </div>
        <div className="text-[10px] text-gray-800 uppercase tracking-[0.3em] pt-4">
          © 2026 FILMAI AI MOVIES - ALL RIGHTS RESERVED
        </div>
      </footer>

      {/* Modals */}
      <AnimatePresence>
        {/* Admin Login Modal */}
        {showAdminLogin && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-[#141414] p-10 rounded-3xl w-full max-w-md border border-white/10 space-y-8 shadow-2xl"
            >
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-cyan-600/10 rounded-2xl flex items-center justify-center mx-auto text-cyan-400 border border-cyan-600/20">
                  <Lock size={32} />
                </div>
                <h2 className="text-3xl font-black font-display">Acesso Restrito</h2>
                <p className="text-gray-400 text-sm">Digite a senha para gerenciar a vitrine</p>
              </div>
              
              <form onSubmit={handleAdminLogin} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Senha de Acesso</label>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-cyan-400 transition-all text-center text-xl tracking-widest"
                    autoFocus
                  />
                </div>
                <div className="flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setShowAdminLogin(false)}
                    className="flex-1 px-6 py-4 rounded-xl font-bold hover:bg-white/5 transition-colors text-gray-400"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-cyan-600 text-white px-6 py-4 rounded-xl font-bold hover:bg-cyan-700 transition-all shadow-lg shadow-cyan-600/30"
                  >
                    Entrar
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* Add Movie Modal (Painel do Criador) */}
        {showAddModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-[#141414] p-10 rounded-3xl w-full max-w-2xl border border-white/10 space-y-8 overflow-y-auto max-h-[90vh] shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-3xl font-black font-display">Painel do Criador</h2>
                  <p className="text-cyan-400 text-xs font-bold uppercase tracking-widest">Postar na Comunidade</p>
                </div>
                <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-white transition-colors">
                  <X size={32} />
                </button>
              </div>
              
              <form onSubmit={handleAddMovie} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3 md:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Título do Filme</label>
                  <input 
                    required
                    type="text" 
                    value={newMovie.title}
                    onChange={(e) => setNewMovie({...newMovie, title: e.target.value})}
                    placeholder="Ex: O Último Algoritmo"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-cyan-400 transition-all"
                  />
                </div>

                <div className="space-y-3 md:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Upload da Capa (Thumbnail)</label>
                  <div className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-white/10 rounded-2xl bg-white/5 hover:bg-white/10 transition-all group relative overflow-hidden">
                    {newMovie.thumbnail ? (
                      <>
                        <img src={newMovie.thumbnail} className="w-full h-full object-cover opacity-50" />
                        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2">
                          <CheckCircle2 className="text-cyan-400" size={32} />
                          <span className="text-xs font-bold">Imagem Carregada</span>
                          <button 
                            type="button" 
                            onClick={() => setNewMovie({...newMovie, thumbnail: ''})}
                            className="text-[10px] text-red-500 underline uppercase font-black"
                          >
                            Remover
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <Upload className="text-gray-500 group-hover:text-cyan-400 transition-colors mb-2" size={32} />
                        <span className="text-xs text-gray-400">Arraste ou clique para subir a imagem</span>
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-3 md:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Link do Odysee</label>
                  <input 
                    required
                    type="url" 
                    value={newMovie.externalUrl}
                    onChange={(e) => setNewMovie({...newMovie, externalUrl: e.target.value})}
                    placeholder="https://odysee.com/filme"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-cyan-400 transition-all"
                  />
                </div>

                <div className="space-y-3 md:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Descrição / Sinopse</label>
                  <textarea 
                    value={newMovie.description}
                    onChange={(e) => setNewMovie({...newMovie, description: e.target.value})}
                    placeholder="Conte um pouco sobre a história do filme..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-cyan-400 transition-all min-h-[120px] resize-none"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Categoria</label>
                  <select 
                    value={newMovie.category}
                    onChange={(e) => setNewMovie({...newMovie, category: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-cyan-400 transition-all appearance-none"
                  >
                    <option value="IA Feature">IA Feature</option>
                    <option value="Ficção Científica">Ficção Científica</option>
                    <option value="Documentário">Documentário</option>
                    <option value="Experimental">Experimental</option>
                    <option value="Animação">Animação</option>
                    <option value="Cyberpunk">Cyberpunk</option>
                  </select>
                </div>

                <div className="md:col-span-2 pt-6 flex flex-col gap-4">
                  <button 
                    type="submit"
                    className="w-full bg-cyan-600 text-white px-6 py-5 rounded-xl font-black uppercase tracking-widest hover:bg-cyan-700 transition-all shadow-xl shadow-cyan-600/20 text-lg flex items-center justify-center gap-3"
                  >
                    <Plus size={24} /> ATUALIZAR E POSTAR NA COMUNIDADE
                  </button>
                  
                  <button 
                    type="button"
                    onClick={clearAllMovies}
                    className="w-full bg-transparent border border-red-900/30 text-red-500/50 px-6 py-3 rounded-xl font-bold uppercase tracking-widest hover:bg-red-500/10 hover:text-red-500 transition-all text-xs flex items-center justify-center gap-2"
                  >
                    <Trash2 size={14} /> Limpar Toda a Vitrine
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
