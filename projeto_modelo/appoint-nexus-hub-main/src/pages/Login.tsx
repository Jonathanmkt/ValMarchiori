
import React from 'react';
import { motion, useScroll } from 'framer-motion';
import { BackgroundElements } from '@/components/landing/BackgroundElements';
import { LoginForm } from '@/components/landing/LoginForm';
import { LoginHero } from '@/components/landing/LoginHero';

const Login = () => {
  const { scrollYProgress } = useScroll();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-tertiary relative overflow-hidden">
      <BackgroundElements scrollYProgress={scrollYProgress} />

      <div className="min-h-screen grid lg:grid-cols-2 relative z-10">
        {/* Left Side - Hero Content */}
        <LoginHero />

        {/* Right Side - Login Form */}
        <div className="flex items-center justify-center p-8 lg:p-16">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Login;
