/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BrainCircuit, Mail, Lock, LogIn, Home } from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: (email: string, name: string) => void;
}

export default function LoginView({ onLoginSuccess }: LoginViewProps) {
  const [email, setEmail] = useState('dolimerm@gmail.com');
  const [password, setPassword] = useState('••••••••');
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('Dolimer Martínez');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess(email, name);
  };

  const handleOAuth = (provider: 'google' | 'apple') => {
    if (provider === 'google') {
      onLoginSuccess('dolimerm@gmail.com', 'Dolimer Martínez');
    } else {
      onLoginSuccess('dolimerm@gmail.com', 'Dolimer Martínez');
    }
  };

  return (
    <div
      id='login-view-container'
      className='h-full w-full bg-slate-950 flex flex-col justify-between p-6 text-white overflow-y-auto'
    >
      {/* Top Graphic */}
      <div className='flex flex-col items-center mt-4'>
        <div className='p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 mb-3'>
          <BrainCircuit className='w-10 h-10 text-emerald-400' />
        </div>
        <h2 className='text-2xl font-bold tracking-tight text-white'>
          {isRegistering ? 'Crear Cuenta' : 'Iniciar Sesión'}
        </h2>
        <p className='text-xs text-slate-400 mt-1 text-center max-w-xs'>
          Accede a tus listas colaborativas y activa el detector de precios más
          cercano.
        </p>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className='flex flex-col gap-3 my-4'>
        {isRegistering && (
          <div className='flex flex-col gap-1'>
            <label className='text-[10px] uppercase font-mono tracking-wider text-slate-400'>
              Nombre Completo
            </label>
            <div className='relative'>
              <input
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
                className='w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:border-emerald-500 text-slate-100 placeholder:text-slate-600'
                placeholder='Dolimer Martinez'
                required
              />
            </div>
          </div>
        )}

        <div className='flex flex-col gap-1'>
          <label className='text-[10px] uppercase font-mono tracking-wider text-slate-400'>
            Email de Firebase Auth
          </label>
          <div className='relative'>
            <div className='absolute inset-y-0 left-3 flex items-center pointer-events-none'>
              <Mail className='w-4 h-4 text-emerald-500/60' />
            </div>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:border-emerald-500 text-slate-100 placeholder:text-slate-600'
              placeholder='correo@ejemplo.com'
              required
            />
          </div>
        </div>

        <div className='flex flex-col gap-1'>
          <label className='text-[10px] uppercase font-mono tracking-wider text-slate-400'>
            Contraseña
          </label>
          <div className='relative'>
            <div className='absolute inset-y-0 left-3 flex items-center pointer-events-none'>
              <Lock className='w-4 h-4 text-emerald-500/60' />
            </div>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:border-emerald-500 text-slate-100'
              placeholder='Contraseña'
              required
            />
          </div>
        </div>

        {!isRegistering && (
          <div className='text-right'>
            <button
              type='button'
              className='text-xs text-emerald-400 hover:underline'
              onClick={() =>
                alert('Simulando envío de correo de recuperación a: ' + email)
              }
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
        )}

        <button
          type='submit'
          className='w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-2 mt-2 transition-colors cursor-pointer'
        >
          <LogIn className='w-4 h-4' />
          <span>
            {isRegistering ? 'Registrarse con Correo' : 'Ingresar con Correo'}
          </span>
        </button>
      </form>

      {/* Alternative OAuth flow */}
      <div className='flex flex-col gap-2'>
        <div className='flex items-center gap-2'>
          <div className='flex-1 h-px bg-slate-800' />
          <span className='text-[10px] text-slate-500 font-mono'>
            O CONTINUAR CON
          </span>
          <div className='flex-1 h-px bg-slate-800' />
        </div>

        <div className='grid grid-cols-2 gap-2'>
          <button
            onClick={() => handleOAuth('google')}
            className='flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-900 border border-slate-800 rounded-xl text-xs hover:bg-slate-800 transition-colors'
          >
            <Home className='w-3.5 h-3.5 text-red-400' />
            <span>Google</span>
          </button>
          <button
            onClick={() => handleOAuth('apple')}
            className='flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-900 border border-slate-800 rounded-xl text-xs hover:bg-slate-800 transition-colors'
          >
            <span className='font-bold text-slate-100'> Apple</span>
          </button>
        </div>

        <div className='text-center mt-3 mb-1'>
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className='text-slate-400 hover:text-emerald-400 text-xs'
          >
            {isRegistering
              ? '¿Ya tienes cuenta? Inicia Sesión'
              : '¿No tienes cuenta? Registrate aquí'}
          </button>
        </div>
      </div>
    </div>
  );
}
