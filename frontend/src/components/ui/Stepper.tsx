"use client";

import React, { Children, useState, ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LucideIcon, AlertCircle } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface StepperProps {
  children: ReactNode;
  initialStep?: number;
  validateStep?: (step: number) => boolean | Promise<boolean>;
  onBeforeComplete?: () => Promise<boolean> | boolean;
  onFinalStepCompleted?: () => void;
  stepIcons?: LucideIcon[];
  stepCompletedIcons?: LucideIcon[];
  stepWarnings?: number[];
  title?: string;
  subtitle?: string;
  onClose?: () => void;
}

export interface StepProps {
  children: ReactNode;
}

export function Step({ children }: StepProps) {
  return <>{children}</>;
}

export default function Stepper({
  children,
  initialStep = 1,
  validateStep,
  onBeforeComplete,
  onFinalStepCompleted,
  stepIcons,
  stepCompletedIcons,
  stepWarnings = [],
  title,
  subtitle,
  onClose,
}: StepperProps) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [direction, setDirection] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const stepsArray = Children.toArray(children);
  const totalSteps = stepsArray.length;
  const progressPercent = Math.round((currentStep / totalSteps) * 100);

  const handleNext = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      if (validateStep) {
        const isValid = await validateStep(currentStep);
        if (!isValid) return; // Validation failed
      }

      if (currentStep < totalSteps) {
        setDirection(1);
        setCurrentStep((prev) => prev + 1);
      } else if (currentStep === totalSteps) {
        if (onBeforeComplete) {
          const success = await onBeforeComplete();
          if (success !== false && onFinalStepCompleted) {
            onFinalStepCompleted();
          }
        } else if (onFinalStepCompleted) {
          onFinalStepCompleted();
        }
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1 && !isProcessing) {
      setDirection(-1);
      setCurrentStep((prev) => prev - 1);
    }
  };

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 40 : -40,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      zIndex: 0,
      x: dir < 0 ? 40 : -40,
      opacity: 0,
    }),
  };

  return (
    <div className="flex flex-col h-full bg-surface-container-lowest">
      {/* Header */}
      <div className="px-10 pt-10 pb-6 border-b border-outline-variant/20 shrink-0">
        {(title || onClose) && (
          <div className="flex justify-between items-start mb-8">
            <div>
              {title && <h2 className="text-2xl font-headline font-bold text-on-surface tracking-tight">{title}</h2>}
              {subtitle && <p className="text-sm text-on-surface-variant font-medium mt-1">{subtitle}</p>}
            </div>
            {onClose && (
              <button onClick={onClose} disabled={isProcessing} className="text-outline hover:text-primary transition-colors disabled:opacity-50">
                <span className="material-symbols-outlined">close</span>
              </button>
            )}
          </div>
        )}

        <div className="space-y-3">
          <div className="flex justify-between text-xs font-label font-medium text-on-surface-variant">
            <span className="font-bold uppercase tracking-widest text-primary">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-primary font-bold">{progressPercent}% Complete</span>
          </div>
          <div className="h-1 w-full bg-surface-container-high rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: `${((currentStep - 1) / totalSteps) * 100}%` }}
              animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
              transition={{ ease: "easeInOut", duration: 0.3 }}
            />
          </div>
        </div>

        {/* Optional Step Icons Row */}
        {stepIcons && (
          <div className="flex justify-between items-center mt-6">
            {stepIcons.map((Icon, idx) => {
              const stepNumber = idx + 1;
              const isCompleted = stepNumber < currentStep;
              const isActive = stepNumber === currentStep;
              const isWarning = stepWarnings.includes(stepNumber);
              const CompletedIcon = stepCompletedIcons ? stepCompletedIcons[idx] : Icon;

              return (
                <div key={idx} className="flex flex-col items-center gap-2">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300",
                      isCompleted ? "bg-primary text-on-primary" : isActive ? "bg-primary-container text-on-primary-container ring-2 ring-primary ring-offset-2" : "bg-surface-container-high text-on-surface-variant",
                      isWarning && "ring-2 ring-error text-error bg-error-container"
                    )}
                  >
                    {isWarning ? <AlertCircle size={16} /> : (isCompleted && CompletedIcon ? <CompletedIcon size={16} /> : <Icon size={16} />)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Content Area with Overflow Management */}
      <div className="flex-1 relative overflow-hidden bg-surface-container-lowest">
        <AnimatePresence custom={direction} mode="wait" initial={false}>
          {/* We use an absolute wrapper for animations, but its children should provide scrolling if needed */}
          <motion.div
            key={currentStep}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            // absolute inset-0 allows the container to exactly fit and content inside can scroll
            className="absolute inset-0 w-full h-full overflow-y-auto hide-scrollbar"
          >
            {stepsArray[currentStep - 1]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="px-10 py-3 bg-surface-container-low flex justify-between items-center shrink-0 border-t border-outline-variant/20">
        <button
          onClick={handleBack}
          disabled={currentStep === 1 || isProcessing}
          className="flex items-center gap-2 text-primary font-headline font-bold text-sm px-6 py-2 hover:bg-primary-container/10 transition-colors rounded-lg disabled:opacity-50 disabled:pointer-events-none"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          Back
        </button>

        <button
          onClick={handleNext}
          disabled={isProcessing}
          className="bg-primary text-on-primary font-headline font-bold text-sm px-10 py-3 rounded hover:opacity-90 transition-all shadow-md active:scale-95 disabled:opacity-70 disabled:pointer-events-none flex items-center gap-2"
        >
          {isProcessing ? (
            <span className="material-symbols-outlined animate-spin text-[20px]">sync</span>
          ) : null}
          {currentStep === totalSteps ? 'Publish' : 'Continue'}
          {currentStep < totalSteps && !isProcessing && (
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          )}
        </button>
      </div>
    </div>
  );
}
