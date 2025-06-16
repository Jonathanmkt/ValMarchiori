
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Mail, Lock, ArrowRight } from 'lucide-react';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  const handleGoogleLogin = () => {
    console.log('Login com Google');
    navigate('/dashboard');
  };

  return (
    <motion.div 
      className="flex justify-center lg:justify-end w-full"
      initial={{ opacity: 0, x: 100, rotateY: 90 }}
      animate={{ opacity: 1, x: 0, rotateY: 0 }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <motion.div
        className="w-full max-w-lg lg:max-w-xl xl:max-w-2xl"
        whileHover={{ scale: 1.02, rotateY: 2 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="w-full bg-white/95 backdrop-blur-sm border-0 shadow-2xl rounded-2xl">
          <CardHeader className="space-y-2 text-center pb-8 pt-8 px-8 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <CardTitle className="text-3xl lg:text-4xl font-bold text-primary mb-2">
                Bem-vindo de volta
              </CardTitle>
              <CardDescription className="text-gray-600 text-lg lg:text-xl">
                Entre em sua conta para acessar o painel
              </CardDescription>
            </motion.div>
          </CardHeader>
          
          <CardContent className="space-y-6 px-8 lg:px-12 pb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  variant="outline" 
                  className="w-full h-14 lg:h-16 text-lg border-2 hover:bg-gray-50 transition-all duration-200 relative overflow-hidden group rounded-xl"
                  onClick={handleGoogleLogin}
                >
                  <motion.div
                    className="absolute inset-0 bg-blue-50"
                    initial={{ scale: 0 }}
                    whileHover={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <svg className="w-6 h-6 mr-3 relative z-10" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="relative z-10 font-semibold">Continuar com Google</span>
                </Button>
              </motion.div>
            </motion.div>

            <div className="relative my-8">
              <Separator />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-white px-4 text-gray-500 text-lg font-medium">ou</span>
              </div>
            </div>

            <motion.form 
              onSubmit={handleLogin} 
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <div className="space-y-3">
                <Label htmlFor="email" className="text-gray-700 text-lg font-medium">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                  <motion.div
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-12 h-14 lg:h-16 text-lg border-gray-200 focus:border-accent rounded-xl"
                      required
                    />
                  </motion.div>
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="password" className="text-gray-700 text-lg font-medium">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                  <motion.div
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-12 h-14 lg:h-16 text-lg border-gray-200 focus:border-accent rounded-xl"
                      required
                    />
                  </motion.div>
                </div>
              </div>

              <div className="pt-4">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    type="submit" 
                    className="w-full h-14 lg:h-16 text-lg bg-primary hover:bg-secondary transition-all duration-200 font-semibold relative overflow-hidden group rounded-xl"
                  >
                    <motion.div
                      className="absolute inset-0 bg-white/20"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.6 }}
                    />
                    <span className="relative z-10">Entrar na plataforma</span>
                    <ArrowRight className="ml-3 h-5 w-5 relative z-10" />
                  </Button>
                </motion.div>
              </div>
            </motion.form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};
