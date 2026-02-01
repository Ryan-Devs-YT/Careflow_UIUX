import { AlertTriangle, CheckCircle, XCircle, Info } from 'lucide-react';
import { motion } from 'motion/react';
import { Medicine, checkInteractions } from '@/app/data/medicines';

interface SafetyMatrixProps {
  medications: Medicine[];
}

export function SafetyMatrix({ medications }: SafetyMatrixProps) {
  const { risk, interactions } = checkInteractions(medications);
  
  const getRiskConfig = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high':
        return {
          icon: XCircle,
          color: 'text-error-main',
          bgColor: 'bg-error-light',
          borderColor: 'border-error-main',
          message: 'High Risk - Multiple interactions detected',
          description: 'Please consult your doctor immediately'
        };
      case 'medium':
        return {
          icon: AlertTriangle,
          color: 'text-warning-main',
          bgColor: 'bg-warning-light',
          borderColor: 'border-warning-main',
          message: 'Medium Risk - Some interactions detected',
          description: 'Be cautious and monitor for side effects'
        };
      default:
        return {
          icon: CheckCircle,
          color: 'text-success-dark',
          bgColor: 'bg-success-light',
          borderColor: 'border-success-main',
          message: 'Low Risk - No concerning interactions',
          description: 'Your medications appear safe together'
        };
    }
  };

  const config = getRiskConfig(risk);

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
      <h3 className="text-xl font-bold text-neutral-800 mb-4 flex items-center gap-2">
        <Info className="w-5 h-5 text-healing-sage-600" />
        Safety Matrix
      </h3>
      
      <motion.div 
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className={`p-4 rounded-xl border-2 ${config.bgColor} ${config.borderColor}`}
      >
        <div className="flex items-start gap-3">
          <config.icon className={`w-6 h-6 ${config.color} flex-shrink-0 mt-1`} />
          <div className="flex-1">
            <h4 className={`font-bold ${config.color}`}>{config.message}</h4>
            <p className="text-sm text-neutral-600 mt-1">{config.description}</p>
          </div>
        </div>
      </motion.div>

      {interactions.length > 0 && (
        <div className="mt-4">
          <h5 className="font-semibold text-neutral-700 mb-2">Potential Interactions:</h5>
          <div className="space-y-2">
            {interactions.map((interaction, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-2 p-2 bg-neutral-50 rounded-lg"
              >
                <AlertTriangle className="w-4 h-4 text-warning-main" />
                <span className="text-sm text-neutral-700">{interaction}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {risk !== 'low' && (
        <div className="mt-4 p-3 bg-healing-sage-50 rounded-lg border border-healing-sage-200">
          <p className="text-sm text-healing-sage-700">
            <strong>Recommendation:</strong> Consider discussing these interactions with your healthcare provider at your next appointment.
          </p>
        </div>
      )}
    </div>
  );
}