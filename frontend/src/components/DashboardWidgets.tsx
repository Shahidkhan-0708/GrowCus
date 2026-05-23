'use client';

import React from 'react';
import { ArrowUpRight, ArrowDownRight, Sparkles } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  change?: number; // percentage
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
  theme?: 'blue' | 'purple' | 'emerald' | 'amber' | 'danger';
}

export const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  description, 
  change, 
  trend = 'neutral',
  icon,
  theme = 'blue'
}) => {
  const getBorderColor = () => {
    switch (theme) {
      case 'danger': return 'hover:border-brand-danger/30';
      case 'amber': return 'hover:border-brand-warning/30';
      default: return 'hover:border-brand-primary/30';
    }
  };

  const getAccentBg = () => {
    switch (theme) {
      case 'danger': return 'bg-red-50 text-brand-danger';
      case 'amber': return 'bg-amber-50 text-brand-warning';
      default: return 'bg-brand-light text-brand-primary';
    }
  };

  return (
    <div 
      className={`bg-white border border-brand-border/60 rounded-xl p-5 transition-all duration-300 card-hover glow-card-green ${getBorderColor()}`}
    >
      <div className="flex justify-between items-start">
        <div>
          <span className="text-xs font-medium text-gray-500">{title}</span>
          <h3 className="text-2xl font-bold tracking-tight text-gray-800 mt-1">{value}</h3>
        </div>
        {icon && (
          <div className={`p-2 rounded-lg ${getAccentBg()}`}>
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-center gap-1.5 mt-3">
        {change !== undefined && (
          <span className={`text-[10px] font-medium flex items-center ${
            trend === 'up' 
              ? 'text-brand-success' 
              : trend === 'down' 
                ? 'text-brand-danger' 
                : 'text-gray-400'
          }`}>
            {trend === 'up' ? <ArrowUpRight size={10} /> : trend === 'down' ? <ArrowDownRight size={10} /> : null}
            <span>{change > 0 ? `+${change}%` : `${change}%`}</span>
          </span>
        )}
        {description && (
          <span className="text-[10px] text-gray-400">{description}</span>
        )}
      </div>
    </div>
  );
};

interface AriaInsightWidgetProps {
  recommendation: string;
  onActionClick?: () => void;
  actionText?: string;
}

export const AriaInsightWidget: React.FC<AriaInsightWidgetProps> = ({ 
  recommendation, 
  onActionClick, 
  actionText = 'Acknowledge' 
}) => {
  return (
    <div className="aria-glow bg-white border border-brand-border rounded-xl p-5 relative overflow-hidden card-hover">
      <div className="flex items-start gap-4">
        <div className="p-2.5 rounded-lg bg-gradient-to-tr from-brand-primary to-brand-secondary text-white shrink-0 shadow-md shadow-brand-primary/15">
          <Sparkles size={16} className="animate-pulse" />
        </div>
        
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-1.5">
            <h4 className="text-xs font-semibold text-gray-800 tracking-wide uppercase">Aria&apos;s Intelligence Recommendation</h4>
            <span className="text-[9px] bg-brand-light text-brand-primary px-1.5 py-0.5 rounded-full font-medium">
              AI Insight
            </span>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed font-light">
            {recommendation}
          </p>

          {onActionClick && (
            <div className="pt-2">
              <button 
                onClick={onActionClick}
                className="text-xs font-medium text-brand-primary hover:text-brand-secondary transition-colors flex items-center gap-1 cursor-pointer btn-hover"
              >
                <span>{actionText}</span>
                <span className="text-[10px]">→</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface AnalyticsCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  headerAction?: React.ReactNode;
}

export const AnalyticsCard: React.FC<AnalyticsCardProps> = ({ 
  title, 
  subtitle, 
  children,
  headerAction 
}) => {
  return (
    <div className="bg-white border border-brand-border/60 rounded-xl overflow-hidden card-hover">
      <div className="p-5 border-b border-brand-border/40 flex justify-between items-center gap-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-800 tracking-tight">{title}</h3>
          {subtitle && <p className="text-[10px] text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
        {headerAction && (
          <div className="shrink-0">
            {headerAction}
          </div>
        )}
      </div>
      <div className="p-5">
        {children}
      </div>
    </div>
  );
};

// =============================================
// SKELETON LOADERS - Premium loading placeholders
// =============================================

export const MetricCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white border border-brand-border/60 rounded-xl p-5 shimmer-loading h-[110px] flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <div className="space-y-2 w-2/3">
          <div className="h-3 bg-gray-200 rounded w-1/2" />
          <div className="h-6 bg-gray-200 rounded w-3/4" />
        </div>
        <div className="w-9 h-9 bg-gray-200 rounded-lg" />
      </div>
      <div className="h-3 bg-gray-200 rounded w-1/3 mt-2" />
    </div>
  );
};

export const AnalyticsCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white border border-brand-border/60 rounded-xl overflow-hidden shimmer-loading h-[350px] flex flex-col">
      <div className="p-5 border-b border-brand-border/40 flex justify-between items-center">
        <div className="space-y-1.5 w-1/3">
          <div className="h-4 bg-gray-200 rounded" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="flex items-end gap-3 h-48 pt-4">
          <div className="bg-gray-200 rounded w-full h-[60%]" />
          <div className="bg-gray-200 rounded w-full h-[85%]" />
          <div className="bg-gray-200 rounded w-full h-[40%]" />
          <div className="bg-gray-200 rounded w-full h-[70%]" />
          <div className="bg-gray-200 rounded w-full h-[95%]" />
          <div className="bg-gray-200 rounded w-full h-[55%]" />
        </div>
        <div className="h-3 bg-gray-200 rounded w-1/4 mt-4" />
      </div>
    </div>
  );
};

