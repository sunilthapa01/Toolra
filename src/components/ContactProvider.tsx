'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import * as Icons from './Icons';

interface ContactContextType {
  openContactModal: () => void;
  closeContactModal: () => void;
}

const ContactContext = createContext<ContactContextType | undefined>(undefined);

type InquiryType = 'General Question' | 'Bug Report' | 'Feature Request' | 'Business Inquiry' | 'Partnership' | null;

export function ContactProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<InquiryType>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');
  const [copied, setCopied] = useState(false);

  const openContactModal = () => {
    setIsOpen(true);
    setSelectedType(null);
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
    setStatus('idle');
    setCopied(false);
  };

  const closeContactModal = () => {
    setIsOpen(false);
  };

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeContactModal();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const cards = [
    { type: 'General Question', desc: 'Ask us anything about Toolora', icon: <Icons.AlertCircle className="h-5 w-5 text-blue-500" /> },
    { type: 'Bug Report', desc: 'Report calculations or UI defects', icon: <Icons.Lock className="h-5 w-5 text-red-500" /> },
    { type: 'Feature Request', desc: 'Suggest new tool additions', icon: <Icons.Sparkles className="h-5 w-5 text-amber-500" /> },
    { type: 'Business Inquiry', desc: 'Discuss customized operations', icon: <Icons.Briefcase className="h-5 w-5 text-primary" /> },
    { type: 'Partnership', desc: 'Collab with our engineering team', icon: <Icons.Code className="h-5 w-5 text-purple-500" /> },
  ] as const;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setStatus('sending');

    // Simulate sending progress with premium feel
    setTimeout(() => {
      setStatus('success');

      // Prepare mailto link
      const emailSubject = encodeURIComponent(`[Toolora - ${selectedType}] ${subject || 'Inquiry'}`);
      const emailBody = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\nInquiry Type: ${selectedType}\n\nMessage:\n${message}`
      );
      
      const mailtoUrl = `mailto:npsofoact@gmail.com?subject=${emailSubject}&body=${emailBody}`;
      
      // Attempt to open the default mail client
      window.location.href = mailtoUrl;
    }, 1500);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText('npsofoact@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ContactContext.Provider value={{ openContactModal, closeContactModal }}>
      {children}

      {/* Backdrop blur modal wrapper */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          {/* Backdrop with animation */}
          <div 
            onClick={closeContactModal}
            className="absolute inset-0 bg-background/50 dark:bg-background/80 backdrop-blur-md transition-all duration-300 animate-fade-in"
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-lg bg-card border border-border rounded-3xl shadow-premium-2xl overflow-hidden transform transition-all duration-300 animate-scale-up z-10 flex flex-col max-h-[85vh]">
            
            {/* Header */}
            <div className="p-6 border-b border-border/40 flex justify-between items-start shrink-0">
              <div>
                <h2 className="font-outfit text-xl font-bold text-foreground">Contact Toolora</h2>
                <p className="text-xs text-muted mt-1 leading-relaxed">
                  Need help, found a bug, or have a feature request? We'd love to hear from you.
                </p>
              </div>
              <button 
                onClick={closeContactModal}
                className="h-8 w-8 rounded-full hover:bg-secondary flex items-center justify-center border border-border/30 transition-colors"
                aria-label="Close modal"
              >
                <Icons.X className="h-4 w-4 text-muted" />
              </button>
            </div>

            {/* Content area: switches between category selection, form inputs, sending progress, and success */}
            
            {status === 'idle' && !selectedType && (
              <div className="p-6 overflow-y-auto flex-1 space-y-6">
                <div className="space-y-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary block">
                    Choose inquiry category
                  </span>
                  <div className="grid grid-cols-1 gap-3">
                    {cards.map((card) => (
                      <button
                        key={card.type}
                        onClick={() => {
                          setSelectedType(card.type);
                          setSubject(card.type);
                        }}
                        className="w-full text-left p-4 bg-card hover:bg-secondary/45 border border-border/80 hover:border-primary/40 rounded-2xl transition-all duration-200 flex items-center gap-4 group shadow-premium-sm"
                      >
                        <div className="h-9 w-9 rounded-xl bg-secondary/35 flex items-center justify-center border border-border/50 group-hover:bg-primary/5 transition-colors">
                          {card.icon}
                        </div>
                        <div>
                          <div className="font-outfit text-sm font-bold text-foreground">{card.type}</div>
                          <div className="text-xs text-muted mt-0.5">{card.desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {status === 'idle' && selectedType && (
              <form onSubmit={handleSend} className="flex flex-col flex-1 overflow-hidden">
                
                {/* Scrollable Form Body */}
                <div className="p-6 overflow-y-auto flex-1 space-y-4">
                  
                  {/* Category Back Navigator */}
                  <button
                    type="button"
                    onClick={() => setSelectedType(null)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:opacity-80 transition-opacity mb-1"
                  >
                    <Icons.ChevronDown className="h-3 w-3 rotate-90" />
                    <span>Change Category</span>
                  </button>

                  <div className="p-3 bg-secondary border border-border rounded-xl flex items-center gap-2.5">
                    <span className="text-xs font-bold text-foreground">Category:</span>
                    <span className="inline-flex px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 text-[10px] font-bold uppercase tracking-wider">
                      {selectedType}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground uppercase tracking-wide">Name</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Sarah Jenkins"
                        className="w-full bg-background border border-border focus:border-primary/50 focus:ring-1 focus:ring-primary/20 rounded-xl px-4 py-3 text-xs outline-none transition-all text-foreground font-semibold placeholder:text-muted/60"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground uppercase tracking-wide">Email</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="sarah@example.com"
                        className="w-full bg-background border border-border focus:border-primary/50 focus:ring-1 focus:ring-primary/20 rounded-xl px-4 py-3 text-xs outline-none transition-all text-foreground font-semibold placeholder:text-muted/60"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground uppercase tracking-wide">Subject (Optional)</label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Add an inquiry subject"
                      className="w-full bg-background border border-border focus:border-primary/50 focus:ring-1 focus:ring-primary/20 rounded-xl px-4 py-3 text-xs outline-none transition-all text-foreground font-semibold placeholder:text-muted/60"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground uppercase tracking-wide">Message</label>
                    <textarea
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type details about your inquiry..."
                      className="w-full bg-background border border-border focus:border-primary/50 focus:ring-1 focus:ring-primary/20 rounded-xl px-4 py-3 text-xs outline-none transition-all text-foreground font-semibold placeholder:text-muted/60 resize-none"
                    />
                  </div>

                </div>

                {/* Sticky Action Footer */}
                <div className="p-6 border-t border-border/40 bg-secondary/15 flex items-center gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => setSelectedType(null)}
                    className="flex-1 bg-secondary text-foreground border border-border font-bold px-5 py-3.5 rounded-xl text-xs uppercase tracking-wider hover:bg-secondary/80 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-primary text-primary-foreground font-bold px-5 py-3.5 rounded-xl text-xs uppercase tracking-wider hover:opacity-95 transition-opacity cursor-pointer"
                  >
                    Send Message
                  </button>
                </div>

              </form>
            )}

            {status === 'sending' && (
              <div className="p-6 flex-1 flex flex-col items-center justify-center py-12 space-y-4">
                <div className="h-10 w-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                <div className="text-xs font-bold uppercase tracking-widest text-primary animate-pulse">
                  Preparing Inquiry...
                </div>
              </div>
            )}

            {status === 'success' && (
              <div className="p-6 overflow-y-auto flex-1 space-y-6 text-center">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 mt-4 mb-2">
                  <Icons.Check className="h-6 w-6" />
                </div>
                
                <div className="space-y-1.5">
                  <h3 className="font-outfit text-lg font-bold text-foreground">Message Prepared</h3>
                  <p className="text-xs text-muted leading-relaxed max-w-sm mx-auto">
                    Your message details have been formatted. Click below to launch your system's email editor or copy the address.
                  </p>
                </div>

                <div className="p-4 bg-secondary/25 border border-border/50 rounded-2xl max-w-sm mx-auto text-xs text-left space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase text-muted tracking-wider">
                    <span>Direct Email</span>
                    <span>npsofoact@gmail.com</span>
                  </div>
                  <p className="text-muted leading-relaxed font-semibold">
                    You can reach our helpdesk directly if the mail client fails to launch.
                  </p>
                  <button
                    onClick={copyToClipboard}
                    className="w-full flex items-center justify-center gap-1.5 bg-card hover:bg-secondary border border-border/80 text-foreground font-bold py-2 rounded-xl text-[10px] uppercase tracking-wider transition-colors shadow-premium-sm cursor-pointer"
                  >
                    <Icons.Share2 className="h-3 w-3" />
                    <span>{copied ? 'Copied!' : 'Copy Email Address'}</span>
                  </button>
                </div>

                <div className="pt-4 border-t border-border/40">
                  <button
                    onClick={closeContactModal}
                    className="w-full bg-primary text-primary-foreground font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider hover:opacity-95 transition-opacity cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>
      )}
    </ContactContext.Provider>
  );
}

export function useContact() {
  const context = useContext(ContactContext);
  if (!context) {
    throw new Error('useContact must be used within a ContactProvider');
  }
  return context;
}
