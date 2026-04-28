import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { auth, googleProvider } from '../../lib/firebase';
import { LogIn, UserPlus, Mail, Lock, Loader2, Chrome, RefreshCw, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner';


// RobotHands overlays hands when password is hidden
const RobotHands = () => {
  const [hidden, setHidden] = React.useState(true);
  React.useEffect(() => {
    const pwInput = document.getElementById('auth-password-input');
    if (!pwInput) return;
    const handler = () => setHidden((pwInput as HTMLInputElement).type === 'password');
    pwInput.addEventListener('input', handler);
    pwInput.addEventListener('change', handler);
    return () => {
      pwInput.removeEventListener('input', handler);
      pwInput.removeEventListener('change', handler);
    };
  }, []);
  if (!hidden) return null;
  return (
    <>
      <span className="absolute left-4 top-7 text-3xl select-none z-20" role="img" aria-label="hand">🖐️</span>
      <span className="absolute right-4 top-7 text-3xl select-none z-20" role="img" aria-label="hand">🖐️</span>
    </>
  );
};

export const AuthModal = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      
      // Google accounts are pre-verified, so we mark them as verified
      // if Firebase hasn't already done so (rare case)
      if (!result.user.emailVerified) {
        // For Google OAuth, we can force mark as verified since Google verified the email
        // Reload user to get updated verification status
        await result.user.reload();
      }
      
      toast.success("Welcome to the platform!");
    } catch (error: any) {
      console.error("Google auth error:", error.code, error.message);
      
      switch (error.code) {
        case 'auth/popup-closed-by-user':
          console.log("Google sign-in popup was closed by user");
          break;
        case 'auth/account-exists-with-different-credential':
          toast.error("An account already exists with this email using a different sign-in method");
          break;
        case 'auth/web-storage-unsupported':
          toast.error("Web storage is not supported. Please check your browser settings");
          break;
        default:
          toast.error(error.message || "Failed to sign in with Google");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!email || !password) {
      toast.error("Email and password are required");
      return;
    }
    
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    
    if (!isLogin && !displayName) {
      toast.error("Full name is required");
      return;
    }
    
    setLoading(true);
    try {
      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        
        if (!userCredential.user.emailVerified) {
          toast.error("Please verify your email before signing in");
          setVerificationSent(true);
          setPendingEmail(email);
          return;
        }
        
        toast.success("Welcome back!");
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        if (displayName) {
          try {
            await updateProfile(userCredential.user, { displayName });
          } catch (profileError: any) {
            console.error("Failed to update display name:", profileError);
            toast.warning("Account created but profile name update failed.");
          }
        }
        
        // Send verification email
        try {
          await sendEmailVerification(userCredential.user);
          setVerificationSent(true);
          setPendingEmail(email);
          toast.success("Account created! Please check your email to verify.");
        } catch (verifyError: any) {
          console.error("Failed to send verification email:", verifyError);
          toast.error("Account created but verification email failed. Try resending.");
        }
      }
    } catch (error: any) {
      console.error("Email auth error:", error.code, error.message);
      
      if (error.code === 'auth/email-already-in-use') {
        toast.error("An account already exists with this email. Please sign in instead.");
        setIsLogin(true);
      } else if (error.code === 'auth/invalid-email') {
        toast.error("Please enter a valid email address");
      } else if (error.code === 'auth/weak-password') {
        toast.error("Password is too weak. Use at least 6 characters");
      } else if (error.code === 'auth/invalid-credential') {
        toast.error("Invalid email or password");
      } else if (error.code === 'auth/user-disabled') {
        toast.error("This account has been disabled");
      } else if (error.code === 'auth/too-many-requests') {
        toast.error("Too many failed attempts. Please try again later");
      } else if (error.code === 'auth/operation-not-allowed') {
        toast.error("Email/password sign-up is not enabled");
      } else {
        console.error("Unhandled auth error:", error);
        toast.error(error.message || "Authentication failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!auth.currentUser) {
      toast.error("No user found");
      return;
    }
    
    setLoading(true);
    try {
      await sendEmailVerification(auth.currentUser);
      toast.success("Verification email sent! Check your inbox and spam folder.");
    } catch (error: any) {
      console.error("Failed to resend verification:", error.code, error.message);
      toast.error(`Failed to send email: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOutFromVerification = async () => {
    try {
      await firebaseSignOut(auth);
      setVerificationSent(false);
      setPendingEmail('');
      setEmail('');
      setPassword('');
      setDisplayName('');
      toast.success("Signed out successfully");
    } catch (error: any) {
      console.error("Sign out error:", error);
      toast.error("Failed to sign out");
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resetEmail) {
      toast.error("Please enter your email address");
      return;
    }
    
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      toast.success("Password reset email sent! Check your inbox.");
      setResetEmail('');
      setForgotPasswordMode(false);
    } catch (error: any) {
      console.error("Password reset error:", error.code, error.message);
      
      if (error.code === 'auth/user-not-found') {
        toast.error("No account found with this email");
      } else if (error.code === 'auth/invalid-email') {
        toast.error("Please enter a valid email address");
      } else {
        toast.error(error.message || "Failed to send reset email");
      }
    } finally {
      setLoading(false);
    }
  };

  const social_btn_style = "w-full h-12 flex items-center justify-center gap-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all";

  // Forgot Password screen
  if (forgotPasswordMode) {
    return (
      <div className="w-full max-w-md mx-auto p-4">
        <div className="bg-white dark:bg-zinc-950 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden p-8">
          <div className="text-center mb-8">
            <button 
              onClick={() => {
                setForgotPasswordMode(false);
                setResetEmail('');
              }}
              className="mb-4 p-2 text-zinc-500 hover:text-indigo-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mx-auto" />
            </button>
            <h2 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tight mb-2">
              Reset Password
            </h2>
            <p className="text-xs text-zinc-500 font-medium tracking-wide">
              Enter your email to receive a reset link
            </p>
          </div>

          <form onSubmit={handlePasswordReset} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input 
                  type="email" 
                  placeholder="name@company.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full h-12 pl-10 pr-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold uppercase tracking-widest text-[10px]"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Send Reset Link'
              )}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  // Verification pending screen
  if (verificationSent) {
    return (
      <div className="w-full max-w-md mx-auto p-4">
        <div className="bg-white dark:bg-zinc-950 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden p-8">
          <div className="text-center">
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-16 h-16 bg-blue-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-blue-500/20"
            >
              <Mail className="w-8 h-8 text-white" />
            </motion.div>
            <h2 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tight mb-4">
              Verify Your Email
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
              We've sent a verification link to <span className="font-bold text-zinc-900 dark:text-white">{pendingEmail}</span>
            </p>
            <p className="text-xs text-zinc-500 mb-8">
              Check your inbox and spam folder. Click the link in the email to verify your account.
            </p>
            
            <div className="space-y-3">
              <Button 
                onClick={handleResendVerification}
                disabled={loading}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                Resend Verification Email
              </Button>
              
              <button 
                onClick={handleSignOutFromVerification}
                className="w-full h-12 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white rounded-xl font-bold uppercase tracking-widest text-[10px] transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className="bg-white dark:bg-zinc-950 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden p-8">
        <div className="text-center mb-8">
          {/* Robot with hands overlay */}
          <div className="relative w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <img src="../../../assets/robot.png" alt="Robot" className="w-20 h-20 object-contain z-10" />
            {/* Hands overlay for password hidden */}
            <RobotHands />
          </div>
          <h2 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tight mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-xs text-zinc-500 font-medium tracking-wide">
            {isLogin ? 'Access your intelligence workspace' : 'Join the future of data analysis'}
          </p>
        </div>

        <div className="space-y-4">
          <button 
            onClick={handleGoogleSignIn}
            disabled={loading}
            className={social_btn_style}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Chrome className="w-4 h-4 text-rose-500" />}
            Continue with Google
          </button>

          <div className="relative flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-zinc-100 dark:bg-zinc-800" />
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">or email</span>
            <div className="flex-1 h-px bg-zinc-100 dark:bg-zinc-800" />
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-4">
            {/* Robot hands logic component */}
            {/* This will be rendered above the form, see RobotHands below */}
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-1"
                >
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Full Name</label>
                  <div className="relative">
                    <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input 
                      type="text" 
                      placeholder="John Doe"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full h-12 pl-10 pr-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      required={!isLogin}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input 
                  type="email" 
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 pl-10 pr-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 pl-10 pr-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold uppercase tracking-widest text-[10px]"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                isLogin ? 'Sign In Workspace' : 'Create Account'
              )}
            </Button>
          </form>

          <div className="text-center mt-6">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest hover:text-indigo-600 transition-colors block w-full mb-3"
            >
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
            </button>
            
            {isLogin && (
              <button 
                onClick={() => setForgotPasswordMode(true)}
                className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest hover:text-indigo-600 transition-colors"
              >
                Forgot Password?
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
