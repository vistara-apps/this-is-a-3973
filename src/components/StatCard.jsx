import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  color = 'nature-forest',
  description,
  onClick 
}) => {
  const colorMap = {
    'nature-forest': 'bg-nature-forest',
    'nature-sky': 'bg-nature-sky',
    'nature-moss': 'bg-nature-moss',
    'warning': 'bg-warning',
    'info': 'bg-info',
    'success': 'bg-success',
    'error': 'bg-error',
    // Legacy colors for backward compatibility
    emerald: 'bg-emerald-600',
    blue: 'bg-blue-600',
    purple: 'bg-purple-600',
    orange: 'bg-orange-600',
  };

  const isPositiveTrend = trend && trend.startsWith('+');
  const TrendIcon = isPositiveTrend ? TrendingUp : TrendingDown;
  const trendColor = isPositiveTrend ? 'text-success' : 'text-error';

  return (
    <div 
      className={`group bg-dark-card rounded-xl p-6 border border-dark-border transition-all duration-300 hover:border-nature-forest/50 hover:shadow-lg hover:shadow-nature-forest/10 ${
        onClick ? 'cursor-pointer hover:scale-105' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${colorMap[color]} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <div className={`flex items-center ${trendColor} text-sm font-medium`}>
            <TrendIcon className="w-4 h-4 mr-1" />
            {trend}
          </div>
        )}
      </div>
      <div className="space-y-1">
        <div className="text-2xl font-bold text-white group-hover:text-nature-forest transition-colors duration-300">
          {value}
        </div>
        <div className="text-slate-300 font-medium">{title}</div>
        {description && (
          <div className="text-slate-400 text-xs">{description}</div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
