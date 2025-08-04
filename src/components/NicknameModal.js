import React, { useState, useEffect } from 'react';
import useStore from '../store/useStore';

const NicknameModal = () => {
  const { 
    showNicknameModal, 
    setNickname, 
    setAvatar, 
    avatar,
    getRetroAvatars 
  } = useStore();
  
  const [inputNickname, setInputNickname] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(avatar);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const avatars = getRetroAvatars();

  useEffect(() => {
    if (showNicknameModal) {
      setIsAnimating(true);
    }
  }, [showNicknameModal]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedNickname = inputNickname.trim();
    
    if (trimmedNickname.length < 2) {
      alert('⚠️ Nickname deve ter pelo menos 2 caracteres!');
      return;
    }
    
    if (trimmedNickname.length > 20) {
      alert('⚠️ Nickname deve ter no máximo 20 caracteres!');
      return;
    }
    
    // Verificar caracteres especiais
    const validNickname = /^[a-zA-Z0-9_\-\s]+$/.test(trimmedNickname);
    if (!validNickname) {
      alert('⚠️ Use apenas letras, números, _ e -');
      return;
    }
    
    setAvatar(selectedAvatar);
    setNickname(trimmedNickname);
  };

  const generateRandomNickname = () => {
    const adjectives = [
      'Cyber', 'Neon', 'Retro', 'Pixel', 'Digital', 'Virtual', 'Electric',
      'Cosmic', 'Quantum', 'Binary', 'Matrix', 'Glitch', 'Arcade'
    ];
    
    const nouns = [
      'Gamer', 'Hacker', 'Ninja', 'Warrior', 'Master', 'Legend', 'Hero',
      'Ghost', 'Phoenix', 'Dragon', 'Wolf', 'Eagle', 'Tiger'
    ];
    
    const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomNum = Math.floor(Math.random() * 999) + 1;
    
    setInputNickname(`${randomAdj}${randomNoun}${randomNum}`);
  };

  const selectRandomAvatar = () => {
    const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
    setSelectedAvatar(randomAvatar);
  };

  if (!showNicknameModal) return null;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div className={`bg-retro-dark border-2 border-neon-cyan rounded-lg p-6 w-full max-w-md transform transition-all duration-500 ${
        isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
      }`}>
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-2 animate-pulse">🎮</div>
          <h2 className="text-neon-cyan font-pixel text-lg neon-text mb-2">
            BEM-VINDO AO RETROCHAT
          </h2>
          <p className="text-white text-sm">
            Escolha seu nickname e avatar para entrar no chat!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nickname Input */}
          <div>
            <label className="block text-neon-cyan font-pixel text-sm mb-2">
              NICKNAME:
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputNickname}
                onChange={(e) => setInputNickname(e.target.value)}
                placeholder="Digite seu nickname..."
                className="flex-1 retro-input"
                maxLength={20}
                autoFocus
              />
              <button
                type="button"
                onClick={generateRandomNickname}
                className="retro-button px-3 py-2 text-xs"
                title="Gerar nickname aleatório"
              >
                🎲
              </button>
            </div>
            <div className="text-xs text-retro-border mt-1">
              {inputNickname.length}/20 caracteres
            </div>
          </div>

          {/* Avatar Selection */}
          <div>
            <label className="block text-neon-cyan font-pixel text-sm mb-2">
              AVATAR:
            </label>
            <div className="grid grid-cols-5 gap-2 mb-2">
              {avatars.map((avatarOption) => (
                <button
                  key={avatarOption}
                  type="button"
                  onClick={() => setSelectedAvatar(avatarOption)}
                  className={`p-3 text-2xl border-2 rounded transition-all duration-200 ${
                    selectedAvatar === avatarOption
                      ? 'border-neon-cyan bg-neon-cyan/20 scale-110 shadow-neon'
                      : 'border-retro-border hover:border-neon-cyan/50 hover:scale-105'
                  }`}
                >
                  {avatarOption}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={selectRandomAvatar}
              className="w-full retro-button text-xs py-2"
            >
              🎲 Avatar Aleatório
            </button>
          </div>

          {/* Preview */}
          <div className="bg-retro-gray/50 border border-retro-border rounded p-3">
            <div className="text-neon-cyan font-pixel text-xs mb-2">PREVIEW:</div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{selectedAvatar}</span>
              <span className="text-white font-pixel text-sm">
                {inputNickname || 'SeuNickname'}
              </span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={!inputNickname.trim()}
              className="flex-1 retro-button py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🚀 ENTRAR NO CHAT
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <div className="text-xs text-retro-border mb-2">
            💡 Dica: Use /help no chat para ver todos os comandos!
          </div>
          <div className="text-xs text-neon-green">
            ✨ Nostalgia dos anos 2000 garantida! ✨
          </div>
        </div>
      </div>

      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-2 h-2 bg-neon-cyan rounded-full animate-ping"></div>
        <div className="absolute top-20 right-20 w-1 h-1 bg-neon-pink rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-1 h-1 bg-neon-green rounded-full animate-ping"></div>
        <div className="absolute bottom-10 right-10 w-2 h-2 bg-neon-yellow rounded-full animate-pulse"></div>
      </div>
    </div>
  );
};

export default NicknameModal;